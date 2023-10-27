import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceComponent } from './service/service.component';
import { CharacteristicComponent } from './characteristic/characteristic.component';
import { DocsComponent } from './docs/docs.component';
import { DocsGuard } from './docs/docs.guard';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  {
    path: '',
    component: DocsComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'service/:serviceName',
    component: ServiceComponent,
  },
  {
    path: 'service',
    redirectTo: 'service/AccessControl',
  },
  {
    path: 'characteristic/:characteristicName',
    component: CharacteristicComponent,
  },
  {
    path: 'characteristic',
    redirectTo: 'characteristic/AccessControlLevel',
  },
  {
    path: 'api',
    component: DocsComponent,
    children: [
      {
        path: '',
        redirectTo: 'reference',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: DocsComponent,
        canActivate: [DocsGuard],
      },
    ],
  },
  {
    path: '**',
    canActivate: [DocsGuard],
    component: DocsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {
    useHash: true,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 75],
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
