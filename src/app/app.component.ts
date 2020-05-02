import { Component } from '@angular/core';
import { HapService } from './hap.service';
import { Router, NavigationEnd } from '@angular/router';

declare var $: any;

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

    /** Sidebar control - from the CoderDocs theme */
    $(window).on('load resize', () => {
      const w = $(window).width();
      if (w >= 1200) {
        // if larger
        $('#docs-sidebar').addClass('sidebar-visible').removeClass('sidebar-hidden');
      } else {
        // if smaller
        $('#docs-sidebar').addClass('sidebar-hidden').removeClass('sidebar-visible');
      }
    });

    $(document).ready(() => {
      $('#docs-sidebar-toggler').on('click', () => {
        if ($('#docs-sidebar').hasClass('sidebar-visible')) {
          $('#docs-sidebar').removeClass('sidebar-visible').addClass('sidebar-hidden');
        } else {
          $('#docs-sidebar').removeClass('sidebar-hidden').addClass('sidebar-visible');
        }
      });
    });


  }

}
