import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {COLORS, HASH_SEPARATOR} from "../../lib/constants";

@Component({
  selector: 'roll-page',
  host: {'class': 'page'},
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './roll-page.component.html',
  styleUrl: './roll-page.component.scss'
})
export class RollPageComponent implements OnInit {
  randomColors: number[] = [];
  players!: number;
  life!: number;

  // noinspection JSAnnotator
  @ViewChild('canvas') canvas!: HTMLElement;
  private touches!: TouchList;

  ngOnInit(): void {
    if (!window.location.hash) return;
    this.players = parseInt(window.location.hash.slice(1, 2));
    this.life = parseInt(window.location.hash.slice(3, 5));
    this.randomColors = new Array(this.players).fill(0).map(() => Math.floor(Math.random() * COLORS.size));
  }

  get gameHash() {
    return this.randomColors.map(c => [...COLORS.keys()][c] + this.life).join("") +
      HASH_SEPARATOR + this.life;
  }
}
