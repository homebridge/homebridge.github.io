import { Component, inject } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'

import { HapService } from './hap.service'
import { MatterService } from './matter.service'
import { SidebarService } from './sidebar.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
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
