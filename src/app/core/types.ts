export enum ButtonType {
  CLEAR = 'CLEAR',
  OPERATOR = 'OPERATOR',
  EQUAL = 'EQUAL',
  CHAR = 'CHAR',
  CLEAR_ONE = 'CLEAR_ONE',
}

export type Button = { type: ButtonType.CLEAR } | { type: ButtonType.CLEAR_ONE } | { type: ButtonType.EQUAL } | Char | Operator;

export type Operator = {
  type: ButtonType.OPERATOR;
  priority: number;
  value: string;
  inputValue: string;
  eval: (num1: number, num2: number) => number;
};

export type Char = { type: ButtonType.CHAR; value: string };
