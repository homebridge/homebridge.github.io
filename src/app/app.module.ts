import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HighlightModule } from 'ngx-highlightjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { CharacteristicComponent } from './characteristic/characteristic.component';
import { ServiceComponent } from './service/service.component';
import { ApiReferenceComponent } from './api-reference/api-reference.component';
import { ApiReferenceEntryComponent } from './api-reference-entry/api-reference-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    IntroductionComponent,
    ServiceComponent,
    CharacteristicComponent,
    ApiReferenceComponent,
    ApiReferenceEntryComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    HighlightModule,
    AppRoutingModule,
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
