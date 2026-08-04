import { Routes } from '@angular/router'

import { CategoriesComponent } from './categories/categories.component'
import { CharacteristicComponent } from './characteristic/characteristic.component'
import { DocsComponent } from './docs/docs.component'
import { DocsGuard } from './docs/docs.guard'
import { MatterDeviceTypeComponent } from './matter-device-type/matter-device-type.component'
import { ServiceComponent } from './service/service.component'

export const routes: Routes = [
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
  // The bare list urls land on the first entry of the matching generated
  // list. The sidebar links carry the live first entry themselves, so these
  // only serve direct urls - update them if a new first entry appears.
  {
    path: 'service',
    redirectTo: 'service/AccessCode',
  },
  {
    path: 'characteristic/:characteristicName',
    component: CharacteristicComponent,
  },
  {
    path: 'characteristic',
    redirectTo: 'characteristic/AccessCodeControlPoint',
  },
  {
    path: 'matter-device-type/:deviceTypeName',
    component: MatterDeviceTypeComponent,
  },
  {
    path: 'matter-device-type',
    redirectTo: 'matter-device-type/AirQualitySensor',
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
]
