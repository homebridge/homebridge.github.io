import { NgOptimizedImage } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router'

import { HapService } from './hap.service'
import { MatterService } from './matter.service'
import { SearchComponent } from './search/search.component'
import { SidebarService } from './sidebar.service'
import { SidebarComponent } from './sidebar/sidebar.component'

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    NgOptimizedImage,
    SearchComponent,
    SidebarComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    '(window:resize)': 'onWindowResize()',
  },
})
export class AppComponent {
  hapService = inject(HapService)
  matterService = inject(MatterService)
  sidebarService = inject(SidebarService)

  constructor() {
    const router = inject(Router)

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Close sidebar after navigation on mobile
        this.sidebarService.closeOnMobile()
      }
    })
  }

  onWindowResize() {
    this.sidebarService.matchWindowSize()
  }
}
