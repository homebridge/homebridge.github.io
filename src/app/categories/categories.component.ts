import { Component, inject } from '@angular/core'

import { HapService } from '../hap.service'

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  hapService = inject(HapService)
}
