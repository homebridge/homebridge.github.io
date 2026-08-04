import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocsGuard  {
  constructor(
    private router: Router,
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const fullPath = next.pathFromRoot.map(route => {
      return route.url.map(x => x.path).join('/');
    }).join('/');

    if (fullPath.toLowerCase().endsWith('.md')) {
      this.router.navigate([fullPath.substr(0, fullPath.lastIndexOf('.'))]);
      return false;
    } else if (fullPath.startsWith('/.')) {
      this.router.navigate([fullPath.slice(1)]);
      return false;
    } else {
      return true;
    }
  }

}
