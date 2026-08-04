import { Routes } from '@angular/router'

import { DocsGuard } from './docs/docs.guard'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./docs/docs.component').then(m => m.DocsComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./categories/categories.component').then(
        m => m.CategoriesComponent,
      ),
  },
  {
    path: 'service/:serviceName',
    loadComponent: () =>
      import('./service/service.component').then(m => m.ServiceComponent),
  },
  // The bare list urls land on the first entry of the matching generated
  // list. The sidebar links carry the live first entry themselves, so these
  // only serve direct urls - update them if a new first entry appears.
  {
    path: 'service',
    redirectTo: 'service/AccessCode',
  },
  {
    path: 'characteristic/:characteristicName',
    loadComponent: () =>
      import('./characteristic/characteristic.component').then(
        m => m.CharacteristicComponent,
      ),
  },
  {
    path: 'characteristic',
    redirectTo: 'characteristic/AccessCodeControlPoint',
  },
  {
    path: 'matter-device-type/:deviceTypeName',
    loadComponent: () =>
      import('./matter-device-type/matter-device-type.component').then(
        m => m.MatterDeviceTypeComponent,
      ),
  },
  {
    path: 'matter-device-type',
    redirectTo: 'matter-device-type/AirQualitySensor',
  },
  {
    path: 'api',
    loadComponent: () =>
      import('./docs/docs.component').then(m => m.DocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'reference',
        pathMatch: 'full',
      },
      {
        path: '**',
        loadComponent: () =>
          import('./docs/docs.component').then(m => m.DocsComponent),
        canActivate: [DocsGuard],
      },
    ],
  },
  {
    path: '**',
    canActivate: [DocsGuard],
    loadComponent: () =>
      import('./docs/docs.component').then(m => m.DocsComponent),
  },
]
