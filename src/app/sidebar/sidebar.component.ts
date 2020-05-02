import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HapService } from '../hap.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public services;
  public id = 1;

  constructor(
    public hapService: HapService,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

}
