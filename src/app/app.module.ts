import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ThemeBoxComponent } from './theme-box/theme-box.component';
import { FormsModule } from '@angular/forms';
import { Theme } from './theme';

@NgModule({
  declarations: [
    AppComponent,
    ThemeBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
