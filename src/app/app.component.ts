import { Component } from '@angular/core';
import { HapService } from './hap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public hapService: HapService,
  ) {}

}
