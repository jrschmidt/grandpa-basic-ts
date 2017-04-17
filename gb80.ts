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
  '<str>' | '<var>';

interface SimpleStringExpression {
  tag: StringExpressionTag;
  value: string;
}

type StringExpressionObject = SimpleStringExpression[];

type BooleanExpressionTag =
  '<num_equals>' |
  '<num_not_equal>' |
  '<num_lesser_than>' |
  '<num_lesser_equal>' |
  '<num_greater_than>' |
  '<num_greater_equal>' |
  '<str_equals>' |
  '<str_not_equal>';

interface BooleanExpressionObject {
  tag: BooleanExpressionTag;
  var: string;
  exp: NumericExpressionObject | StringExpressionObject;
}

type ParseTag =
  NumericExpressionTag |
  StringExpressionTag |
  BooleanExpressionTag;


export class NumericExpressionBuilder {

  // Builds a numeric expression object from an array of parse tokens.
  //
  // The object for the simple variable name X will be:
  //	 {exp: "<numeric_variable>", name: "X"}.
  //
  // The object for a simple numeric literal such as 3.1416 will be:
  //	 {exp: "<numeric_literal>", value: 3.1416}.
  //
  // Compound numeric expressions are built into binary numeric expression
  // objects with three properties: The "exp" property will be a symbol denoting
  // the operator within the expression with the highest precedence. The values
  // of the "op1" and "op2" properties will be nested numeric expression objects.
  // So, for example, in the expression 3*A+2*B-5*C the "exp" property will be
  // "<plus>", the value of "op1" will be an object representing 3*A, and the
  // value of "op2" will be an object representing 2*B-5*C.


  split (stack: ParseStack): NumericParseStackSplit {

    let found: string = 'no';
    let splitIndex: number;

    let result: NumericParseStackSplit = {
      splitter: '<none>',
      left: [],
      right: []
    };

    let rankings: NumericExpressionTag[][] = [
      ['<plus>', '<minus>'],
      ['<times>', '<divide>'],
      ['<power>'],
      ['<numeric_literal>', '<numeric_variable>'],
      ['<random>', '<integer>']
    ];

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

    result.splitter = <NumericExpressionTag>stack[splitIndex];
    result.left = stack.slice(0, splitIndex);
    result.right = stack.slice(splitIndex + 1);
    return result;
  }

  deparenthesize (stack: ParseStack): ParseStack {
    let mainStacks: ParseStack[] = [ [] ];
    let tailStack: ParseStack = [];
    let middleStack: ParseStack;

    for (let i=0;i<stack.length;i++) {
      if (stack[i] === '<left>') {
        mainStacks.push( [] );
      }

      if (stack[i] === '<right>') {
        middleStack = mainStacks.pop();
        mainStacks[mainStacks.length-1].push(middleStack);
        mainStacks[mainStacks.length-1] = mainStacks[mainStacks.length-1].concat(tailStack);
        tailStack = [];
      }

      if ( (stack[i] != '<left>') && (stack[i] != '<right>') ) {
        mainStacks[mainStacks.length-1].push(stack[i]);
      }
    }

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

  // Building a string expression object is much simpler than numeric
	// expressions, since the only operation in a string expression is
	// concatenation. Therefore,	a string expression object is composed of an
	// array of one or more subarrays, where each subarray has two elements. The
	// first element is a symbol, either "<str>" for a string literal or "<var>"
	// for a string variable. The second element for a string literal is the
	// string itself. For a string variable, the second element is the variable
	// name.
	//
	// Please note that the name for a string variable is recorded WITHOUT the
	// dollar sign character ($). In BASIC syntax, string variable names are always
	// preceeded with the '$' character to differentiate them from numeric variable
	// names. However, there was no need to include them in the data objects for
	// this app.
	//
	// For example, to represent:
	//	 "MY NAME IS "+$N
	// we would use:
	//	 [ ["<str>", "MY NAME IS "], ["<var>", "N"] ].


  buildStringExpression (stack: string[]): string[][] {
    let parts: string[][] = [];
    let tk: string;
    for (let t=1;t<=stack.length-3;t=t+3) {
      if (stack[t] === '<string_variable>') {
        tk = '<var>';
      }
      else
      {
        tk = '<str>';
      }
      parts.push( [tk, stack[t+1]] );
    }
    return parts;
  }

}



export class BooleanExpressionBuilder {

