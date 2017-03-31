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
