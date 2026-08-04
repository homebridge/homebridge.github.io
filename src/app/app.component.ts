import { Component, HostListener } from '@angular/core';
import { HapService } from './hap.service';
import { MatterService } from './matter.service';
import { SidebarService } from './sidebar.service';
import { Router, NavigationEnd } from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
    public hapService: HapService,
    public matterService: MatterService,
    public sidebarService: SidebarService,
    router: Router,
  ) {

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        // Google Analytics Event Trigger
        gtag('config', 'UA-165871119-1',
          {
            'page_path': '/#' + event.urlAfterRedirects,
          },
        );

        // Close sidebar after navigation on mobile
        this.sidebarService.closeOnMobile();
      }
    });

  }

  @HostListener('window:resize')
  onWindowResize() {
    this.sidebarService.matchWindowSize();
  }
}
