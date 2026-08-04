import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HapService } from '../hap.service';
import { MatterService } from '../matter.service';
import { SidebarService } from '../sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  public services;
  public id = 1;

  constructor(
    public hapService: HapService,
    public matterService: MatterService,
    public sidebarService: SidebarService,
    public router: Router,
  ) { }
}
