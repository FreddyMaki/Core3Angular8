import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[highlight]' })

export class HighlightDirective {
  constructor(private el: ElementRef) { }

  @Input() defaultColor: string="";
  @Input('highlight') highlightColor: string="";

  //Set color on mouse enter
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || this.defaultColor || 'red');
  }

  //Set null color on mouse leave
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  //Execute this method when mouseenter or mouse leave
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
