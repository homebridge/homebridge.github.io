import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CategoriesComponent } from './categories/categories.component'
import { CharacteristicComponent } from './characteristic/characteristic.component'
import { DocsComponent } from './docs/docs.component'
import { DocsGuard } from './docs/docs.guard'
import { MatterDeviceTypeComponent } from './matter-device-type/matter-device-type.component'
import { ServiceComponent } from './service/service.component'

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
    path: 'matter-device-type/:deviceTypeName',
    component: MatterDeviceTypeComponent,
  },
  {
    path: 'matter-device-type',
    redirectTo: 'matter-device-type/OnOffLight',
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

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 75],
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
