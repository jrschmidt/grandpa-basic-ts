type ParseStack = Array< ParseTag | string | number | Array<any> >;

type NumericExpressionTag =
  '<none>' |
  '<numeric_literal>' |
  '<numeric_variable>' |
  '<plus>' |
  '<minus>' |
  '<times>' |
  '<divide>' |
  '<power>' |
  '<random>' |
  '<integer>';

interface NumericParseStackSplit {
  splitter: NumericExpressionTag;
  left: ParseStack;
  right: ParseStack;
}

interface NumericExpressionObject {
  tag: NumericExpressionTag;
  value?: number;
  name?: string;
  op1?: NumericExpressionObject;
  op2?: NumericExpressionObject;
}

type StringExpressionTag =
  '<string_literal>' | '<string_variable>';

interface SimpleStringExpression {
  tag: StringExpressionTag;
  value?: string;
  name?: string;
}

type StringExpressionObject = SimpleStringExpression[];

type BooleanExpressionTag =
  '<number_equals>' |
  '<number_not_equal>' |
  '<number_lesser_than>' |
  '<number_lesser_equal>' |
  '<number_greater_than>' |
  '<number_greater_equal>' |
  '<string_equals>' |
  '<string_not_equal>';

interface BooleanExpressionObject {
  comparator: BooleanExpressionTag;
  variable: string;
  expression: NumericExpressionObject | StringExpressionObject;
}

type ComparatorTag =
  '<equal>' |
  '<lesser>' |
  '<greater>' |
  '<not_equal>';

type ParseTag =
  NumericExpressionTag |
  StringExpressionTag |
  BooleanExpressionTag;

type SyntaxRuleTag =
  'CLEAR' |
  'RUN' |
  'INFO' |
  'LIST' |
  '<clear_command>' |
  '<run_command>' |
  '<info_command>' |
  '<list_command>' |
  '<line_number>' |
  '<space>' |
  '<line_number_statement>';



interface ParseResult {
  match: 'no' | 'yes' | 'parse_error';
  stack: ParseStack;
  remainder: string;
}



export class SyntaxRules {

  rules: SyntaxRuleTag[][];
  keywords: string[];
  keywordTokens: SyntaxRuleTag[];
  actionTokens: SyntaxRuleTag[];

  constructor () {

    this.rules = [
      ['CLEAR'],
      ['RUN'],
      ['LIST'],
      ['INFO'],
      ['<line_number>','<space>','<line_number_statement>']
    ];

    this.keywords = [
      'CLEAR',
      'RUN',
      'LIST',
      'INFO'
    ];

    this.keywordTokens = [
      '<clear_command>',
      '<run_command>',
      '<list_command>',
      '<info_command>'
    ];

    this.actionTokens = [
      '<line_number>'
    ];

  }

}



export class LineParser {
  syntax: SyntaxRules;

  constructor (syntax: SyntaxRules) {
    this.syntax = syntax;
  }


  parse (inputLine: string): ParseStack {

    let stack: ParseStack = [];

    let result: ParseResult = {
      match: 'no',
      stack: [],
      remainder: ''
    };

    this.syntax.rules.forEach(rule => {
      if (result.match === 'no') {
        result = this.lookForRuleMatch(inputLine, rule);
        if (result.match != 'no') {
          if ( (result.match === 'parse_error') || (result.remainder.length > 0) ) {
            stack = ['<parse_error'];
          }
          else {
            stack = result.stack;
          }
        }
      }
    });

    stack = result.stack;
    return stack;
  }


  // Check the string against a specific syntax rule
  lookForRuleMatch (string: string, rule: SyntaxRuleTag[]): ParseResult {

    let result: ParseResult = {
      match: 'no',
      stack: [],
      remainder: ''
    };

    let match: string = 'no';
    let stack: ParseStack = [];
    let remainder: string;

    let tokenMatch: ParseResult = {
      match: 'no',
      stack: [],
      remainder: ''
    };

    rule.forEach(token => {
      if (match === 'no') {
        if ( this.syntax.keywords.indexOf(token) >= 0 ) {
          tokenMatch = this.lookForKeywordMatch(token, string);
        }
        if ( this.syntax.actionTokens.indexOf(token) >= 0 ) {
          tokenMatch = this.lookForActionTokenMatch(token, string);
        }
        if (tokenMatch.match === 'yes') {
          match = 'yes';
          stack = stack.concat(tokenMatch.stack);
          remainder = tokenMatch.remainder;
        }
      }
    });

    if (match === 'yes') {
      result = {
        match: 'yes',
        stack: stack,
        remainder: remainder
      };
    }

    return result;
  }


