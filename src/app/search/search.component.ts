import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { TypeaheadDirective } from 'ngx-bootstrap/typeahead'
import { Observable, Observer, of } from 'rxjs'
import { debounceTime, switchMap } from 'rxjs/operators'

import { HapService } from '../hap.service'
import { MatterService } from '../matter.service'

@Component({
  selector: 'app-search',
  imports: [FormsModule, TypeaheadDirective],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SearchComponent implements OnInit {
  private hapService = inject(HapService)
  private matterService = inject(MatterService)
  private router = inject(Router)

  public searchProvider: Observable<any>
  public query

  ngOnInit(): void {
    this.searchProvider = new Observable((observer: Observer<string>) => {
      observer.next(this.query)
    }).pipe(
      debounceTime(200),
      switchMap((query: string) => {
        query = query.toLocaleLowerCase()

        const matchingServices = this.hapService.services.filter((x) => {
          return (
            x.displayName.toLowerCase().includes(query)
            || x.name.toLowerCase().includes(query)
            || x.UUID.toLowerCase() === query
          )
        })

        const matchingCharacteristics = this.hapService.characteristics.filter(
          (x) => {
            return (
              x.displayName.toLowerCase().includes(query)
              || x.name.toLowerCase().includes(query)
              || x.UUID.toLowerCase() === query
            )
          },
        )

        const results = []

        results.push(
          ...matchingServices.map((x) => {
            return {
              routerLink: ['/service', x.name],
              label: `Service: ${x.displayName}`,
            }
          }),
        )

        results.push(
          ...matchingCharacteristics.map((x) => {
            return {
              routerLink: ['/characteristic', x.name],
              label: `Characteristic: ${x.displayName}`,
            }
          }),
        )

        const matchingDeviceTypes = this.matterService.deviceTypes.filter(
          (x) => {
            return (
              x.name.toLowerCase().includes(query)
              || x.matterName.toLowerCase().includes(query)
            )
          },
        )

        results.push(
          ...matchingDeviceTypes.map((x) => {
            return {
              routerLink: ['/matter-device-type', x.name],
              label: `Matter Device Type: ${x.name}`,
            }
          }),
        )

        return of(results)
      }),
    )
  }

  onSelect(event) {
    this.router.navigate(event.item.routerLink)
    this.query = null
  }
}
