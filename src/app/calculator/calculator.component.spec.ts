import { ComponentFixture, TestBed } from '@angular/core/testing';
import { schema } from '../core/schema';
import { Button, ButtonType } from '../core/types';
import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  let charButton: Button;
  let operatorButton: Button;
  let clearButton: Button;
  let clearOneButton: Button;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculatorComponent],
    });
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    charButton = { type: ButtonType.CHAR, value: '5' };
    operatorButton = { type: ButtonType.OPERATOR, priority: 1, value: '+', inputValue: '+', eval: (num1: number, num2: number) => num1 + num2 };
    clearButton = { type: ButtonType.CLEAR };
    clearOneButton = { type: ButtonType.CLEAR_ONE };
  });

  describe('onButtonClick', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize operators correctly', () => {
      component.setOperators();
      const operatorCount = schema.filter((control) => control.type === ButtonType.OPERATOR).length;
      expect(Object.keys(component.operatorList).length).toBe(operatorCount);
    });

    it('should append character to input value', () => {
      component.onButtonClick(charButton);
      expect(component.inputValue).toBe('5');
    });

    it('should append operator to input value', () => {
      component.inputValue = '5';
      component.onButtonClick(operatorButton);
      expect(component.inputValue).toBe('5+');
    });

    it('should clear input value and history', () => {
      component.inputValue = '5+3';
      component.inputHistory = '5+';
      component.onButtonClick(clearButton);
      expect(component.inputValue).toBe('');
      expect(component.inputHistory).toBe('');
    });

    it('should clear last character from input value', () => {
      component.inputValue = '5+3';
      component.onButtonClick(clearOneButton);
      expect(component.inputValue).toBe('5+');
    });
  });

  describe('stringToArr', () => {
    it('should correctly parse input string into array', () => {
      const input = '3+5*2-(4/2)';
      const expectedOutput = [3, '+', 5, '*', 2, '-', 4, '/', 2];
      const result = component.stringToArr(input);
      expect(result.map((el) => (typeof el === 'object' ? el.operator : el))).toEqual(expectedOutput);
    });

    it('should handle numbers with decimals', () => {
      const input = '3.5+4.2';
      const expectedOutput = [3.5, '+', 4.2];
      const result = component.stringToArr(input);
      expect(result.map((el) => (typeof el === 'object' ? el.operator : el))).toEqual(expectedOutput);
    });

    it('should handle parentheses', () => {
      const input = '(3+5)*2';
      const expectedOutput = [3, '+', 5, '*', 2];
      const result = component.stringToArr(input);
      expect(result.map((el) => (typeof el === 'object' ? el.operator : el))).toEqual(expectedOutput);
    });
  });

  describe('evalMathExpression', () => {
    it('should evaluate addition correctly', () => {
      const inputArray = [3, { operator: '+', priority: 0 }, 5];
      const result = component.evalMathExpression(inputArray);
      expect(result).toBe(8);
    });

    it('should evaluate multiplication correctly', () => {
      const inputArray = [3, { operator: '*', priority: 1 }, 5];
      const result = component.evalMathExpression(inputArray);
      expect(result).toBe(15);
    });

    it('should evaluate mixed operations with correct precedence', () => {
      const inputArray = [3, { operator: '+', priority: 0 }, 5, { operator: '*', priority: 1 }, 2];
      const result = component.evalMathExpression(inputArray);
      expect(result).toBe(13);
    });

    it('should evaluate expressions with parentheses correctly', () => {
      const inputArray = [3, { operator: '*', priority: 1 }, 2, { operator: '+', priority: 0 }, 4];
      const result = component.evalMathExpression(inputArray);
      expect(result).toBe(10);
    });

    it('should return the same number when no operator is present', () => {
      const inputArray = [5];
      const result = component.evalMathExpression(inputArray);
      expect(result).toBe(5);
    });
  });
});