  // Check for a specific literal keyword
  lookForKeywordMatch (token: SyntaxRuleTag, string: string): ParseResult {

    let result: ParseResult = {
      match: 'no',
      stack: [],
      remainder: ''
    };

    let index: number = string.indexOf(token);
    if (index === 0) {
      let keywordIndex: number = this.syntax.keywords.indexOf(token);
      let keywordToken: SyntaxRuleTag = this.syntax.keywordTokens[keywordIndex];
      result = {
        match: 'yes',
        stack: [ keywordToken ],
        remainder: string.slice(token.length)
      };
    }

    return result;

  }


  // Delegate to the 'look_for' method associated with a specific 'action' token
  lookForActionTokenMatch (token: SyntaxRuleTag, string: string): ParseResult {

    let result: ParseResult = {
      match: 'no',
      stack: [],
      remainder: ''
    };

    if (token === '<line_number>') {
      result = this.lookForLineNumber(token, string);
    }

    return result;

  }


  lookForLineNumber (token: SyntaxRuleTag, string: string): ParseResult {

    let result: ParseResult = {
      match: 'no',
      stack: [],
      remainder: ''
    };

    let n: number = parseInt(string);
    if (n > 0) {
      result = {
        match: 'yes',
        stack: [ '<line_number>', n],
        remainder: string.slice(String(n).length)
      };
    }

    return result;
  }

}



export class NumericExpressionBuilder {

  buildNumericExpression (stack: ParseStack): NumericExpressionObject {

    let expression: NumericExpressionObject = {
      tag: '<none>'
    }

    let splitStack: NumericParseStackSplit = this.split(stack);

    switch (splitStack.splitter) {
    case '<plus>':
    case '<minus>':
    case '<times>':
    case '<divide>':
    case '<power>':
      expression = this.buildBinaryNumericExpression(splitStack);
    break;
    case '<numeric_literal>':
      expression = this.buildNumericLiteralExpression(splitStack);
    break;
    case '<numeric_variable>':
      expression = this.buildNumericVariableExpression(splitStack);
    break;
    // case '<random>':
    //   expression = this.buildNumericRandomFunctionExpression(splitStack);
    // break;
    // case '<integer>':
    //   expression = this.buildNumericIntegerFunctionExpression(splitStack);
    // break;
  }

    return expression;
  }


  buildBinaryNumericExpression (stack: NumericParseStackSplit): NumericExpressionObject {

    let left = this.buildNumericExpression(stack.left);
    let right = this.buildNumericExpression(stack.right);

    let expression: NumericExpressionObject = {
      tag: stack.splitter,
      op1: left,
      op2: right
    }

    return expression;
  }


  buildNumericLiteralExpression (stack: NumericParseStackSplit): NumericExpressionObject {
    let expression: NumericExpressionObject = {
      tag: '<numeric_literal>',
      value: <number>stack.right[0]
    }
    return expression;
  }


  buildNumericVariableExpression (stack: NumericParseStackSplit): NumericExpressionObject {
    let expression: NumericExpressionObject = {
      tag: '<numeric_variable>',
      name: <string>stack.right[0]
    }
    return expression;
  }


  // buildNumericRandomFunctionExpression(stack: NumericParseStackSplit): NumericExpressionObject {}


  // buildNumericIntegerFunctionExpression(stack: NumericParseStackSplit): NumericExpressionObject {}


  stripDelimiterTokens (stack: ParseStack): ParseStack {
    let first = stack[0];
    let last = stack[stack.length - 1];
    if (first === '<numeric_expression>' && last === '<num_exp_end>') {
      stack = stack.slice(1, stack.length - 1);
    }
    return stack;
  }


