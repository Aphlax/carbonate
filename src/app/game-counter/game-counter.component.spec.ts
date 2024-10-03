import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCounterComponent } from './game-counter.component';
import {RouterModule} from "@angular/router";

describe('GameCounterComponent', () => {
  let component: GameCounterComponent;
  let fixture: ComponentFixture<GameCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCounterComponent, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameCounterComponent);
    component = fixture.componentInstance;
    component.player = {color: "W", counters: []};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
