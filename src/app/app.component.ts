import { Component } from '@angular/core';
import { HapService } from './hap.service';
import { Router, NavigationEnd } from '@angular/router';

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
