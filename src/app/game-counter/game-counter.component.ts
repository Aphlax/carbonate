import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {MatRippleModule} from "@angular/material/core";
import {IconComponent} from "../icon/icon.component";
import {NgFor} from "@angular/common";
import {FitCounterDirective} from "../fit-counter.directive";
import {ChangeCounterEvent, COLORS, Counter, Player, SetCountersEvent} from "../../lib/constants";
import {MatButtonModule, MatIconButton} from "@angular/material/button";

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'game-counter',
  standalone: true,
  imports: [MatRippleModule, IconComponent, NgFor, FitCounterDirective, MatIconButton, MatButtonModule],
  templateUrl: './game-counter.component.html',
  styleUrl: './game-counter.component.scss'
})
export class GameCounterComponent implements OnInit {
  @Input({required: true}) player!: Player;
  @Input({required: true}) @HostBinding("class") direction!: string;
  @Input({required: true}) history?: Player;
  @Input({required: true}) showMenuEvent!: EventEmitter<void>;
  @Output() onChangeCounter = new EventEmitter<ChangeCounterEvent>();
  @Output() onSetCounters = new EventEmitter<SetCountersEvent>();

  ngOnInit(): void {
    this.showMenuEvent.subscribe(this.cancelFastChange.bind(this));
  }

  @HostBinding('style.color') get color(): string {
    return COLORS.get(this.player.color)!;
  }

  get rippleColor(): string {
    return COLORS.get(this.player.color)! + "80";
  }

  fastIncrement: boolean = false;
  touchPoint?: Point;
  timeoutHandle: number = 0;
  public counters: { [id: string]: boolean } = {};
  open: number = 0;

  get openStyle() {
    if (this.direction == 'down') {
      return `top: ${this.open}%;`;
    } else if (this.direction == 'left') {
      return `right: ${this.open}%; left: unset;`;
    } else if (this.direction == 'up') {
      return `bottom: ${this.open}%; top: unset;`;
    } else if (this.direction == 'right') {
      return `left: ${this.open}%;`;
    } else return '';
  }

  touchStart(icon: string, amount: number, event: TouchEvent) {
    if (event.touches.length > 1) return;
    this.touchPoint = {x: event.touches[0].clientX, y: event.touches[0].clientY};
    this.fastIncrement = false;
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    this.timeoutHandle = setTimeout(this.update.bind(this), 300, icon, amount);
  }

  update(counter: string, amount: number) {
    this.onChangeCounter.emit({player: this.player.color, counter, amount});
    this.fastIncrement = true;
    this.timeoutHandle = setTimeout(this.update.bind(this), 90, counter, amount);
  }

  touchMove(event: TouchEvent) {
    if (event.changedTouches.length > 1 || !this.touchPoint) return;
    const {clientX, clientY} = event.changedTouches[0];
    if (Math.sqrt((clientX - this.touchPoint.x) ** 2 + (clientY - this.touchPoint.y) ** 2) < 20) return;
    this.fastIncrement = true;
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = 0;
    }
    let open = this.direction == 'left' || this.direction == 'right' ?
      this.touchPoint.x - clientX : this.touchPoint.y - clientY;
    open *= this.direction == 'left' || this.direction == 'up' ? 1 : -1;
    this.open = Math.floor(Math.min(Math.max(0, open), 100));
  }

  touchEnd(counter: string, amount: number) {
    if (!this.fastIncrement) {
      this.onChangeCounter.emit({player: this.player.color, counter, amount});
    }
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = 0;
    }
    if (this.open != 0 && this.open != 100) {
      this.open = 100 * Math.round(this.open / 100);
    }
  }

  changeCounters() {
    this.onSetCounters.emit({player: this.player.color, counters: this.counters});
  }

  cancelFastChange() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = 0;
    }
  }

  public showDelta(counter: Counter): boolean {
    if (!this.history) return false;
    const old = this.history.counters.find(c => c.icon == counter.icon);
    if (!old) return false;
    return old.value != counter.value;
  }

  public getDelta(counter: Counter): string {
    if (!this.history) return "";
    const old = this.history.counters.find(c => c.icon == counter.icon);
    if (!old) return "";
    return (old.value >= counter.value ? "" : "+") + (counter.value - old.value);
  }
}
