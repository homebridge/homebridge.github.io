import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'

import { HapService } from '../hap.service'
import { MatterService } from '../matter.service'
import { SidebarService } from '../sidebar.service'

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  hapService = inject(HapService)
  matterService = inject(MatterService)
  sidebarService = inject(SidebarService)
  router = inject(Router)

  public services
  public id = 1
}
