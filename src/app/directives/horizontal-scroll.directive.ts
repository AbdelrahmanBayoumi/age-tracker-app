// horizontal-scroll.directive.ts
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appHorizontalScroll]',
    standalone: false
})
export class HorizontalScrollDirective {
  private isDragging = false;
  private startX: number = 0;
  private scrollLeft: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX;
    this.scrollLeft = this.el.nativeElement.scrollLeft;

    this.renderer.addClass(this.el.nativeElement, 'dragging');
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent): void {
    if (!this.isDragging) {
      return;
    }
    const deltaX = event.clientX - this.startX;
    this.el.nativeElement.scrollLeft = this.scrollLeft - deltaX;
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent): void {
    this.isDragging = false;
    this.renderer.removeClass(this.el.nativeElement, 'dragging');
  }

  @HostListener('mouseleave', ['$event'])
  onMouseleave(event: MouseEvent): void {
    this.isDragging = false;
    this.renderer.removeClass(this.el.nativeElement, 'dragging');
  }
}
