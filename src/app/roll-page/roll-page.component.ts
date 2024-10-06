import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {COLORS, getRandomColor, HASH_SEPARATOR, PLAYER_POSITIONS} from "../../lib/constants";

class PlayerTouch {
  x!: number;
  y!: number;
  id!: number;
  color!: string;
  circle = 0;
  winner = false;
}

function ease(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function hump(x: number): number {
  return x < 0.5 ? ease(2 * x) : ease(2 - 2 * x);
}

const CIRCLE_RADIUS = 40;
const CIRCLE_RADIUS_HUMP = 100;
const CIRCLE_SIZE = (t: number) => t < 0.5 ? 0 : t < 1.5 ? hump(t - 0.5) : t < 2.5 ? hump(t - 1.5) : t < 3.5 ? ease(t - 2.5) * 2 : 2;
const CIRCLE_SIZE_LOSER = (t: number) => t < 3.5 ? 1 - ease(t - 2.5) : 0;

function getCircleRadius(t: number, winner: boolean): number {
  if (t > 2.5 && !winner) {
    return CIRCLE_SIZE_LOSER(t) * CIRCLE_RADIUS;
  }
  const p = CIRCLE_SIZE(t);
  return (1 - p) * CIRCLE_RADIUS + p * CIRCLE_RADIUS_HUMP;
}

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
export class RollPageComponent implements OnInit, AfterViewInit, OnDestroy {
  randomColors: string[] = [];
  players!: number;
  life!: number;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationHandle: number = 0;
  private touches: PlayerTouch[] = [];
  private rollStart = 0;
  private done = false;

  constructor(private router: Router) {
  }

  @HostBinding("class.rolling") get isRolling() {
    return !!this.touches.length;
  }

  get gameHash() {
    return this.randomColors.map(c => c + this.life).join("") + HASH_SEPARATOR + this.life;
  }

  ngOnInit(): void {
    if (!window.location.hash) return;
    this.players = parseInt(window.location.hash.slice(1, 2));
    this.life = parseInt(window.location.hash.slice(3, 5));
    this.randomColors = [];
    for (let i = 0; i < this.players; i++) {
      this.randomColors.push(getRandomColor(this.randomColors));
    }
  }

  ngAfterViewInit(): void {
    this.animationHandle = window.requestAnimationFrame(this.update.bind(this));
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
  }

  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.animationHandle);
    this.animationHandle = 0;
  }

  touchStart(e: TouchEvent) {
    if (this.done) return;
    this.rollStart = 0;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const color = getRandomColor(this.touches.map(t2 => t2.color));
      this.touches.push({
        x: t.clientX,
        y: t.clientY,
        id: t.identifier,
        color,
        circle: 0,
        winner: false
      })
    }
  }

  touchMove(e: TouchEvent) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const t2 = this.touches.find(t2 => t.identifier == t2.id);
      if (!t2) continue;
      t2.x = t.clientX;
      t2.y = t.clientY;
    }
  }

  touchEnd(e: TouchEvent) {
    if (!this.done) {
      this.rollStart = 0;
    }
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const j = this.touches.findIndex(t2 => t.identifier == t2.id);
      if (j != -1) {
        this.touches.splice(j, 1);
      }
    }
    if (this.done && !this.touches.length) {
      this.router.navigate(["/game"], {fragment: this.gameHash});
    }
    e.preventDefault();
  }

  private update(time: number) {
    if (!this.rollStart && this.touches.length >= this.players) {
      this.rollStart = time;
    }
    if (this.rollStart && (time - this.rollStart) > 2500 && !this.done) {
      this.done = true;
      this.touches[Math.floor(Math.random() * this.touches.length)].winner = true;

      this.randomColors = [];
      for (let i = 0; i < this.players; i++) {
        let best!: PlayerTouch, minDistance = Number.MAX_VALUE;
        for (let touch of this.touches) {
          if (this.randomColors.includes(touch.color)) continue;
          const {x, y} = PLAYER_POSITIONS[this.players - 1][i];
          const distance = (this.ctx.canvas.width * x - touch.x) ** 2 +
            (this.ctx.canvas.height * y - touch.y) ** 2;
          if (distance < minDistance) {
            minDistance = distance;
            best = touch;
          }
        }
        this.randomColors.push(best.color);
      }
    }

    for (let touch of this.touches) {
      const circle = this.rollStart ?
        getCircleRadius((time - this.rollStart) / 1000, touch.winner) : CIRCLE_RADIUS;
      if (Math.abs(touch.circle - circle) < 0.1) {
        touch.circle = circle;
      } else {
        touch.circle += (circle - touch.circle) * 0.2;
      }
    }

    this.draw();
    window.requestAnimationFrame(this.update.bind(this));
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.lineWidth = 12;
    for (let touch of this.touches) {
      this.ctx.strokeStyle = COLORS.get(touch.color)!;
      this.ctx.beginPath();
      this.ctx.arc(touch.x, touch.y, touch.circle, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
  }
}
