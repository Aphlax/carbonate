import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {GameCounterComponent} from "../game-counter/game-counter.component";
import {NgClass, NgFor} from "@angular/common";
import {createHash, parseHash, Player} from "../../lib/constants";
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
  showHistory: boolean = false;
  showDice: boolean = false;
  diceMin: number = 1;
  diceMax: number = 6;
  diceResult: number[] = [];

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
}
