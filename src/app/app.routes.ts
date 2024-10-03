import { Routes } from '@angular/router';
import {StartPageComponent} from "./start-page/start-page.component";
import {GamePageComponent} from "./game-page/game-page.component";
import {SetupPageComponent} from "./setup-page/setup-page.component";
import {RollPageComponent} from "./roll-page/roll-page.component";

export const routes: Routes = [
  {
    path: '',
    component: StartPageComponent,
  },
  {
    path: 'setup',
    component: SetupPageComponent,
  },
  {
    path: 'roll',
    component: RollPageComponent,
  },
  {
    path: 'game',
    component: GamePageComponent,
  }
];
