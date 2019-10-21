import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxVScrollModule } from 'ngx-vscroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxVScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