  split (stack: ParseStack): NumericParseStackSplit {

    let found: string = 'no';
    let splitIndex: number;

    let rankings: NumericExpressionTag[][] = [
      ['<plus>', '<minus>'],
      ['<times>', '<divide>'],
      ['<power>'],
      ['<numeric_literal>', '<numeric_variable>'],
      ['<random>', '<integer>']
    ];

    let result: NumericParseStackSplit = {
      splitter: '<none>',
      left: [],
      right: []
    };

    stack = this.stripDelimiterTokens(stack);
    stack = this.deparenthesize(stack);

    for (let rank=0; rank<rankings.length; rank++) {
      if (found != 'yes') {
        for (let n=0; n<stack.length; n++) {
          if (found != 'yes') {
            for (let i=0; i<rankings[rank].length; i++) {
              if (stack[n] === rankings[rank][i]) {
                splitIndex = n;
                found = 'yes';
              }
            }
          }
        }
      }
    }

    let splitter: NumericExpressionTag = <NumericExpressionTag>stack[splitIndex];
    result.splitter = splitter;


    let left = stack.slice(0, splitIndex);
    left = this.extractFromArray(left);
    result.left = left;

    let right = stack.slice(splitIndex + 1);
    if (splitter != '<numeric_variable>') {
      right = this.extractFromArray(right);
    }
    result.right = right;

    return result;
  }


  extractFromArray (stack: ParseStack): ParseStack {
    if ( (stack.length === 1) && stack[0][0] ) {
      let stack0: any[] = <any[]>stack[0];
      stack = stack0;
    }

    return stack;
  }


  deparenthesize (stack: ParseStack): ParseStack {
    let mainStacks: ParseStack[] = [ [] ];
    let tailStack: ParseStack = [];
    let middleStack: ParseStack;

    stack.forEach(tag => {
      if (tag === '<left>') {
        mainStacks.push( [] );
      }

      if (tag === '<right>') {
        middleStack = mainStacks.pop();
        mainStacks[mainStacks.length-1].push(middleStack);
        mainStacks[mainStacks.length-1] = mainStacks[mainStacks.length-1].concat(tailStack);
        tailStack = [];
      }

      if ( (tag != '<left>') && (tag != '<right>') ) {
        mainStacks[mainStacks.length-1].push(tag);
      }
    });

    if (mainStacks.length != 1) {
      return [];
    }
    else {
      mainStacks[0] = mainStacks[0].concat(tailStack);
      return mainStacks[0];
    }

  }


}



export class StringExpressionBuilder {

  buildStringExpression (stack: ParseStack): StringExpressionObject {
    let expressionArray: StringExpressionObject = [];
    let expression: SimpleStringExpression;

    for ( let t=1; t<=stack.length-3; t=t+3 ) {

      if (stack[t] === '<string_variable>') {
        let name: string = <string>stack[t+1];
        expression = {
          tag: '<string_variable>',
          name: name
        };
      }

      else
      {
        let value: string = <string>stack[t+1];
        expression = {
          tag: '<string_literal>',
          value: value
        };
      }

      expressionArray.push(expression);
    }

    return expressionArray;
  }

}



export class BooleanExpressionBuilder {

  numericBuilder: NumericExpressionBuilder;
  stringBuilder: StringExpressionBuilder;

  constructor (numericBuilder: NumericExpressionBuilder, stringBuilder: StringExpressionBuilder) {
    this.numericBuilder = numericBuilder;
    this.stringBuilder = stringBuilder;
  }


  buildBooleanExpression (stack: ParseStack): BooleanExpressionObject {
    let comparator: BooleanExpressionTag = <BooleanExpressionTag>stack[3];
    let bxVar: string = <string>stack[2];
    let subStack: ParseStack = stack.slice(4, stack.length - 1);
    let expression: NumericExpressionObject | StringExpressionObject;

    if (stack[1] === '<numeric_variable>') {
      expression = this.numericBuilder.buildNumericExpression(subStack);
    }

    if (stack[1] === '<string_variable>') {
      expression = this.stringBuilder.buildStringExpression(subStack);
    }

    let result: BooleanExpressionObject = {
      comparator: comparator,
      variable: bxVar,
      expression: expression
    };

    return result;
  }

}



export class KeyHelper {

  // A class to interpret the parameters of key press events and return the
  // parameters for the corresponding character sprite.

  monitorColor: string;
  code: number[];
  keys: string[][];
  chars: string[];
  xy: number[][];
  blankSpriteXY: number[];

