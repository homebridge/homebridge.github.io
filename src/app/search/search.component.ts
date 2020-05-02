import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer, of } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';

import { HapService } from '../hap.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public searchProvider: Observable<any>
  public query;

  constructor(
    private hapService: HapService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.searchProvider = new Observable((observer: Observer<string>) => {
      observer.next(this.query);
    }).pipe(
      debounceTime(200),
      switchMap((query: string) => {

        query = query.toLocaleLowerCase();

        const matchingServices = this.hapService.services.filter((x) => {
          return x.displayName.toLowerCase().indexOf(query) > -1 ||
            x.name.toLowerCase().indexOf(query) > -1 ||
            x.UUID.toLowerCase() === query;
        });

        const matchingCharacteristics = this.hapService.characteristics.filter((x) => {
          return x.displayName.toLowerCase().indexOf(query) > -1 ||
            x.name.toLowerCase().indexOf(query) > -1 ||
            x.UUID.toLowerCase() === query;
        });

        const results = [];

        results.push(...matchingServices.map(x => {
          return {
            routerLink: ['/service', x.name],
            label: `Service: ${x.displayName}`
          }
        }));

        results.push(...matchingCharacteristics.map(x => {
          return {
            routerLink: ['/characteristic', x.name],
            label: `Characteristic: ${x.displayName}`
          }
        }));

        return of(results);
      })
    )
  }

  onSelect(event) {
    this.router.navigate(event.item.routerLink);
    this.query = null;
  }

}
