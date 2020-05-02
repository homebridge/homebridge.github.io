import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroductionComponent } from './introduction/introduction.component';
import { ServiceComponent } from './service/service.component';
import { CharacteristicComponent } from './characteristic/characteristic.component';
import { ApiReferenceComponent } from './api-reference/api-reference.component';

const routes: Routes = [
  {
    path: '',
    component: IntroductionComponent,
  },
  {
    path: 'reference',
    component: ApiReferenceComponent,
  },
  {
    path: 'reference/:anchor',
    component: ApiReferenceComponent,
  },
  {
    path: 'service',
    redirectTo: 'service/AccessControl'
  },
  {
    path: 'service/:serviceName',
    component: ServiceComponent,
  },
  {
    path: 'characteristic',
    redirectTo: 'characteristic/AccessControlLevel'
  },
  {
    path: 'characteristic/:characteristicName',
    component: CharacteristicComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {useHash: true, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
