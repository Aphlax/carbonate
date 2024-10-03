import {Component, HostBinding, OnInit} from '@angular/core';
import {GameCounterComponent} from "../game-counter/game-counter.component";
import {NgFor} from "@angular/common";
import {
  HASH_PARSE_REGEX,
  HASH_SEPARATOR,
  ICONS_PARSE_REGEX,
  Player,
  PLAYER_PARSE_REGEX
} from "../../lib/constants";

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
  standalone: true,
  imports: [GameCounterComponent, NgFor],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent implements OnInit {
  players: Player[] = [];
  private startingLifeTotal: number = 0;

  @HostBinding('class') get playerCount(): string {
    return "n-" + this.players.length;
  }

  getOrientation(index: number): string {
    return ORIENTATIONS[this.players.length - 1][index];
  }

  ngOnInit(): void {
    const {players, startingLifeTotal} = this.parseHash(window.location.hash.slice(1));
    this.players = players;
    this.startingLifeTotal = startingLifeTotal;
  }


  private getHash(players: Player[], startingLifeTotal: number): string {
    return players.map(pl =>
      pl.color + pl.counters[0].value + pl.counters.slice(1).map(c => c.icon + c.value).join())
      .join() + HASH_SEPARATOR + startingLifeTotal;
  }

  private parseHash(hash: string): { players: Player[], startingLifeTotal: number } {
    const match = hash.match(HASH_PARSE_REGEX);
    if (!match) return {players: [], startingLifeTotal: 0};
    const [_, playersHash, startingLifeTotalHash] = match;
    const startingLifeTotal = startingLifeTotalHash ? parseInt(startingLifeTotalHash) : 0;

    const players = [];
    for (let [_, color, value, icons] of playersHash.matchAll(PLAYER_PARSE_REGEX)) {
      const counters = [];
      for (let [_, icon, value] of icons.matchAll(ICONS_PARSE_REGEX)) {
        counters.push({icon, value: parseInt(value)});
      }
      players.push({color, counters: [{icon: "", value: parseInt(value)}, ...counters]});
    }

    return {players, startingLifeTotal};
  }
}
