import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {GameCounterComponent} from "../game-counter/game-counter.component";
import {NgClass, NgFor} from "@angular/common";
import {parseHash, Player} from "../../lib/constants";
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

  @HostBinding('class') get playerCount(): string {
    return "n-" + this.players.length;
  }

  getOrientation(index: number): string {
    return ORIENTATIONS[this.players.length - 1][index];
  }

  visibilityChangeEvent = this.onVisibilityChange.bind(this);

  get shareUrl() {
    return location.protocol + '//' + location.host + location.hash;
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

  reset() {
    this.players.forEach(player => player.counters[0].value = this.startingLifeTotal);
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
}
