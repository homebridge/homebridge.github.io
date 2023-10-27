import { Component, OnInit } from '@angular/core';
import { HapService } from '../hap.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {

  constructor(
    public hapService: HapService,
  ) { }

  ngOnInit(): void {
  }

}