  constructor () {

    // Postpone monitor color code until later in the CS - TS conversion
    // this.monitorColor = 'green';

    this.code = [
      173,61,59,189,187,186,
      48,49,50,51,52,53,54,55,56,57,
      96,97,98,99,100,101,102,103,104,105,
      107,109,106,111,110,
      65,66,67,68,69,70,71,72,73,74,75,76,77,
      78,79,80,81,82,83,84,85,86,87,88,89,90,
      188,190,191,192,219,221,222
    ];

    this.keys = [
      ['-','_'], ['=','+'], [';',':'], ['-','_'], ['=','+'], [';',':'],
      ['0',')'], ['1','!'], ['2','@'], ['3','#'], ['4','$'], ['5','%'], ['6','^'], ['7','&'], ['8','*'], ['9','('],
      ['0','0'], ['1','1'], ['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'],
      ['+','+'], ['-','-'], ['*','*'], ['/','/'], ['.','.'],
      ['A','A'], ['B','B'], ['C','C'], ['D','D'], ['E','E'], ['F','F'], ['G','G'], ['H','H'], ['I','I'],
      ['J','J'], ['K','K'], ['L','L'], ['M','M'], ['N','N'], ['O','O'], ['P','P'], ['Q','Q'], ['R','R'],
      ['S','S'], ['T','T'], ['U','U'], ['V','V'], ['W','W'], ['X','X'], ['Y','Y'], ['Z','Z'],
      [',','<'], ['.','>'], ['/','?'], ['`','~'], ['[','{'], [']','}'], ["'",'"']
    ];

    // TODO Why are '[' and ']' not implemented?
    this.chars = [
      '!', '"', '#', '$', '%', '&', "'",
      '(', ')', '*', '+', ',', '-', '.', '/', '0', '1',
      '2', '3', '4', '5', '6', '7', '8', '9', ':', ';',
      '<', '=', '>', '?', '@',
      '^', '_', '`', 'A', 'B', 'C',
      'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
      'X', 'Y', 'Z', '{', '|', '}','~'
    ];

    this.xy = [
      [99,72], [33,72], [33,90], [77,72], [88,72], [44,90], [22,72],
      [66,54], [77,54], [33,54], [11,54], [55,72], [22,54], [44,72], [44,54], [0,36], [11,36],
      [22,36], [33,36], [44,36], [55,36], [66,36], [77,36], [88,36], [99,36], [0,72], [11,72],
      [88,54], [0,54], [99,54], [66,72], [22,90],
      [55,54], [55,90], [0,90], [0,0], [11,0], [22,0],
      [33,0], [44,0], [55,0], [66,0], [77,0], [88,0], [99,0], [110,0], [121,0], [132,0],
      [0,18], [11,18], [22,18], [33,18], [44,18], [55,18], [66,18], [77,18], [88,18], [99,18],
      [110,18], [121,18], [132,18], [66,90], [99,90], [77,90],[11,90]
    ];

    this.blankSpriteXY = [121, 54];

  }


  char(n: number, shiftStatus: string): string {
    let ch: string;

    if (this.code.indexOf(n) >= 0) {
      let i: number = this.code.indexOf(n);

      if (shiftStatus === '<shift>') {
        ch = this.keys[i][1];
      }

      else {
        ch = this.keys[i][0];
      }
    }


    else {

      if (n === 32) {
        ch = ' ';
      }

      else {
        ch = null;
      }

    }
    return ch;
  }


  spriteXY(ch: string): number[] {
    if (this.chars.indexOf(ch) >= 0) {
      let i = this.chars.indexOf(ch);
      let xx = this.xy[i][0];
      let yy = this.xy[i][1];
      // Postpone monitor color code until later in the CS - TS conversion
      // if (this.monitorColor === 'green') {xx = xx + 145;}
      return [xx, yy];
    }

    else {
      return this.blankSpriteXY; // (blank sprite)
    }

  }


}



class VariableRegister {
  // Store values for variables.
  vars: {};

  constructor () {
    this.vars = {};
  }

  addVar(name: string) {
    this.vars[name] = null;
  }

  defined (name: string): boolean {
    if (this.vars.hasOwnProperty(name)) {
      return true;
    }
    else {
      return false;
    }
  }

  set (name: string, value: any) {
    if (! this.defined(name)) {
      this.addVar(name);
    }
    this.vars[name] = value;
  }

  get (name: string): any {
    if (! this.defined(name)) {
      this.addVar(name);
    }
    return this.vars[name];

  }

}



export class NumericVariableRegister extends VariableRegister {

  // 	# Most, if not all, of the early versions of BASIC initialized any unset
  // 	# numeric variables to 0.

  addVar(name: string) {
    this.vars[name] = 0;
  }

}



export class StringVariableRegister extends VariableRegister {

  // Most early versions of BASIC initialized unset string variables to an
  // empty string.

  addVar(name: string) {
    this.vars[name] = '';
  }

}



export class NumericExpressionEvaluator {

  register: NumericVariableRegister;


  constructor (register: NumericVariableRegister) {
    this.register = register;
  }


