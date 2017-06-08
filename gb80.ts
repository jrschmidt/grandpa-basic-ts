////  Parser type definitions  ////

type ParserFunction = { (string: string): ParseStack };

type ParseStack = Array< ParseTag | string | number | Array<any> >;

type ParseTag =
  NumericExpressionTag |
  StringExpressionTag |
  BooleanExpressionTag |
  ConsoleKeywordTag |
  ProgramKeywordTag;

type ConsoleKeywordTag =
  '<clear>' |
  '<run>' |
  '<list>' |
  '<info>';

type ProgramKeywordTag =
  '<remark>' |
  '<goto>' |
  '<gosub>' |
  '<return>' |
  '<if>' |
  '<then>' |
  '<input>' |
  '<print>' |
  '<end>' |
  '<int>' |
  '<random>';

interface ParseResult {
  match: 'no' | 'yes' | 'parse_error';
  stack: ParseStack;
  remainder: string;
}


////  Numeric Expression type definitions  ////

type NumericExpressionTag =
  '<none>' |
  '<numeric_literal>' |
  '<numeric_variable>' |
  '<plus>' |
  '<minus>' |
  '<times>' |
  '<divide>' |
  '<power>' |
  '<left>' |
  '<right>' |
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


////  String Expression type definitions  ////

type StringExpressionTag =
  '<string_literal>' | '<string_variable>';

interface SimpleStringExpression {
  tag: StringExpressionTag;
  value?: string;
  name?: string;
}

type StringExpressionObject = SimpleStringExpression[];


////  Boolean Expression type definitions  ////

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



export class LineParser {
  lineParsers: ParserFunction[];

  constructor (lineParserFunctions: LineParserFunctions) {
    this.lineParsers = lineParserFunctions.lineParsers;
  }


  parse (string: string): ParseStack {

    let result: ParseStack = [];

    this.lineParsers.forEach( parser => {
      if ( result.length ===  0 ) {
        result = parser(string);
      }
    });

    return result;
  }

}



export class LineParserFunctions {

  // This class contains the functions to parse different types of console
  // commands (RUN, LIST, etc) and numbered program line statements. The
  // functions are put into an array which is exported to the LineParser class.
  // This way, these functions can be removed or changed when we want to change
  // the syntax of permissible statements without touching any other class.

  lineParsers: ParserFunction[];
  helpers;

  constructor (parserHelpers: LineParserHelpers) {
    this.helpers = parserHelpers.helpers;

    this.lineParsers = [
      this.parseConsoleKeyword,
      this.parseBareLineNumber,
      this.parseBareRemStatement
    ];

  }


  parseBareLineNumber = (string: string): ParseStack => {
    // This function parses a valid line number with nothing following it. In
    // BASIC, entering a line number with nothing following it deletes that
    // line from the program.

    this.helpers.set(string).parseLineNumber();

    if ( ( this.helpers.match === 'yes' ) && ( this.helpers.remainder.length === 0 ) ) {
      return this.helpers.stack;
    }

    else {
      return [];
    }

  };


  parseBareRemStatement = (string: string): ParseStack => {
    console.log(' ');
    console.log(`parseBareRemStatement() string = ${string}`);

    this.helpers.set(string).parseLineNumber().parseKeyword('REM');
    console.log(`   match = ${this.helpers.match}`);
    console.log(`   stack = ${this.helpers.stack}`);
    console.log(`   remainder = ${this.helpers.remainder}`);

    if ( ( this.helpers.match === 'yes' ) && ( this.helpers.remainder.length === 0 ) ) {
      return this.helpers.stack;
    }

    else {
      return [];
    }

  };


  // FOR NOW, THIS ONE IS DIFFERENT THAN THE OTHER PARSERS, AND DOES NOT USE
  // THE CHAINABLE HELPER FUNCTIONS.
  parseConsoleKeyword = (string: string): ParseStack => {
    // This function parses single keyword commands (RUN, LIST, etc).

    let result: ParseStack = [];

    let consoleKeywords: {keyword: string, token: ConsoleKeywordTag}[] = [
      {keyword: 'CLEAR', token: '<clear>'},
      {keyword: 'RUN', token: '<run>'},
      {keyword: 'LIST', token: '<list>'},
      {keyword: 'INFO', token: '<info>'}
    ];


    consoleKeywords.forEach( pair => {

      if ( ( result.length === 0 ) && ( string === pair.keyword ) ) {
        result = [
          '<console_command>',
          pair.token
        ];
      }

    });

    return result;
  };


}



export class LineParserHelpers {
  // The parser helper functions are written as properties of the helpers{}
  // object to enable them to be used in a function chaining pattern.
  helpers: {};

