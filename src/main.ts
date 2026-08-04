import { ViewportScroller } from '@angular/common'
import { HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http'
import { enableProdMode, inject, provideEnvironmentInitializer, provideZoneChangeDetection } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router'
import { Tokens } from 'marked'
import { MARKED_OPTIONS, MarkedRenderer, provideMarkdown } from 'ngx-markdown'

import { AppComponent } from './app/app.component'
import { routes } from './app/app.routes'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideAnimations(),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    // withInMemoryScrolling has no scrollOffset option; setting it on the
    // ViewportScroller is the standalone equivalent of the old RouterModule
    // scrollOffset, keeping anchor scrolls clear of the fixed header.
    provideEnvironmentInitializer(() => inject(ViewportScroller).setOffset([0, 75])),
    provideMarkdown({
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
            const target = /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(href) ? href : `/#/${href}`
            const titleAttr = title ? ` title="${title}"` : ''
            return `<a href="${target}"${titleAttr}>${text}</a>`
          }
          return { renderer }
        },
      },
    }),
  ],
}).catch(err => console.error(err))
