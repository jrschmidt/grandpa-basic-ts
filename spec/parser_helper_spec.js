GB80 = require('../gb80');
LineParserHelpers = GB80.LineParserHelpers;
NumericExpressionParser = GB80.NumericExpressionParser;

describe('Line parser helpers', function() {

  beforeEach(function() {
    this.nxp = new NumericExpressionParser
    this.lph = new LineParserHelpers(this.nxp);
    this.helpers = this.lph.helpers;
    this.helpers.match = 'no';
    this.helpers.stack = [];
    this.helpers.remainder = '';
  });


  it('should correctly parse a line number', function() {

    string = '440';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 440] );
    expect(this.helpers.remainder).toEqual('');

    string = '2260';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 2260] );
    expect(this.helpers.remainder).toEqual('');

    string = '100 REM';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 100] );
    expect(this.helpers.remainder).toEqual(' REM');

    string = '110 REM WELCOME TO GRANDPA BASIC 1980';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 110] );
    expect(this.helpers.remainder).toEqual(' REM WELCOME TO GRANDPA BASIC 1980');

    string = '200 X=200';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 200] );
    expect(this.helpers.remainder).toEqual(' X=200');

    string = '220 Z=X/M3';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 220] );
    expect(this.helpers.remainder).toEqual(' Z=X/M3');

    string = '630 GOTO 1200';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 630] );
    expect(this.helpers.remainder).toEqual(' GOTO 1200');

    string = '1280 INPUT $D';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 1280] );
    expect(this.helpers.remainder).toEqual(' INPUT $D');

  });


  it('should correctly parse a single specific character', function() {

    string = ' ';
    this.helpers.set(string).parseChar('space');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<space>'] );
    expect(this.helpers.remainder).toEqual('');

    string = ' REM HELLO';
    this.helpers.set(string).parseChar('space');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<space>'] );
    expect(this.helpers.remainder).toEqual('REM HELLO');

    string = ' X=7';
    this.helpers.set(string).parseChar('space');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<space>'] );
    expect(this.helpers.remainder).toEqual('X=7');

    string = ' GOTO 1660';
    this.helpers.set(string).parseChar('space');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<space>'] );
    expect(this.helpers.remainder).toEqual('GOTO 1660');

    string = '=13*W-M8';
    this.helpers.set(string).parseChar('equals');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<equals>'] );
    expect(this.helpers.remainder).toEqual('13*W-M8');

    string = '="ARIZONA"';
    this.helpers.set(string).parseChar('equals');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<equals>'] );
    expect(this.helpers.remainder).toEqual('"ARIZONA"');

    string = ';H4';
    this.helpers.set(string).parseChar('semicolon');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<semicolon>'] );
    expect(this.helpers.remainder).toEqual('H4');

    string = ';$K';
    this.helpers.set(string).parseChar('semicolon');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<semicolon>'] );
    expect(this.helpers.remainder).toEqual('$K');

    string = '(4*A*C)/D';
    this.helpers.set(string).parseChar('left');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<left>'] );
    expect(this.helpers.remainder).toEqual('4*A*C)/D');

    string = ')/(L2+L3+L4)';
    this.helpers.set(string).parseChar('right');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<right>'] );
    expect(this.helpers.remainder).toEqual('/(L2+L3+L4)');

  });


  it('should correctly parse a keyword', function() {

    string = 'REM SQUARE ROOT PROGRAM';
    this.helpers.set(string).parseKeyword('REM');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<remark>'] );
    expect(this.helpers.remainder).toEqual(' SQUARE ROOT PROGRAM');

    string = 'GOTO 780';
    this.helpers.set(string).parseKeyword('GOTO');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<goto>'] );
    expect(this.helpers.remainder).toEqual(' 780');

    string = 'GOSUB 12000';
    this.helpers.set(string).parseKeyword('GOSUB');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<gosub>'] );
    expect(this.helpers.remainder).toEqual(' 12000');

    string = 'RETURN';
    this.helpers.set(string).parseKeyword('RETURN');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<return>'] );
    expect(this.helpers.remainder).toEqual('');

    string = 'IF B>0 THEN 600';
    this.helpers.set(string).parseKeyword('IF');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<if>'] );
    expect(this.helpers.remainder).toEqual(' B>0 THEN 600');

    string = 'THEN 800';
    this.helpers.set(string).parseKeyword('THEN');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<then>'] );
    expect(this.helpers.remainder).toEqual(' 800');

    string = 'INPUT "NAME"; $N';
    this.helpers.set(string).parseKeyword('INPUT');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<input>'] );
    expect(this.helpers.remainder).toEqual(' "NAME"; $N');

    string = 'PRINT $T5';
    this.helpers.set(string).parseKeyword('PRINT');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<print>'] );
    expect(this.helpers.remainder).toEqual(' $T5');

    string = 'END';
    this.helpers.set(string).parseKeyword('END');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<end>'] );
    expect(this.helpers.remainder).toEqual('');

    string = 'INT(Z/Y)';
    this.helpers.set(string).parseKeyword('INT');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<integer>'] );
    expect(this.helpers.remainder).toEqual('(Z/Y)');

    string = 'RND*99)/N';
    this.helpers.set(string).parseKeyword('RND');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<random>'] );
    expect(this.helpers.remainder).toEqual('*99)/N');

  });


  it('should correctly parse a numeric variable name', function() {

    string = 'X';
    this.helpers.set(string).parseNumericVariable();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_variable>',
      'X'
    ] );
    expect(this.helpers.remainder).toEqual('');

    string = 'D5';
    this.helpers.set(string).parseNumericVariable();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_variable>',
      'D5'
    ] );
    expect(this.helpers.remainder).toEqual('');

    string = 'B+C';
    this.helpers.set(string).parseNumericVariable();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_variable>',
      'B'
    ] );
    expect(this.helpers.remainder).toEqual('+C');

    string = 'Z6-(Z8/Z5)';
    this.helpers.set(string).parseNumericVariable();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_variable>',
      'Z6'
    ] );
    expect(this.helpers.remainder).toEqual('-(Z8/Z5)');

    string = 'K)';
    this.helpers.set(string).parseNumericVariable();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_variable>',
      'K'
    ] );
    expect(this.helpers.remainder).toEqual( ')' );

  });


  it('should correctly parse a string variable name', function() {

    string = '$Z';
    this.helpers.set(string).parseStringVariable();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<string_variable>',
      'Z'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '$V8';
    this.helpers.set(string).parseStringVariable();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<string_variable>',
      'V8'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '$E2=$E7+$E8';
    this.helpers.set(string).parseStringVariable();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<string_variable>',
      'E2'
    ] );
    expect(this.helpers.remainder).toEqual( '=$E7+$E8' );

    string = '$J6="THE ANSWER IS "';
    this.helpers.set(string).parseStringVariable();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<string_variable>',
      'J6'
    ] );
    expect(this.helpers.remainder).toEqual( '="THE ANSWER IS "' );

  });


  it('should correctly parse a quoted string literal', function() {

    string = '"WELCOME TO GRANDPA BASIC 1980"';
    this.helpers.set(string).parseQuotedStringLiteral();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<string_literal>',
      'WELCOME TO GRANDPA BASIC 1980'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '"INCORRECT ANSWER"';
    this.helpers.set(string).parseQuotedStringLiteral();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<string_literal>',
      'INCORRECT ANSWER'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '"TYPE YOUR ANSWER";T8';
    this.helpers.set(string).parseQuotedStringLiteral();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<string_literal>',
      'TYPE YOUR ANSWER'
    ] );
    expect(this.helpers.remainder).toEqual( ';T8' );

  });


  it('should correctly parse a numeric expression', function() {

    string = 'X';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<numeric_variable>',
      'X',
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '42';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<numeric_literal>',
      42,
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '13.477';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<numeric_literal>',
      13.477,
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '12/7';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<numeric_literal>',
      12,
      '<divide>',
      '<numeric_literal>',
      7,
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '477+B';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<numeric_literal>',
      477,
      '<plus>',
      '<numeric_variable>',
      'B',
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = 'C^2';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<numeric_variable>',
      'C',
      '<power>',
      '<numeric_literal>',
      2,
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = 'X*Y*Z';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<numeric_variable>',
      'X',
      '<times>',
      '<numeric_variable>',
      'Y',
      '<times>',
      '<numeric_variable>',
      'Z',
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '28*(J+2)';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<numeric_literal>',
      28,
      '<times>',
      '<left>',
      '<numeric_variable>',
      'J',
      '<plus>',
      '<numeric_literal>',
      2,
      '<right>',
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = 'W5+W7-4*(J^2+K^3)';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<numeric_variable>',
      'W5',
      '<plus>',
      '<numeric_variable>',
      'W7',
      '<minus>',
      '<numeric_literal>',
      4,
      '<times>',
      '<left>',
      '<numeric_variable>',
      'J',
      '<power>',
      '<numeric_literal>',
      2,
      '<plus>',
      '<numeric_variable>',
      'K',
      '<power>',
      '<numeric_literal>',
      3,
      '<right>',
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

    string = '(18-Q7)/(2.108*(14*M+17*X))';
    this.helpers.set(string).parseNumericExpression();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( [
      '<numeric_expression>',
      '<left>',
      '<numeric_literal>',
      18,
      '<minus>',
      '<numeric_variable>',
      'Q7',
      '<right>',
      '<divide>',
      '<left>',
      '<numeric_literal>',
      2.108,
      '<times>',
      '<left>',
      '<numeric_literal>',
      14,
      '<times>',
      '<numeric_variable>',
      'M',
      '<plus>',
      '<numeric_literal>',
      17,
      '<times>',
      '<numeric_variable>',
      'X',
      '<right>',
      '<right>',
      '<num_exp_end>'
    ] );
    expect(this.helpers.remainder).toEqual( '' );

  });

});