  constructor () {

    this.helpers = {
      match: <string> 'no',
      stack: <ParseStack> [],
      remainder: <string> '',


      set: function (string: string) {
        this.match = 'no';
        this.stack = [];
        this.remainder = string;

        return this;
      },


      parseLineNumber : function () {

        if ( this.match != 'error' ) {

          let n: number = parseInt(this.remainder)

          if (n) {
            this.match = 'yes';
            this.stack = this.stack.concat( ['<line_number>', n] );
            this.remainder = this.remainder.slice(String(n).length);
          }

          else {
            this.match = 'error';
          }

        }

        return this;
      },


      parseKeyword : function (keyword: string) {

        if ( this.match != 'error' ) {

          if ( this.remainder.indexOf(keyword) === 0) {
            this.match = 'yes';
            this.stack = this.stack.push( '<' + keyword.toLowerCase() + '>' );
            this.remainder = this.remainder.slice(keyword.length);
          }

          else {
            this.match = 'error';
          }
        }

        return this;
      },


    };

  }

}



export class NumericExpressionParser {
  delimiters: string[];
  symbols: ParseTag[];

  constructor () {

    this.delimiters = ['(', ')', '+', '-', '*', '/', '^']

    this.symbols = [
      '<left>',
      '<right>',
      '<plus>',
      '<minus>',
      '<times>',
      '<divide>',
      '<power>']

  }


  parseNumericExpression (string: string): ParseStack {

    let result: ParseStack = [];

    if ( string.search(/[^A-Z0-9\.+\-*/\^()]/) < 0 ) {
      result = [ '<numeric_expression>' ];
      let tokens: ParseStack = this.tokenize(string);

      tokens.forEach( tkn => {
        let tk: any = tkn;

        if ( this.symbols.indexOf(tk) >= 0 ) {
          result.push(tk);
        }

        else {
          let numericValueParseStack: ParseStack = this.parseNumericValue(tk);

          if ( numericValueParseStack.length > 0 ) {
            result = result.concat( numericValueParseStack );
          }

          else {
            result = [];
          }

        }
      });

      if ( result.length > 0 ) {
        result.push('<num_exp_end>');
      }
    }

    return result;
  }


  tokenize (string: string): ParseStack {

        let result: string[] = [];
        let buffer: string = '';

        for (let i = 0;i<string.length;i++) {
          let ch: string = string[i];
          let index: number = this.delimiters.indexOf(ch);

          if ( index >= 0 ) {
            if ( buffer != '' ) {
              result.push(buffer);
              buffer = '';
            }
            result.push(this.symbols[index]);
          }

          else {
            buffer = buffer + ch;
          }

        }

        if ( buffer != '' ) {
          result.push(buffer);
        }

        return result;
  }


  parseNumericValue (string: string): ParseStack {
    let result: ParseStack = [];

    if ( 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(string[0]) >= 0 ) {
      if ( ( string.length === 1 ) || ( ( string.length === 2 ) && ( '0123456789'.indexOf(string[1]) >= 0 ) ) ) {
        result = [
          '<numeric_variable>',
          string
        ];
      }
    }

    else {
      let nonNumerics: string = 'none';

      for (let i = 0;i<string.length;i++) {
        let ch: string = string[i];

        if ( '0123456789'.indexOf(ch) < 0 ) {

          if ( (ch === '.') && (nonNumerics === 'none') ) {
            nonNumerics = 'decimal_point';
          }

          else {
          nonNumerics = 'bad';
          }

        }

      }

      if ( nonNumerics != 'bad' ) {
        result = [
          '<numeric_literal>',
          Number(string)
        ];
      }

    }


    return result;

  }

}



export class StringExpressionParser {

  parseStringExpression (string: string): ParseStack {
    let resultTokens: ParseStack;

    let result: ParseStack = [];

    let tokens: ParseStack = this.tokenize(string);
    tokens.forEach( tk => {
      if ( tk === '<plus>' ) {
        result.push('<plus>');
      }

      else {
        resultTokens = this.parseStringVariableName(<string> tk);

        if ( resultTokens.length === 0 ) {
          resultTokens = this.parseStringLiteral(<string> tk);
        }

        if ( resultTokens.length > 0 ) {
          result = result.concat(resultTokens);
        }
      }

    });

    if ( result.length > 0 ) {
      result.unshift('<string_expression>');
      result.push('<str_exp_end>');
    }

    return result;
  }


  tokenize (string: string): ParseStack {
    let result: ParseStack = [];
    let buffer: string = '';

    for (let i = 0;i<string.length;i++) {

      if ( string[i] === '+' ) {
        if ( buffer.length > 0 ) {
          result.push(buffer);
          buffer = '';
        }
        result.push('<plus>');
      }

      else {
        buffer = buffer + string[i];
      }

    }

    if ( buffer.length > 0 ) {
      result.push(buffer);
    }

    return result;
  }


  parseStringVariableName (string: string): ParseStack {
    let result: ParseStack = [];

    if ( string[0] === '$' ) {
      if ( 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(string[1]) >= 0 ) {
        if ( ( string.length === 2 ) || ( ( string.length === 3 ) && ( '0123456789'.indexOf(string[2]) >= 0 ) ) ) {
          result = [
            '<string_variable>',
            string.substr(1,2)
          ];
        }
      }
    }

    return result;
  }


