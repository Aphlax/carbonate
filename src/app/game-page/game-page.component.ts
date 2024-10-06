import {Component, HostBinding, OnInit} from '@angular/core';
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
export class GamePageComponent implements OnInit {
  players: Player[] = [];
  private startingLifeTotal: number = 0;
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

  ngOnInit(): void {
    const {players, startingLifeTotal} = parseHash(window.location.hash.slice(1));
    this.players = players;
    this.startingLifeTotal = startingLifeTotal;
  }

  reset() {
    this.players.forEach(player => player.counters[0].value = this.startingLifeTotal);
  }

  get shareUrl() {
    return window.location.toString();
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
