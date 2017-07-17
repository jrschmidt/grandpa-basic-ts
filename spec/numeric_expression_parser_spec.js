GB80 = require('../gb80');
NumericExpressionParser = GB80.NumericExpressionParser;

describe('Numeric expression parser', function() {

  beforeEach(function() {
    this.parser = new NumericExpressionParser;
  });


  it('should split string at delimiters and tokenize the string', function() {
    var str, tokens;

    str = 'X';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(1);
    expect(tokens[0]).toEqual('X');

    str = '42';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(1);
    expect(tokens[0]).toEqual('42');

    str = '13.477';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(1);
    expect(tokens[0]).toEqual('13.477');

    str = '12/3';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(3);
    expect(tokens[0]).toEqual('12');
    expect(tokens[1]).toEqual('<divide>');
    expect(tokens[2]).toEqual('3');

    str = '477+B';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(3);
    expect(tokens[0]).toEqual('477');
    expect(tokens[1]).toEqual('<plus>');
    expect(tokens[2]).toEqual('B');

    str = 'C^2';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(3);
    expect(tokens[0]).toEqual('C');
    expect(tokens[1]).toEqual('<power>');
    expect(tokens[2]).toEqual('2');

    str = 'X*Y*Z';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(5);
    expect(tokens[0]).toEqual('X');
    expect(tokens[1]).toEqual('<times>');
    expect(tokens[2]).toEqual('Y');
    expect(tokens[3]).toEqual('<times>');
    expect(tokens[4]).toEqual('Z');

    str = '28*(J+2)';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(7);
    expect(tokens[0]).toEqual('28');
    expect(tokens[1]).toEqual('<times>');
    expect(tokens[2]).toEqual('<left>');
    expect(tokens[3]).toEqual('J');
    expect(tokens[4]).toEqual('<plus>');
    expect(tokens[5]).toEqual('2');
    expect(tokens[6]).toEqual('<right>');

    str = 'W5+W7-4*(J^2+K^3)';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(15);
    expect(tokens[0]).toEqual('W5');
    expect(tokens[1]).toEqual('<plus>');
    expect(tokens[2]).toEqual('W7');
    expect(tokens[3]).toEqual('<minus>');
    expect(tokens[4]).toEqual('4');
    expect(tokens[5]).toEqual('<times>');
    expect(tokens[6]).toEqual('<left>');
    expect(tokens[7]).toEqual('J');
    expect(tokens[8]).toEqual('<power>');
    expect(tokens[9]).toEqual('2');
    expect(tokens[10]).toEqual('<plus>');
    expect(tokens[11]).toEqual('K');
    expect(tokens[12]).toEqual('<power>');
    expect(tokens[13]).toEqual('3');
    expect(tokens[14]).toEqual('<right>');

    str = '(18-Q7)/(2.108*(14*M+17*X))';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(19);
    expect(tokens[0]).toEqual('<left>');
    expect(tokens[1]).toEqual('18');
    expect(tokens[2]).toEqual('<minus>');
    expect(tokens[3]).toEqual('Q7');
    expect(tokens[4]).toEqual('<right>');
    expect(tokens[5]).toEqual('<divide>');
    expect(tokens[6]).toEqual('<left>');
    expect(tokens[7]).toEqual('2.108');
    expect(tokens[8]).toEqual('<times>');
    expect(tokens[9]).toEqual('<left>');
    expect(tokens[10]).toEqual('14');
    expect(tokens[11]).toEqual('<times>');
    expect(tokens[12]).toEqual('M');
    expect(tokens[13]).toEqual('<plus>');
    expect(tokens[14]).toEqual('17');
    expect(tokens[15]).toEqual('<times>');
    expect(tokens[16]).toEqual('X');
    expect(tokens[17]).toEqual('<right>');
    expect(tokens[18]).toEqual('<right>');

  });


  it('should parse properly formed strings into numeric variables or literals', function() {
    var result;

    result = this.parser.parseNumericValue('0');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<numeric_literal>');
    expect(result[1]).toEqual(0);

    result = this.parser.parseNumericValue('6');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<numeric_literal>');
    expect(result[1]).toEqual(6);

    result = this.parser.parseNumericValue('967');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<numeric_literal>');
    expect(result[1]).toEqual(967);

    result = this.parser.parseNumericValue('428.17');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<numeric_literal>');
    expect(result[1]).toEqual(428.17);

    result = this.parser.parseNumericValue('X');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<numeric_variable>');
    expect(result[1]).toEqual('X');

    result = this.parser.parseNumericValue('K7');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<numeric_variable>');
    expect(result[1]).toEqual('K7');

    result = this.parser.parseNumericValue('1,420,366');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

    result = this.parser.parseNumericValue('$10');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

    result = this.parser.parseNumericValue('18 737');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

    result = this.parser.parseNumericValue('PI');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

    result = this.parser.parseNumericValue('67.40.11');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

  });


  it("should return a failed result for any string that won't parse into a numeric expression", function() {
    var result;

    result = this.parser.parse('617.42.9');
    expect(result).toEqual( [] );

    result = this.parser.parse('180-45DEGREES');
    expect(result).toEqual( [] );

    result = this.parser.parse('NOTHING PARSEABLE AS A NUMERIC EXPRESSION');
    expect(result).toEqual( [] );

    result = this.parser.parse('2*PI');
    expect(result).toEqual( [] );

    result = this.parser.parse('22,348,507');
    expect(result).toEqual( [] );

    result = this.parser.parse('????');
    expect(result).toEqual( [] );

    result = this.parser.parse('A+114-@<%');
    expect(result).toEqual( [] );

  });


  it('should parse any properly formed numeric expression', function() {
    var result;

    result = this.parser.parse('X');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<numeric_variable>');
    expect(result[2]).toEqual('X');
    expect(result[3]).toEqual('<num_exp_end>');

    result = this.parser.parse('42');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<numeric_literal>');
    expect(result[2]).toEqual(42);
    expect(result[3]).toEqual('<num_exp_end>');

    result = this.parser.parse('13.477');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<numeric_literal>');
    expect(result[2]).toEqual(13.477);
    expect(result[3]).toEqual('<num_exp_end>');

    result = this.parser.parse('12/3');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<numeric_literal>');
    expect(result[2]).toEqual(12);
    expect(result[3]).toEqual('<divide>');
    expect(result[4]).toEqual('<numeric_literal>');
    expect(result[5]).toEqual(3);
    expect(result[6]).toEqual('<num_exp_end>');

    result = this.parser.parse('477+B');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<numeric_literal>');
    expect(result[2]).toEqual(477);
    expect(result[3]).toEqual('<plus>');
    expect(result[4]).toEqual('<numeric_variable>');
    expect(result[5]).toEqual('B');
    expect(result[6]).toEqual('<num_exp_end>');

    result = this.parser.parse('C^2');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<numeric_variable>');
    expect(result[2]).toEqual('C');
    expect(result[3]).toEqual('<power>');
    expect(result[4]).toEqual('<numeric_literal>');
    expect(result[5]).toEqual(2);
    expect(result[6]).toEqual('<num_exp_end>');

    // result = this.parser.parse('20*RND');
    // expect(result[0]).toEqual('<numeric_expression>');
    // expect(result[1]).toEqual('<numeric_literal>');
    // expect(result[2]).toEqual(20);
    // expect(result[3]).toEqual('<times>');
    // expect(result[4]).toEqual('<random>');
    // expect(result[5]).toEqual('<num_exp_end>');

    result = this.parser.parse('X*Y*Z');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<numeric_variable>');
    expect(result[2]).toEqual('X');
    expect(result[3]).toEqual('<times>');
    expect(result[4]).toEqual('<numeric_variable>');
    expect(result[5]).toEqual('Y');
    expect(result[6]).toEqual('<times>');
    expect(result[7]).toEqual('<numeric_variable>');
    expect(result[8]).toEqual('Z');
    expect(result[9]).toEqual('<num_exp_end>');

    result = this.parser.parse('28*(J+2)');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<numeric_literal>');
    expect(result[2]).toEqual(28);
    expect(result[3]).toEqual('<times>');
    expect(result[4]).toEqual('<left>');
    expect(result[5]).toEqual('<numeric_variable>');
    expect(result[6]).toEqual('J');
    expect(result[7]).toEqual('<plus>');
    expect(result[8]).toEqual('<numeric_literal>');
    expect(result[9]).toEqual(2);
    expect(result[10]).toEqual('<right>');
    expect(result[11]).toEqual('<num_exp_end>');

    // result = this.parser.parse('INT(W)');
    // expect(result[0]).toEqual('<numeric_expression>');
    // expect(result[1]).toEqual('<integer>');
    // expect(result[2]).toEqual('<left>');
    // expect(result[3]).toEqual('<numeric_variable>');
    // expect(result[4]).toEqual('W');
    // expect(result[5]).toEqual('<right>');
    // expect(result[6]).toEqual('<num_exp_end>');

    result = this.parser.parse('W5+W7-4*(J^2+K^3)');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<numeric_variable>');
    expect(result[2]).toEqual('W5');
    expect(result[3]).toEqual('<plus>');
    expect(result[4]).toEqual('<numeric_variable>');
    expect(result[5]).toEqual('W7');
    expect(result[6]).toEqual('<minus>');
    expect(result[7]).toEqual('<numeric_literal>');
    expect(result[8]).toEqual(4);
    expect(result[9]).toEqual('<times>');
    expect(result[10]).toEqual('<left>');
    expect(result[11]).toEqual('<numeric_variable>');
    expect(result[12]).toEqual('J');
    expect(result[13]).toEqual('<power>');
    expect(result[14]).toEqual('<numeric_literal>');
    expect(result[15]).toEqual(2);
    expect(result[16]).toEqual('<plus>');
    expect(result[17]).toEqual('<numeric_variable>');
    expect(result[18]).toEqual('K');
    expect(result[19]).toEqual('<power>');
    expect(result[20]).toEqual('<numeric_literal>');
    expect(result[21]).toEqual(3);
    expect(result[22]).toEqual('<right>');
    expect(result[23]).toEqual('<num_exp_end>');

    result = this.parser.parse('(18-Q7)/(2.108*(14*M+17*X))');
    expect(result[0]).toEqual('<numeric_expression>');
    expect(result[1]).toEqual('<left>');
    expect(result[2]).toEqual('<numeric_literal>');
    expect(result[3]).toEqual(18);
    expect(result[4]).toEqual('<minus>');
    expect(result[5]).toEqual('<numeric_variable>');
    expect(result[6]).toEqual('Q7');
    expect(result[7]).toEqual('<right>');
    expect(result[8]).toEqual('<divide>');
    expect(result[9]).toEqual('<left>');
    expect(result[10]).toEqual('<numeric_literal>');
    expect(result[11]).toEqual(2.108);
    expect(result[12]).toEqual('<times>');
    expect(result[13]).toEqual('<left>');
    expect(result[14]).toEqual('<numeric_literal>');
    expect(result[15]).toEqual(14);
    expect(result[16]).toEqual('<times>');
    expect(result[17]).toEqual('<numeric_variable>');
    expect(result[18]).toEqual('M');
    expect(result[19]).toEqual('<plus>');
    expect(result[20]).toEqual('<numeric_literal>');
    expect(result[21]).toEqual(17);
    expect(result[22]).toEqual('<times>');
    expect(result[23]).toEqual('<numeric_variable>');
    expect(result[24]).toEqual('X');
    expect(result[25]).toEqual('<right>');
    expect(result[26]).toEqual('<right>');
    expect(result[27]).toEqual('<num_exp_end>');

  });


});
