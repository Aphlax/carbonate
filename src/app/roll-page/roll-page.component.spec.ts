import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RollPageComponent} from './roll-page.component';
import {RouterModule} from "@angular/router";

describe('RollPageComponent', () => {
  let component: RollPageComponent;
  let fixture: ComponentFixture<RollPageComponent>;
  let mockWindow = {location: {hash: '4:40'}};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{provide: 'Window', useValue: mockWindow}],
      imports: [RollPageComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RollPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
