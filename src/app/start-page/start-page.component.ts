import {Component} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {QRCodeModule} from "angularx-qrcode";
import {IconComponent} from "../icon/icon.component";
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'start-page',
  host: {'class': 'page'},
  standalone: true,
  imports: [
    MatButtonModule,
    QRCodeModule,
    RouterLink,
    MatIcon,
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
