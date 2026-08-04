import { CommonModule, NgOptimizedImage } from '@angular/common'
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Tokens } from 'marked'
import { TypeaheadModule } from 'ngx-bootstrap/typeahead'
import { MarkdownModule, MARKED_OPTIONS, MarkedRenderer } from 'ngx-markdown'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CategoriesComponent } from './categories/categories.component'
import { CharacteristicComponent } from './characteristic/characteristic.component'
import { DocsComponent } from './docs/docs.component'
import { MatterDeviceTypeComponent } from './matter-device-type/matter-device-type.component'
import { PrismDirective } from './prism.directive'
import { SearchComponent } from './search/search.component'
import { ServiceComponent } from './service/service.component'
import { SidebarComponent } from './sidebar/sidebar.component'

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        // marked 9 removed the baseUrl option this site relied on, so the same
        // behaviour lives in a link renderer instead: a relative link in the
        // markdown resolves under the hash router rather than escaping it and
        // 404ing on GitHub Pages. Absolute links, fragments and full URLs pass
        // through untouched. Images are unaffected - every image in the docs
        // uses a full URL. Written against marked 13+'s renderer API, where the
        // renderer receives the whole link token and renders the inner text
        // itself (a plain function, because `this.parser` is set by marked).
        useFactory: () => {
          const renderer = new MarkedRenderer()
          renderer.link = function ({ href, title, tokens }: Tokens.Link) {
            const text = this.parser.parseInline(tokens)
            const target = /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(href)
              ? href
              : `/#/${href}`
            const titleAttr = title ? ` title="${title}"` : ''
            return `<a href="${target}"${titleAttr}>${text}</a>`
          }
          return { renderer }
        },
      },
    }),
    AppRoutingModule,
    NgOptimizedImage,
  ],
  declarations: [
    AppComponent,
    SidebarComponent,
    ServiceComponent,
    CharacteristicComponent,
    SearchComponent,
    DocsComponent,
    PrismDirective,
    CategoriesComponent,
    MatterDeviceTypeComponent,
  ],
  providers: [provideHttpClient(withXhr(), withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
