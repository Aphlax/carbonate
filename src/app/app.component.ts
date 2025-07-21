import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {animate, group, query, style, transition, trigger} from "@angular/animations";

const left = style({ transform: 'translateX(-100vw)' });
const center = style({ transform: 'translateX(0)' });
const right = style({ transform: 'translateX(100vw)' });

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('page', [
      transition(':increment', [
        group([
          query(':leave', [animate('180ms ease-out', left)], { optional: true }),
          query(':enter', [right, animate('180ms ease-out', center)], { optional: true }),
        ]),
      ]),
      transition(':decrement', [
        group([
          query(':leave', [animate('180ms ease-out', right)], { optional: true }),
          query(':enter', [left, animate('180ms ease-out', center)], { optional: true }),
        ]),
      ]),
    ])
  ]
})
export class AppComponent {
  pageIndex = 0;
}
