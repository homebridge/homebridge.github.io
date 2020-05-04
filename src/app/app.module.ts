import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CharacteristicComponent } from './characteristic/characteristic.component';
import { ServiceComponent } from './service/service.component';
import { SearchComponent } from './search/search.component';
import { DocsComponent } from './docs/docs.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ServiceComponent,
    CharacteristicComponent,
    SearchComponent,
    DocsComponent,
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
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          baseUrl: '/#/',
        },
      },
    }),
    AppRoutingModule,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
