import { Directive, ElementRef, Input } from '@angular/core';

declare var Prism;

@Directive({
  selector: '[prism]',
})
export class PrismDirective {
  constructor(
    private el: ElementRef,
  ) {}

  @Input() set prism(val) {
    const codeElement = document.createElement('code');
    codeElement.innerHTML = val;
    this.el.nativeElement.innerHTML = codeElement.outerHTML;
    Prism.highlightElement(this.el.nativeElement);
  }

}
