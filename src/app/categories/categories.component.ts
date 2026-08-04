import { Component, inject } from '@angular/core'

import { HapService } from '../hap.service'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  hapService = inject(HapService)
}
