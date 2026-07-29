import { Component } from '@angular/core';
import { HapService } from '../hap.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {

  constructor(
    public hapService: HapService,
  ) { }

}