  parseStringLiteral (string: string): ParseStack {
    let result: ParseStack = [];

    if ( ( string.indexOf('"') === 0 ) || ( string.lastIndexOf('"') === string.length -1 ) ) {
      let newString: string = string.slice(1, string.length-1);
      if ( newString.indexOf('"') < 0 ) {
        result = [
          '<string_literal>',
          newString
        ];
      }
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
      name: <string> stack.right[0]
    }
    return expression;
  }


  // buildNumericRandomFunctionExpression(stack: NumericParseStackSplit): NumericExpressionObject {}


  // buildNumericIntegerFunctionExpression(stack: NumericParseStackSplit): NumericExpressionObject {}


  stripDelimiterTokens (stack: ParseStack): ParseStack {
    let first = stack[0];
    let last = stack[stack.length - 1];
    if ( first === '<numeric_expression>' && last === '<num_exp_end>' ) {
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
      if ( found != 'yes' ) {
        for (let n=0; n<stack.length; n++) {
          if ( found != 'yes' ) {
            for (let i=0; i<rankings[rank].length; i++) {
              if ( stack[n] === rankings[rank][i] ) {
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
    if ( splitter != '<numeric_variable>' ) {
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

    stack.forEach( tag => {
      if ( tag === '<left>' ) {
        mainStacks.push( [] );
      }

      if ( tag === '<right>' ) {
        middleStack = mainStacks.pop();
        mainStacks[mainStacks.length-1].push(middleStack);
        mainStacks[mainStacks.length-1] = mainStacks[mainStacks.length-1].concat(tailStack);
        tailStack = [];
      }

      if ( (tag != '<left>') && (tag != '<right>') ) {
        mainStacks[mainStacks.length-1].push(tag);
      }
    });

    if ( mainStacks.length != 1 ) {
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

      if ( stack[t] === '<string_variable>' ) {
        let name: string = <string> stack[t+1];
        expression = {
          tag: '<string_variable>',
          name: name
        };
      }

      else
      {
        let value: string = <string> stack[t+1];
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
    let bxVar: string = <string> stack[2];
    let subStack: ParseStack = stack.slice(4, stack.length - 1);
    let expression: NumericExpressionObject | StringExpressionObject;

    if ( stack[1] === '<numeric_variable>' ) {
      expression = this.numericBuilder.buildNumericExpression(subStack);
    }

    if ( stack[1] === '<string_variable>' ) {
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
    if ( this.vars.hasOwnProperty(name) ) {
      return true;
    }
    else {
      return false;
    }
  }

  set (name: string, value: any) {
    if ( ! this.defined(name) ) {
      this.addVar(name);
    }
    this.vars[name] = value;
  }

  get (name: string): any {
    if ( ! this.defined(name) ) {
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

        if ( next.tag === '<string_literal>' ) {
          nextString = next.value;
          result = result.concat(nextString);
        }

        if ( next.tag === '<string_variable>' ) {
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
        if ( compareResult === '<equal>' ) result = true;
      break;

      case '<number_not_equal>':
      case '<string_not_equal>':
        if ( compareResult != '<equal>' ) result = true;
      break;

      case '<number_lesser_than>':
        if ( compareResult === '<lesser>' )  result = true;
      break;

      case '<number_lesser_equal>':
        if ( (compareResult === '<lesser>') || (compareResult === '<equal>') )  result = true;
      break;

      case '<number_greater_than>':
        if ( compareResult === '<greater>' )  result = true;
      break;

      case '<number_greater_equal>':
      if ( (compareResult === '<greater>') || (compareResult === '<equal>') )  result = true;
      break;

    }

    return result;
  }


  numericCompare (x: number, y: number): ComparatorTag {
    let tag: ComparatorTag;

    if ( x === y ) tag = '<equal>';
    if ( x < y ) tag = '<lesser>';
    if ( x > y ) tag = '<greater>';

    return tag;
  }


  stringCompare (a: string, b: string): ComparatorTag {
    let tag: ComparatorTag;

    if ( a === b ) tag = '<equal>';
    else tag = '<not_equal>';

    return tag;
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

    // Postpone monitor color code until later in the CS - TS conversion.
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

    if ( this.code.indexOf(n) >= 0 ) {
      let i: number = this.code.indexOf(n);

      if ( shiftStatus === '<shift>' ) {
        ch = this.keys[i][1];
      }

      else {
        ch = this.keys[i][0];
      }
    }


    else {

      if ( n === 32 ) {
        ch = ' ';
      }

      else {
        ch = null;
      }

    }
    return ch;
  }


  spriteXY(ch: string): number[] {
    if ( this.chars.indexOf(ch) >= 0 ) {
      let i = this.chars.indexOf(ch);
      let xx = this.xy[i][0];
      let yy = this.xy[i][1];
      // Postpone monitor color code until later in the CS - TS conversion
      // if ( this.monitorColor === 'green' ) {xx = xx + 145;}
      return [xx, yy];
    }

    else {
      return this.blankSpriteXY; // (blank sprite)
    }

  }


}
