import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CalculatorModule } from './calculator/calculator.module';

@NgModule({
  imports: [BrowserModule, CalculatorModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
