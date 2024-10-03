import { FitCounterDirective } from './fit-counter.directive';
import {Component, DebugElement} from "@angular/core";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";

@Component({
  standalone: true,
  template: `<div style="width: 90px; height: 90px;" fitCounter>30</div>`,
  imports: [FitCounterDirective],
})
class TestComponent {}

describe('FitCounterDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let elem: DebugElement;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [FitCounterDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // Initial binding.

    elem = fixture.debugElement.queryAll(By.directive(FitCounterDirective))[0];
  });

  it('should set the right font size', () => {
    expect(elem.nativeElement.style.fontSize).toEqual('84px');
  });
});
