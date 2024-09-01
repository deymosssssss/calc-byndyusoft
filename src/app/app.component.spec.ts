import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CalculatorModule } from './calculator/calculator.module';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [CalculatorModule],
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
