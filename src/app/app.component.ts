import { Component } from '@angular/core';
import { HapService } from './hap.service';
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
    router: Router,
  ) {

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        // Google Analytics Event Trigger
        gtag('config', 'UA-165871119-1',
          {
            'page_path': event.urlAfterRedirects,
          },
        );

        // Close sidebar after navigation on mobile
        if (window.innerWidth >= 1200) {
          return;
        }
        const sidebar = document.getElementById('docs-sidebar');
        if (sidebar && sidebar.classList.contains('sidebar-visible')) {
          sidebar.classList.remove('sidebar-visible');
          sidebar.classList.add('sidebar-hidden');
        }
      }
    });

  }
}
