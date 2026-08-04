import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'

import { HapService } from '../hap.service'
import { MatterService } from '../matter.service'
import { SearchComponent } from '../search/search.component'
import { SidebarService } from '../sidebar.service'

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, SearchComponent, RouterLinkActive, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SidebarComponent {
  hapService = inject(HapService)
  matterService = inject(MatterService)
  sidebarService = inject(SidebarService)
  router = inject(Router)

  public services
  public id = 1

  /**
   * Whether the open page belongs to the given paths, for lighting up a
   * section title. routerLinkActive cannot do this: a section's pages are not
   * all under the title's own link (Categories lives at /categories but
   * belongs to the HAP section), and prefix matching on /api would light
   * API Reference up for every /api page.
   */
  isSectionActive(...paths: string[]): boolean {
    const url = this.router.url
    return paths.some(
      path =>
        url === path
        || url.startsWith(`${path}/`)
        || url.startsWith(`${path}#`),
    )
  }
}
