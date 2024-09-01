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
  onButtonClick(button: Button) {
    if (this.isCharButton(button)) {
      this.inputValue = this.inputValue === '0' ? button.value : this.inputValue + button.value;
    } else if (this.isOperatorButton(button)) {
      this.inputValue += button.inputValue;
    } else if (button.type === ButtonType.EQUAL) {
      this.calculateResult();
    } else if (button.type === ButtonType.CLEAR) {
      this.clearInput();
    }
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
  clearInput() {
    this.inputHistory = '';
    this.inputValue = '';
  }
  clearLastChar() {
    this.inputValue = this.inputValue.slice(0, -1);
  }
  controls = schema;
  ButtonType = ButtonType;
  inputHistory = '';
  inputValue = '';

  ngOnInit(): void {
    this.setOperators();
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

  operatorList: { [key: string]: Operator } = {};

  setOperators() {
    this.controls.filter((control) => control.type === ButtonType.OPERATOR).forEach((operator) => (this.operatorList[operator.display!] = operator));
    console.log(this.controls.filter((control) => control.type === ButtonType.OPERATOR));
  }

  evalMathExpression(arr: any[]) {
    let maxPriority = 0;

    while (arr.length > 1) {
      for (let i = 1; i < arr.length; i += 2) {
        if (arr[i].priority > maxPriority) maxPriority = arr[i].priority;
      }

      for (let i = 1; i < arr.length; i += 2) {
        if (arr[i].priority === maxPriority) {
          // const result = this.evalSingleExpression(arr[i].operator, arr[i - 1], arr[i + 1]);
          const result = this.operatorList[arr[i].operator].eval(arr[i - 1], arr[i + 1]);

          arr.splice(i - 1, 3);
          arr.splice(i - 1, 0, result);
          break;
        }
      }
      maxPriority = 0; // Reset maxPriority after each iteration
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
