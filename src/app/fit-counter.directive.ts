import {
  AfterViewChecked,
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[fitCounter]',
  standalone: true
})
export class FitCounterDirective implements AfterViewInit, OnChanges, AfterViewChecked {
  @Input() fitCounter!: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private styles: CSSStyleDeclaration;

  constructor(private elem: ElementRef) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.styles = getComputedStyle(elem.nativeElement);
  }

  @HostListener('window:resize')
  public onWindowResize = (): void => {
    this.setFontSize();
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fitCounter'] && !changes['fitCounter'].firstChange ||
      changes['innerHTML'] && !changes['innerHTML'].firstChange) {
      this.setFontSize();
    }
  }

  ngAfterViewInit(): void {
    this.setFontSize();
  }

  ngAfterViewChecked(): void {
    this.setFontSize();
  }

  private setFontSize() {
    let height = this.elem.nativeElement.clientHeight, width = this.elem.nativeElement.clientWidth;
    if (this.styles.writingMode == 'vertical-rl') {
      [height, width] = [width, height];
    }

    const fontWeight = this.styles.fontWeight || 'normal';
    const fontFamily = this.styles.fontFamily || 'Arial';
    let fontSize = Math.min(height - 6, 180);
    this.ctx.font = `${fontWeight} ${fontSize + "px"} ${fontFamily}`;
    const expectedWidth = this.ctx.measureText(this.fitCounter.toString()).width;
    if (expectedWidth > width) {
      fontSize = Math.floor(fontSize * width / expectedWidth);
    }
    this.elem.nativeElement.style.fontSize = fontSize + "px";
    this.elem.nativeElement.style.lineHeight = height + "px";
  }
}