  // The only allowable construct in the earliest forms of BASIC which could be
	// construed as "boolean expressions" were the comparator statements in IF
	// statements such as 'IF A>B THEN 200'. There were no such things as boolean
	// variables or expressions which could be given a value of 'true' or false'.
	//
	// A "boolean expression" of this type consists of three parts, represented by
	// the properties of the boolean expression object. These are a variable name,
	// followed by a comparator, followed by a numeric or string expression. The
	// object property names used for these entities are "var" for the variable,
	// "exp" for the comparator, and either "num_exp" or "str_exp" for the
	// expression the variable is being compared to.
	//
	// The only allowable comparators for a string expression are '=' for 'equals'
	// (not '==' as is more common in modern programming languages) and '<>' for
	// 'not equal'. Comparators allowed in a numeric boolean expression are '='
	// (equals), '<>' (not equal), '>' (greater than), '>=' (greater or equal to),
	// '<' (less than), and '<=' (lesser or equal to).
	//
	// The object for the boolean expression
	//	 W>100
	// would be represented as:
	//	 {exp: "<num_greater_than>",
	//		var: "W",
	//		num_exp: {exp: "<numeric_literal>", value: 100} }.
	// Further examples can be found in the test specs.


  // constructor (
  //   numExpBuilder: NumericExpressionBuilder,
  //   strExpBuilder: StringExpressionBuilder) {  this.numExpBuilder = numExpBuilder; ...
  //
  // }


  // buildBooleanExpression (stack: string[]): BooleanExpressionObject {
  //
  // }


  // constructor (register: NumericVariableRegister) {
  //   this.register = register;

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
      ["-","_"], ["=","+"], [";",":"], ["-","_"], ["=","+"], [";",":"],
      ["0",")"], ["1","!"], ["2","@"], ["3","#"], ["4","$"], ["5","%"], ["6","^"], ["7","&"], ["8","*"], ["9","("],
      ["0","0"], ["1","1"], ["2","2"], ["3","3"], ["4","4"], ["5","5"], ["6","6"], ["7","7"], ["8","8"], ["9","9"],
      ["+","+"], ["-","-"], ["*","*"], ["/","/"], [".","."],
      ["A","A"], ["B","B"], ["C","C"], ["D","D"], ["E","E"], ["F","F"], ["G","G"], ["H","H"], ["I","I"],
      ["J","J"], ["K","K"], ["L","L"], ["M","M"], ["N","N"], ["O","O"], ["P","P"], ["Q","Q"], ["R","R"],
      ["S","S"], ["T","T"], ["U","U"], ["V","V"], ["W","W"], ["X","X"], ["Y","Y"], ["Z","Z"],
      [",","<"], [".",">"], ["/","?"], ["`","~"], ["[","{"], ["]","}"], ["'",'"']
    ];

    // TODO Why are '[' and ']' not implemented?
    this.chars = [
      "!", '"', "#", "$", "%", "&", "'",
      "(", ")", "*", "+", ",", "-", ".", "/", "0", "1",
      "2", "3", "4", "5", "6", "7", "8", "9", ":", ";",
      "<", "=", ">", "?", "@",
      "^", "_", "`", "A", "B", "C",
      "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
      "X", "Y", "Z", "{", "|", "}","~"
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

  defined (name: string) {
    if (this.vars.hasOwnProperty(name)) {
      return 'yes';
    }
    else {
      return 'no';
    }
  }

  set (name: string, value: any) {
    if (this.defined(name) === 'no') {
      this.addVar(name);
    }
    this.vars[name] = value;
  }

  get (name: string): any {
    if (this.defined(name) === 'no') {
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
    this.vars[name] = "";
  }

}



export class NumericExpressionEvaluator {

  // Builds a numeric expression object from an array of parse tokens.
	//
  // The Typescript version uses the NumericExpressionObject interface.
  // [   TODO Somewhere, probably under NumericExpressionBuilder class, we need to   ]
  //    add an updated explanation of how the NumericExpressionObjects work.   ]
  //


	// The object for the simple variable name X will be:
	//	 {exp: "<numeric_variable>", name: "X"}.
	//
	// The object for a simple numeric literal such as 3.1416 will be:
	//	 {exp: "<numeric_literal>", value: 3.1416}.
	//
	// Compound numeric expressions are built into binary numeric expression
	// objects with three properties: The "exp" property will be a symbol denoting
	// the operator within the expression with the highest precedence. The values
	// of the "op1" and "op2" properties will be nested numeric expression objects.
	// So, for example, in the expression 3*A+2*B-5*C the "exp" property will be
	// "<plus>", the value of "op1" will be an object representing 3*A, and the
	// value of "op2" will be an object representing 2*B-5*C.


  register: NumericVariableRegister;


  constructor (register: NumericVariableRegister) {
    this.register = register;
  }


  evaluate(expression: NumericExpressionObject) {
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


  evaluateNumericLiteral (expression: NumericExpressionObject) {
    return expression.value;
  }


  evaluateNumericVariable (expression: NumericExpressionObject) {
    return this.register.get(expression.name);
  }


  evaluateRNDKeyword () {
    return Math.random();
  }


  evaluateBinaryOperation (expression: NumericExpressionObject) {
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
