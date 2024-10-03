import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[fitCounter]',
  standalone: true
})
export class FitCounterDirective implements AfterViewInit, OnChanges {

  constructor(private elem: ElementRef) {

  }

  @HostListener('window:resize')
  public onWindowResize = (): void => {
    this.setFontSize();
  };

  private setFontSize() {
    let height = this.elem.nativeElement.clientHeight, width = this.elem.nativeElement.clientWidth;
    if (getComputedStyle(this.elem.nativeElement).writingMode == 'vertical-rl') {
      [height, width] = [width, height];
    }


    this.elem.nativeElement.style.fontSize = (height - 6) + "px";
  }

  ngAfterViewInit(): void {
    this.setFontSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['innerHTML']) {
      if (!changes['innerHTML'].firstChange) {
        this.setFontSize();
      }
    }
  }
}
