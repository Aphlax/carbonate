import {Component, OnInit} from '@angular/core';
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {COLORS, HASH_SEPARATOR} from "../../lib/constants";
import {CommonModule, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'setup-page',
  standalone: true,
  imports: [
    MatRadioButton,
    MatRadioGroup,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    FormsModule,
    NgIf,
    CommonModule,
  ],
  templateUrl: './setup-page.component.html',
  styleUrl: './setup-page.component.scss'
})
export class SetupPageComponent implements OnInit {
  randomColors = [Math.floor(Math.random() * COLORS.size)];
  players: number = 4;
  life: number = 40;

  ngOnInit(): void {
    if (!window.location.hash) return;
    this.players = parseInt(window.location.hash.slice(1, 2));
    this.life = parseInt(window.location.hash.slice(3, 5));
  }

  get gameHash() {
    return this.randomColors.map(c => [...COLORS.keys()][c])[0] + this.life + HASH_SEPARATOR + this.life;
  }
}
