import {Component, HostBinding, Input} from '@angular/core';
import {MatRippleModule} from "@angular/material/core";
import {IconComponent} from "../icon/icon.component";
import {NgFor} from "@angular/common";
import {FitCounterDirective} from "../fit-counter.directive";
import {COLORS, Player} from "../../lib/constants";

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'game-counter',
  standalone: true,
  imports: [MatRippleModule, IconComponent, NgFor, FitCounterDirective],
  templateUrl: './game-counter.component.html',
  styleUrl: './game-counter.component.scss'
})
export class GameCounterComponent {
  @Input({required: true}) player!: Player;

  @HostBinding('style.color') get color(): string {
    return COLORS.get(this.player.color)!;
  }

  get rippleColor(): string {
    return COLORS.get(this.player.color)! + "80";
  }

  firstChange: boolean = false;
  touchPoint?: Point;
  timeoutHandle: number = 0;

  touchStart(icon: string, amount: number, event: TouchEvent) {
    if (event.touches.length > 1) return;
    this.touchPoint = {x: event.touches[0].clientX, y: event.touches[0].clientY};
    this.firstChange = false;
    this.timeoutHandle = setTimeout(this.update.bind(this), 300, icon, amount);
  }

  update(icon: string, amount: number) {
    this.player.counters.find(c => c.icon == icon)!.value += amount;
    this.firstChange = true;
    this.timeoutHandle = setTimeout(this.update.bind(this), 90, icon, amount);
  }

  touchMove(event: TouchEvent) {
    if (event.changedTouches.length > 1 || !this.touchPoint) return;
    if (Math.sqrt((event.changedTouches[0].clientX - this.touchPoint.x) ** 2 +
      (event.changedTouches[0].clientY - this.touchPoint.y) ** 2) < 20) return;
    this.firstChange = true;
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = 0;
    }
  }

  touchEnd(icon: string, amount: number) {
    if (!this.firstChange) {
      this.player.counters.find(c => c.icon == icon)!.value += amount;
    }
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = 0;
    }
  }
}
