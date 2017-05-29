GB80 = require('../gb80');
LineParser = GB80.LineParser;
SyntaxRules = GB80.SyntaxRules;
NumericExpressionParser = GB80.NumericExpressionParser;

describe('BASIC program line parser', function() {

  beforeEach(function() {
    this.syntax = new SyntaxRules;
    this.numExpParser = new NumericExpressionParser;
    this.parser = new LineParser(this.syntax, this.numExpParser);
  });


  it('should correctly parse a terminal command', function() {

    result = this.parser.parse('CLEAR');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual('<clear_command>');

    result = this.parser.parse('RUN');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual('<run_command>');

    result = this.parser.parse('LIST');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual('<list_command>');

    result = this.parser.parse('INFO');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual('<info_command>');

  });


  xit('should correctly parse line numbers in program lines', function() {

    result = this.parser.parse('10 REM WELCOME TO GRANDPA BASIC 80');
    expect(result).toEqual(jasmine.any(Array));
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(10);

    result = this.parser.parse('20 $T="FRODO BAGGINS"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(20);

    result = this.parser.parse('30 INPUT "DISPLAY NAME (Y/N)?";$Y');
    expect(result).toEqual(jasmine.any(Array));
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(30);

    result = this.parser.parse('40 IF $Y<>"Y" THEN 100');
    expect(result).toEqual(jasmine.any(Array));
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(40);

    result = this.parser.parse('50 PRINT "WRITTEN BY "+$T');
    expect(result).toEqual(jasmine.any(Array));
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(50);

    result = this.parser.parse('100 PRINT "OK BYE"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(100);

    result = this.parser.parse('999 END');
    expect(result).toEqual(jasmine.any(Array));
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(999);

  });


  xit('should correctly parse a valid program line number with nothing following it', function() {

    result = this.parser.parse('440');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(440);

    result = this.parser.parse('1280');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(1280);

  });


  xit('should correctly parse a REM program line', function() {

    result = this.parser.parse('100 REM');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(100);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<remark>');

    result = this.parser.parse('110 REM WELCOME TO GRANDPA BASIC 1980');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(6);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(110);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<remark>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<characters>');

  });


  it('should correctly parse a numeric assignment program line', function() {

    result = this.parser.parse('180 X=77');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(10);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(180);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<numeric_variable>');
    expect(result[4]).toEqual('X');
    expect(result[5]).toEqual('<equals>');
    expect(result[6]).toEqual('<numeric_expression>');
    expect(result[7]).toEqual('<numeric_literal>');
    expect(result[8]).toEqual(77);
    expect(result[9]).toEqual('<num_exp_end>');

    result = this.parser.parse('320 K5=K2*K3+(2*K4)');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(21);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(320);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<numeric_variable>');
    expect(result[4]).toEqual('K5');
    expect(result[5]).toEqual('<equals>');
    expect(result[6]).toEqual('<numeric_expression>');
    expect(result[7]).toEqual('<numeric_variable>');
    expect(result[8]).toEqual('K2');
    expect(result[9]).toEqual('<times>');
    expect(result[10]).toEqual('<numeric_variable>');
    expect(result[11]).toEqual('K3');
    expect(result[12]).toEqual('<plus>');
    expect(result[13]).toEqual('<left>');
    expect(result[14]).toEqual('<numeric_literal>');
    expect(result[15]).toEqual(2);
    expect(result[16]).toEqual('<times>');
    expect(result[17]).toEqual('<numeric_variable>');
    expect(result[18]).toEqual('K4');
    expect(result[19]).toEqual('<right>');
    expect(result[20]).toEqual('<num_exp_end>');

    result = this.parser.parse('660 R=1+(B^2-4*A*C)/(2*A)');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(35);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(660);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<numeric_variable>');
    expect(result[4]).toEqual('R');
    expect(result[5]).toEqual('<equals>');
    expect(result[6]).toEqual('<numeric_expression>');
    expect(result[7]).toEqual('<numeric_literal>');
    expect(result[8]).toEqual(1);
    expect(result[9]).toEqual('<plus>');
    expect(result[10]).toEqual('<left>');
    expect(result[11]).toEqual('<numeric_variable>');
    expect(result[12]).toEqual('B');
    expect(result[13]).toEqual('<power>');
    expect(result[14]).toEqual('<numeric_literal>');
    expect(result[15]).toEqual(2);
    expect(result[16]).toEqual('<minus>');
    expect(result[17]).toEqual('<numeric_literal>');
    expect(result[18]).toEqual(4);
    expect(result[19]).toEqual('<times>');
    expect(result[20]).toEqual('<numeric_variable>');
    expect(result[21]).toEqual('A');
    expect(result[22]).toEqual('<times>');
    expect(result[23]).toEqual('<numeric_variable>');
    expect(result[24]).toEqual('C');
    expect(result[25]).toEqual('<right>');
    expect(result[26]).toEqual('<divide>');
    expect(result[27]).toEqual('<left>');
    expect(result[28]).toEqual('<numeric_literal>');
    expect(result[29]).toEqual(2);
    expect(result[30]).toEqual('<times>');
    expect(result[31]).toEqual('<numeric_variable>');
    expect(result[32]).toEqual('A');
    expect(result[33]).toEqual('<right>');
    expect(result[34]).toEqual('<num_exp_end>');

    // result = this.parser.parse('940 F=20*RND');
    // expect(result).toEqual(jasmine.any(Array));
    // // expect(result.length).toEqual(12);
    // expect(result[0]).toEqual('<line_number>');
    // expect(result[1]).toEqual(940);
    // expect(result[2]).toEqual('<space>');
    // expect(result[3]).toEqual('<numeric_variable>');
    // expect(result[4]).toEqual('F');
    // // expect(result[5]).toEqual('<equals>');
    // // expect(result[6]).toEqual('<numeric_expression>');
    // // expect(result[7]).toEqual('<numeric_literal>');
    // // expect(result[8]).toEqual(20);
    // // expect(result[9]).toEqual('<times>');
    // // expect(result[10]).toEqual('<random>');
    // // expect(result[11]).toEqual('<num_exp_end>');

  });


  xit('should correctly parse a string assignment program line', function() {

    result = this.parser.parse('820 $V="HOY ES VIERNES"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(10);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(820);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<string_variable>');
    expect(result[4]).toEqual('V');
    expect(result[5]).toEqual('<equals>');
    expect(result[6]).toEqual('<string_expression>');
    expect(result[7]).toEqual('<string_literal>');
    expect(result[8]).toEqual('HOY ES VIERNES');
    expect(result[9]).toEqual('<str_exp_end>');

    result = this.parser.parse('1370 $T2=$T4+" IS PART OF "+$T6');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(16);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(1370);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<string_variable>');
    expect(result[4]).toEqual('T2');
    expect(result[5]).toEqual('<equals>');
    expect(result[6]).toEqual('<string_expression>');
    expect(result[7]).toEqual('<string_variable>');
    expect(result[8]).toEqual('T4');
    expect(result[9]).toEqual('<plus>');
    expect(result[10]).toEqual('<string_literal>');
    expect(result[11]).toEqual(' IS PART OF ');
    expect(result[12]).toEqual('<plus>');
    expect(result[13]).toEqual('<string_variable>');
    expect(result[14]).toEqual('T6');
    expect(result[15]).toEqual('<str_exp_end>');

  });


  xit('should correctly parse GOTO, GOSUB and RETURN program lines', function() {

    result = this.parser.parse('1840 GOTO 2100');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(7);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(1840);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<goto>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<line_number>');
    expect(result[6]).toEqual(2100);

    result = this.parser.parse('630 GOSUB 1400');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(7);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(630);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<gosub>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<line_number>');
    expect(result[6]).toEqual(1400);

    result = this.parser.parse('1499 RETURN');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(1499);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<return>');

  });


  xit('should correctly parse IF statement program lines', function() {

    result = this.parser.parse('340 IF N>0 THEN 200');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(19);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(340);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<if>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<boolean_expression>');
    expect(result[6]).toEqual('<numeric_variable>');
    expect(result[7]).toEqual('N');
    expect(result[8]).toEqual('<greater_than>');
    expect(result[9]).toEqual('<numeric_expression>');
    expect(result[10]).toEqual('<numeric_literal>');
    expect(result[11]).toEqual(0);
    expect(result[12]).toEqual('<num_exp_end>');
    expect(result[13]).toEqual('<bool_exp_end>');
    expect(result[14]).toEqual('<space>');
    expect(result[15]).toEqual('<then>');
    expect(result[16]).toEqual('<space>');
    expect(result[17]).toEqual('<line_number>');
    expect(result[18]).toEqual(200);

    result = this.parser.parse('570 IF $Z="EXTRA" THEN 700');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(19);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(570);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<if>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<boolean_expression>');
    expect(result[6]).toEqual('<string_variable>');
    expect(result[7]).toEqual('Z');
    expect(result[8]).toEqual('<equals>');
    expect(result[9]).toEqual('<string_expression>');
    expect(result[10]).toEqual('<string_literal>');
    expect(result[11]).toEqual('EXTRA');
    expect(result[12]).toEqual('<str_exp_end>');
    expect(result[13]).toEqual('<bool_exp_end>');
    expect(result[14]).toEqual('<space>');
    expect(result[15]).toEqual('<then>');
    expect(result[16]).toEqual('<space>');
    expect(result[17]).toEqual('<line_number>');
    expect(result[18]).toEqual(700);

  });


  xit('should correctly parse INPUT program lines', function() {

    result = this.parser.parse('820 INPUT R');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(7);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(820);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<input>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<numeric_variable>');
    expect(result[6]).toEqual('R');

    result = this.parser.parse('410 INPUT $V');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(7);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(410);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<input>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<string_variable>');
    expect(result[6]).toEqual('V');

    result = this.parser.parse('750 INPUT "HOW MANY?";M');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(10);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(750);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<input>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<characters>');
    expect(result[6]).toEqual('HOW MANY?');
    expect(result[7]).toEqual('<semicolon>');
    expect(result[8]).toEqual('<numeric_variable>');
    expect(result[9]).toEqual('M');

    result = this.parser.parse('1740 INPUT "LAST NAME?";$N2');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(10);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(1740);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<input>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<characters>');
    expect(result[6]).toEqual('LAST NAME?');
    expect(result[7]).toEqual('<semicolon>');
    expect(result[8]).toEqual('<string_variable>');
    expect(result[9]).toEqual('N2');

  });


  xit('should correctly parse PRINT program lines', function() {

    result = this.parser.parse('110 PRINT "WELCOME TO GRANDPA BASIC 1980"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(9);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(110);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<print>');
    expect(result[4]).toEqual('<space>');
    expect(result[5]).toEqual('<string_expression>');
    expect(result[6]).toEqual('<string_literal>');
    expect(result[7]).toEqual('WELCOME TO GRANDPA BASIC 1980');
    expect(result[8]).toEqual('<str_exp_end>');

  });


  xit('should correctly parse an END program line', function() {

    result = this.parser.parse('1599 END');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual('<line_number>');
    expect(result[1]).toEqual(1599);
    expect(result[2]).toEqual('<space>');
    expect(result[3]).toEqual('<end>');

  });


  xit('should reject any otherwise valid line with extra characters at the end', function() {

    result = this.parser.parse('CLEAR ALL DATA');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('RUN PROGRAM GB80.BAS');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('INFO FOR GB80');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('LIST PROGRAM');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('1180 X=77 OR Z=77');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('330 $W="TOTAL WEIGHT" =40-3');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('650 GOTO 990 && CONTINUE');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('410 GOSUB 960 RETURN');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('1199 RETURN 870');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('690 IF T>100 THEN 1600 ELSE 1800');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('1290 INPUT X,Y,Z');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('2860 INPUT $V,$V2,$V7');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('1350 INPUT "ENTER VALUE";H;"ENTER QUANTITY";Q');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('840 PRINT "THIS IS IT" X=Y');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('720 PRINTLN; PRINTLN "SUMMARY"');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('890 PRINTLN $R+$U6+" IS "+$I4 AND RETURN');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('140 TAB 16,18,42');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('460 CLEARSCRN & TAB 10,14');
    expect(result).toEqual('<parse_error>');

    result = this.parser.parse('1990 END PROGRAM');
    expect(result).toEqual('<parse_error>');

  });


});
