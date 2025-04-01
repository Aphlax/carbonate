import {Component, EventEmitter, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {GameCounterComponent} from "../game-counter/game-counter.component";
import {LocationStrategy, NgClass, NgFor} from "@angular/common";
import {
  COLORS,
  createHash,
  HISTORY_AMEND_TIME,
  HISTORY_TIMEOUT,
  HistoryHeaderItem,
  HistoryItem,
  parseHash,
  Player
} from "../../lib/constants";
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {IconComponent} from "../icon/icon.component";
import {RouterLink} from "@angular/router";
import {MatRippleModule} from "@angular/material/core";
import {QRCodeModule} from "angularx-qrcode";

const ORIENTATIONS = [
  ["down"],
  ["up", "down"],
  ["left", "right", "down"],
  ["left", "right", "left", "right"],
  ["left", "right", "left", "right", "down"],
  ["left", "right", "left", "right", "left", "right"],
];

@Component({
  selector: 'game-page',
  host: {'class': 'page'},
  standalone: true,
  imports: [GameCounterComponent, NgFor, MatButtonModule, IconComponent, NgClass, MatIcon, RouterLink, MatRippleModule, QRCodeModule],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  private startingLifeTotal: number = 0;
  wakeLock?: WakeLockSentinel = undefined;
  showMenu: boolean = false;
  showShare: boolean = false;
  showReset: boolean = false;
  showHistory: boolean = false;
  showDice: boolean = false;
  diceMin: number = 1;
  diceMax: number = 6;
  diceResult: number[] = [];
  history: HistoryItem[] = [];
  historyHeader: HistoryHeaderItem[] = [];
  historyHandle: number = 0;
  showMenuEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private location: LocationStrategy) {
    history.pushState(null, "", window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, "", window.location.href);
      this.showMenuEvent.emit();
      this.showMenu = true;
    });
  }

  @HostBinding('class') get playerCount(): string {
    return "n-" + this.players.length;
  }

  getOrientation(index: number): string {
    return ORIENTATIONS[this.players.length - 1][index];
  }

  visibilityChangeEvent = this.onVisibilityChange.bind(this);

  get shareUrl() {
    return location.protocol + '//' + location.host + "#" + createHash(this.players, this.startingLifeTotal);
  }

  async ngOnInit() {
    const {players, startingLifeTotal} = parseHash(window.location.hash.slice(1));
    this.players = players;
    this.startingLifeTotal = startingLifeTotal;
    this.addHistory(Date.now(), players);

    document.addEventListener('visibilitychange', this.visibilityChangeEvent);
    document.addEventListener('fullscreenchange', this.visibilityChangeEvent);
    await this.engageWakeLock();
  }

  async ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.visibilityChangeEvent);
    document.removeEventListener('fullscreenchange', this.visibilityChangeEvent);
    if (this.wakeLock) {
      await this.wakeLock.release();
      this.wakeLock = undefined;
    }
  }

  async engageWakeLock() {
    if (!('wakeLock' in navigator && 'request' in navigator.wakeLock)) {
      return;
    }
    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
    } catch (e) {
    }
  }

  changeCounter(player: string, counter: string, amount: number) {
    const c = this.players.find(p => p.color == player)?.counters.find(c => c.icon == counter);
    if (c) {
      c.value = c.value + amount;
      this.recordHistory();
    }
  }

  setCounters(player: string, counters: { [id: string]: boolean }) {
    const p = this.players.find(p => p.color == player);
    if (p) {
      for (let icon of Object.keys(counters)) {
        if (counters[icon] && !p.counters.some(c => c.icon == icon)) {
          p.counters.push({icon, value: 0});
        }
        const i = p.counters.findIndex(c => c.icon == icon);
        if (!counters[icon] && i != -1) {
          p.counters.splice(i, 1);
        }
      }
    }
  }

  reset() {
    this.players.forEach(player => {
      player.counters[0].value = this.startingLifeTotal;
      player.counters.length = 1;
    });
    this.recordHistory();
  }

  async onVisibilityChange() {
    if (this.wakeLock?.released && document.visibilityState == 'visible') {
      return await this.engageWakeLock();
    }
  }

  async share() {
    if ('share' in navigator) {
      await navigator.share({url: this.shareUrl});
    } else if ('clipboard' in navigator) {
      // @ts-expect-error
      await navigator.clipboard.writeText(this.shareUrl);
    }
  }

  throwDice() {
    this.diceResult = [];
    for (let i = 0; i < 7; i++) {
      this.diceResult[i] = Math.floor(this.diceMin + Math.random() * (this.diceMax - this.diceMin + 1));
      if (this.diceResult[i] == this.diceResult[i - 1]) {
        this.diceResult[i] = Math.floor(this.diceMin + Math.random() * (this.diceMax - this.diceMin + 1));
      }
    }
  }

  recordHistory() {
    if (this.historyHandle) {
      clearTimeout(this.historyHandle);
    }
    this.historyHandle = setTimeout(this.addHistory.bind(this), HISTORY_TIMEOUT, Date.now(), this.players);
  }

  submitHistory() {
    if (this.historyHandle) {
      this.addHistory(Date.now(), this.players);
    }
  }

  addHistory(time: number, players: Player[]) {
    this.historyHandle = 0;
    if (this.history.length) {
      const last = this.history[this.history.length - 1];
      let changes = 0;
      for (let player of players) {
        for (let counter of player.counters) {
          const lastPlayer = last.players.find(p => p.color == player.color);
          const lastCounter = lastPlayer?.counters.find(c => c.icon == counter.icon);
          if (lastCounter?.value != counter.value) {
            changes++;
          }
        }
      }
      if (!changes) return;
      if (time < last.time + HISTORY_AMEND_TIME) {
        for (let player of players) {
          for (let counter of player.counters) {
            const lastPlayer = last.players.find(p => p.color == player.color);
            const lastCounter = lastPlayer?.counters.find(c => c.icon == counter.icon);
            if (lastCounter) {
              lastCounter.value = counter.value;
            }
          }
        }
        return;
      }
    }
    const pls: Player[] = [];
    for (let player of players) {
      pls.push({color: player.color, counters: player.counters.map(c => ({...c}))});
      const header = this.historyHeader.find(h => h.color == player.color);
      if (!header) {
        this.historyHeader.push({color: player.color, counters: player.counters.map(c => c.icon)});
        continue;
      }
      for (let counter of player.counters) {
        if (!header.counters.includes(counter.icon)) {
          header.counters.push(counter.icon);
        }
      }
    }
    this.history.push({time, players: pls});
  }

  getLastHistory(color: string): Player | undefined {
    return this.history[this.history.length - 1].players.find(pl => pl.color == color);
  }

  color(colorId: string): string {
    return COLORS.get(colorId)!;
  }

  rowItems(player: Player, historyIndex: number): string[] {
    const header = this.historyHeader.find(p => p.color == player.color);
    if (!header) return [];
    const values: string[] = [];
    for (const c of header.counters) {
      const lastValue = this.history[historyIndex - 1]?.players
        .find(p => p.color == player.color)?.counters.find(cc => cc.icon == c);
      const currentValue = player.counters.find(cc => cc.icon == c);
      if (currentValue && lastValue?.value != currentValue.value) {
        values.push(currentValue.value.toString());
      } else {
        values.push('');
      }
    }
    return values;
  }
}
