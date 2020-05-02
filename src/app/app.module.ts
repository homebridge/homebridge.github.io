import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { CharacteristicComponent } from './characteristic/characteristic.component';
import { ServiceComponent } from './service/service.component';
import { ApiReferenceComponent } from './api-reference/api-reference.component';
import { ApiReferenceEntryComponent } from './api-reference-entry/api-reference-entry.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    IntroductionComponent,
    ServiceComponent,
    CharacteristicComponent,
    ApiReferenceComponent,
    ApiReferenceEntryComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    HttpClientModule,
    HighlightModule,
    AppRoutingModule,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