  evaluate(expression: NumericExpressionObject): number {
    let result: number = NaN;

    switch (expression.tag) {
      case '<numeric_literal>':
        result = this.evaluateNumericLiteral(expression);
      break;
      case '<numeric_variable>':
        result = this.evaluateNumericVariable(expression);
      break;
      case '<random>':
      result = this.evaluateRNDKeyword();
      break;
      case '<plus>':
      case '<minus>':
      case '<times>':
      case '<divide>':
      case '<power>':
        result = this.evaluateBinaryOperation(expression);
      break;
    }

    return result;
  }


  evaluateNumericLiteral (expression: NumericExpressionObject): number {
    return expression.value;
  }


  evaluateNumericVariable (expression: NumericExpressionObject): number {
    return this.register.get(expression.name);
  }


  evaluateRNDKeyword (): number {
    return Math.random();
  }


  evaluateBinaryOperation (expression: NumericExpressionObject): number {
    let result: number = NaN;
    let a: number = this.evaluate(expression.op1);
    let b: number = this.evaluate(expression.op2);

    switch (expression.tag) {
      case '<plus>':
        result = a + b;
      break;
      case '<minus>':
        result = a - b;
      break;
      case '<times>':
        result = a * b;
      break;
      case '<divide>':
        result = a / b;
      break;
      case '<power>':
        result = a ** b;
      break;
    }

    return result;
  }


}



export class StringExpressionEvaluator {

  register: StringVariableRegister;

  constructor (register: StringVariableRegister) {
    this.register = register;
  }


  evaluate (expression: StringExpressionObject): string {
    let result: string = '';
    let nextString: string;

    expression.forEach( next => {

        if (next.tag === '<string_literal>') {
          nextString = next.value;
          result = result.concat(nextString);
        }

        if (next.tag === '<string_variable>') {
        nextString = this.register.get(next.name);
        result = result.concat(nextString);
        }

    });

    return result;
  }

}



export class BooleanExpressionEvaluator {

  numericRegister: NumericVariableRegister;
  stringRegister: StringVariableRegister;
  numericEvaluator: NumericExpressionEvaluator;
  stringEvaluator: StringExpressionEvaluator;

  constructor (
    numericRegister: NumericVariableRegister,
    stringRegister: StringVariableRegister,
    numericEvaluator: NumericExpressionEvaluator,
    stringEvaluator: StringExpressionEvaluator ) {

    this.numericRegister = numericRegister;
    this.stringRegister = stringRegister;
    this.numericEvaluator = numericEvaluator;
    this.stringEvaluator = stringEvaluator;
    }


  evaluate (expression: BooleanExpressionObject) {
    let result: boolean = false;

    let compareResult: ComparatorTag;

    let comparator: BooleanExpressionTag = expression.comparator;

    if ( (comparator === '<string_equals>') || (comparator === '<string_not_equal>') ) {
      let varValue: string = this.stringRegister.get(expression.variable);
      let expValue: string = this.stringEvaluator.evaluate(<StringExpressionObject>expression.expression);
      compareResult = this.stringCompare(varValue, expValue);
    }

    else {
      let varValue: number = this.numericRegister.get(expression.variable);
      let expValue: number = this.numericEvaluator.evaluate(<NumericExpressionObject>expression.expression);
      compareResult = this.numericCompare(varValue, expValue);
    }

    switch (comparator) {

      case '<number_equals>':
      case '<string_equals>':
        if (compareResult === '<equal>') result = true;
      break;

      case '<number_not_equal>':
      case '<string_not_equal>':
        if (compareResult != '<equal>') result = true;
      break;

      case '<number_lesser_than>':
        if (compareResult === '<lesser>')  result = true;
      break;

      case '<number_lesser_equal>':
        if ((compareResult === '<lesser>') || (compareResult === '<equal>'))  result = true;
      break;

      case '<number_greater_than>':
        if (compareResult === '<greater>')  result = true;
      break;

      case '<number_greater_equal>':
      if ((compareResult === '<greater>') || (compareResult === '<equal>'))  result = true;
      break;

    }

    return result;
  }


  numericCompare (x: number, y: number): ComparatorTag {
    let tag: ComparatorTag;

    if (x === y) tag = '<equal>';
    if (x < y) tag = '<lesser>';
    if (x > y) tag = '<greater>';

    return tag;
  }


  stringCompare (a: string, b: string): ComparatorTag {
    let tag: ComparatorTag;

    if (a === b) tag = '<equal>';
    else tag = '<not_equal>';

    return tag;
  }

}
