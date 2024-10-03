import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  selector: 'start-page',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss'
})
export class StartPageComponent {




  get gameHash() {
    return window.location.hash.slice(1);
  }
}
