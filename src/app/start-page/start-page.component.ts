import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {QRCodeModule} from "angularx-qrcode";
import {IconComponent} from "../icon/icon.component";

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
export class StartPageComponent implements OnInit {
  public readonly pageIndex = 0;
  showShare = false;
  showInstall = false;
  installPrompt?: any;
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

  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt',
        e => (this.installPrompt = e) && e.preventDefault());
    window.addEventListener('appinstalled', () => this.installPrompt = undefined);
  }

  install() {
    if (!this.installPrompt) {
      this.showInstall = true;
      return;
    }
    this.installPrompt.prompt();
    this.installPrompt.userChoice.then((result: string) => {
      if (result == "accepted") {
        this.installPrompt = undefined;
      }
    });
  }
}
