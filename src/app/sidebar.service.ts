import { Injectable, signal } from '@angular/core'

/**
 * Holds the open/closed state of the sidebar. The toggler button in the header
 * (app component) and the sidebar itself both bind to this, and it follows the
 * same rule as the CSS: open by default on xl screens, closed below that.
 */
@Injectable({ providedIn: 'root' })
export class SidebarService {
  private static readonly XL_BREAKPOINT = 1200

  public readonly visible = signal(window.innerWidth >= SidebarService.XL_BREAKPOINT)

  toggle() {
    this.visible.update(visible => !visible)
  }

  matchWindowSize() {
    this.visible.set(window.innerWidth >= SidebarService.XL_BREAKPOINT)
  }

  closeOnMobile() {
    if (window.innerWidth < SidebarService.XL_BREAKPOINT) {
      this.visible.set(false)
    }
  }
}
