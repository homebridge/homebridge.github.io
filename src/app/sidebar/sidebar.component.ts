import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HapService } from '../hap.service';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  public services;
  public id = 1;

  constructor(
    public hapService: HapService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    /** Sidebar control - from the CoderDocs theme */
    $('#docs-sidebar-toggler').on('click', () => {
      if ($('#docs-sidebar').hasClass('sidebar-visible')) {
        $('#docs-sidebar').removeClass('sidebar-visible').addClass('sidebar-hidden');
      } else {
        $('#docs-sidebar').removeClass('sidebar-hidden').addClass('sidebar-visible');
      }
    });
  }

  ngAfterViewInit() {
    $(window).on('resize', () => {
      this.toggleSidebarDisplay();
    });

    this.toggleSidebarDisplay();
  }

  toggleSidebarDisplay() {
    const w = $(window).width();
    if (w >= 1200) {
      // if larger
      $('#docs-sidebar').addClass('sidebar-visible').removeClass('sidebar-hidden');
    } else {
      // if smaller
      $('#docs-sidebar').addClass('sidebar-hidden').removeClass('sidebar-visible');
    }
  }

}
