import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {NgClass, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {QRCodeModule} from "angularx-qrcode";
import {IconComponent} from "../icon/icon.component";

@Component({
  selector: 'start-page',
  host: {'class': 'page'},
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgIf,
    NgClass,
    MatIcon,
    QRCodeModule,
    IconComponent,
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss'
})
export class StartPageComponent {
  showShare = false;
  showInstall = false;
  rotation = 0;

  get gameHash() {
    return location.hash.slice(1);
  }

  get shareUrl() {
    return location.protocol + '//' + location.host;
  }

  get isPwa() {
    return (window.matchMedia('(display-mode: fullscreen)').matches) ||
      ((window.navigator as any).standalone) ||
      document.referrer.includes('android-app://');
  }
}
