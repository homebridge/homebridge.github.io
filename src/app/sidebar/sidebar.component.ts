import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router'
import { filter, map } from 'rxjs/operators'

import { HapService } from '../hap.service'
import { MatterService } from '../matter.service'
import { SearchComponent } from '../search/search.component'
import { SidebarService } from '../sidebar.service'

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, SearchComponent, RouterLinkActive, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  hapService = inject(HapService)
  matterService = inject(MatterService)
  sidebarService = inject(SidebarService)
  router = inject(Router)

  // The current url as a signal, so the section highlighting below re-runs
  // on every navigation - a plain read of router.url would go stale under
  // OnPush change detection.
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  )

  /**
   * Whether the open page belongs to the given paths, for lighting up a
   * section title. routerLinkActive cannot do this: a section's pages are not
   * all under the title's own link (Categories lives at /categories but
   * belongs to the HAP section), and prefix matching on /api would light
   * API Reference up for every /api page.
   */
  isSectionActive(...paths: string[]): boolean {
    const url = this.currentUrl()
    return paths.some(
      path =>
        url === path
        || url.startsWith(`${path}/`)
        || url.startsWith(`${path}#`),
    )
  }
}
