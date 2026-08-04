import { Directive, ElementRef, inject, Input, OnChanges } from '@angular/core'

declare let Prism

@Directive({
  selector: '[appPrism]',
})
export class PrismDirective implements OnChanges {
  private el = inject(ElementRef)

  @Input() appPrism

  ngOnChanges(): void {
    const codeElement = document.createElement('code')
    codeElement.innerHTML = this.appPrism
    this.el.nativeElement.innerHTML = codeElement.outerHTML
    Prism.highlightElement(this.el.nativeElement)
  }
}
