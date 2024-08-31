import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalculatorComponent } from './calculator.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CalculatorComponent],
  exports: [CalculatorComponent],
})
export class CalculatorModule {}
