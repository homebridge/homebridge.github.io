import { Directive, ElementRef, inject, input, OnChanges } from '@angular/core'

declare let Prism: any

@Directive({ selector: '[appPrism]' })
export class PrismDirective implements OnChanges {
  private el = inject(ElementRef)

  readonly appPrism = input('')

  ngOnChanges(): void {
    const codeElement = document.createElement('code')
    codeElement.innerHTML = this.appPrism()
    this.el.nativeElement.innerHTML = codeElement.outerHTML
    Prism.highlightElement(this.el.nativeElement)
  }
}
