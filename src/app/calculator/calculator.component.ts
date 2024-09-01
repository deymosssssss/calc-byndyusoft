import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { schema } from '../core/schema';
import { Button, ButtonType, Char, Operator } from '../core/types';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorComponent implements OnInit {
  inputHistory = '';
  inputValue = '';
  controls = schema;
  ButtonType = ButtonType;

  ngOnInit(): void {
    this.setOperators();
  }

  operatorList: { [key: string]: Operator } = {};
  setOperators() {
    (this.controls.filter((control) => control.type === ButtonType.OPERATOR) as Operator[]).forEach(
      (operator) => (this.operatorList[operator.display] = operator),
    );
  }

  onButtonClick(button: Button) {
    button.type === ButtonType.CHAR && (this.inputValue += button.value);
    button.type === ButtonType.OPERATOR && (this.inputValue += button.inputValue);
    button.type === ButtonType.CLEAR && this.clearInput();
    button.type === ButtonType.CLEAR_ONE && this.clearLastChar();
    button.type === ButtonType.EQUAL && this.calculateResult();
  }

  clearInput() {
    this.inputHistory = '';
    this.inputValue = '';
  }
  clearLastChar() {
    this.inputValue = this.inputValue.slice(0, -1);
  }
  calculateResult() {
    try {
      const expressionArray = this.stringToArr(this.inputValue);
      const result = this.evalMathExpression(expressionArray);
      this.inputHistory = this.inputValue;
      this.inputValue = result.toString();
    } catch (error) {
      this.inputValue = 'Error';
    }
  }

  stringToArr(str: string) {
    let result = [];

    str = str.replace(/\s+/g, '');
    let num = '';

    for (let i = 0; i < str.length; i++) {
      if ((str[i] >= '0' && str[i] <= '9') || str[i] === '.') {
        num += str[i];
      }
      if (this.operatorList[str[i]]) {
        if (num) {
          result.push(+num);
          num = '';
        }
        result.push(str[i]);
      }
      if (str[i] === '(') {
        if (num) {
          result.push(+num);
          num = '';
          result.push('*');
        }
        result.push(str[i]);
      }
      if (str[i] === ')') {
        if (num) {
          result.push(+num);
          num = '';
        }
        result.push(str[i]);
      }
    }

    num && result.push(+num);

    let priority = 0;

    for (let i = 0; i < result.length; i++) {
      if (result[i] === '(') priority++;
      if (result[i] === ')') priority--;

      if (this.operatorList[result[i] as string]) {
        result[i] = {
          operator: result[i],
          priority: this.operatorList[result[i] as string].priority + priority,
        };
      }
    }

    result = result.filter((el) => el !== '(' && el !== ')');

    return result;
  }

  evalMathExpression(arr: any[]) {
    let maxPriority = 0;

    while (arr.length > 1) {
      for (let i = 1; i < arr.length; i += 2) {
        if (arr[i].priority > maxPriority) maxPriority = arr[i].priority;
      }

      for (let i = 1; i < arr.length; i += 2) {
        if (arr[i].priority === maxPriority) {
          const result = this.operatorList[arr[i].operator].eval(arr[i - 1], arr[i + 1]);

          arr.splice(i - 1, 3);
          arr.splice(i - 1, 0, result);
          break;
        }
      }
      maxPriority = 0;
    }

    return arr[0];
  }

  isCharButton(button: Button): button is Char {
    return button.type === ButtonType.CHAR;
  }
  isOperatorButton(button: Button): button is Operator {
    return button.type === ButtonType.OPERATOR;
  }
}
