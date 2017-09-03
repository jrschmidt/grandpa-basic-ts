GB80 = require('../gb80');
BooleanExpressionParser = GB80.BooleanExpressionParser;

describe('Boolean expression parser', function() {

  beforeEach(function() {
    this.parser = new BooleanExpressionParser;
  });


  it('should separate a boolean expression from the characters that follow it', function() {
    var result;

    result = this.parser.extractBooleanExpression('Z<0 THEN 340');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('Z<0');
    expect(result[1]).toEqual(' THEN 340');

    result = this.parser.extractBooleanExpression('$T="INCOMPLETE" THEN 1680');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('$T="INCOMPLETE"');
    expect(result[1]).toEqual(' THEN 1680');

    result = this.parser.extractBooleanExpression('A>B THEN 750');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('A>B');
    expect(result[1]).toEqual(' THEN 750');

    result = this.parser.extractBooleanExpression('N>=1000 THEN 930');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('N>=1000');
    expect(result[1]).toEqual(' THEN 930');

  });


  xit('should tokenize a boolean expression string', function() {
    var result;

    result = this.parser.tokenize('$Y="Y"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual('$Y');
    expect(result[1]).toEqual('<equals>');
    expect(result[2]).toEqual('"Y"');

    result = this.parser.tokenize('N>0');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual('N');
    expect(result[1]).toEqual('<greater_than>');
    expect(result[2]).toEqual('0');

    result = this.parser.tokenize('I3<20');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual('I3');
    expect(result[1]).toEqual('<lesser_than>');
    expect(result[2]).toEqual('20');

    result = this.parser.tokenize('Z=A');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual('Z');
    expect(result[1]).toEqual('<equals>');
    expect(result[2]).toEqual('A');

    result = this.parser.tokenize('Q1<>Q2');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual('Q1');
    expect(result[1]).toEqual('<not_equal>');
    expect(result[2]).toEqual('Q2');

    result = this.parser.tokenize('T<=30');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual('T');
    expect(result[1]).toEqual('<lesser_equal>');
    expect(result[2]).toEqual('30');

    result = this.parser.tokenize('H>=H0');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual('H');
    expect(result[1]).toEqual('<greater_equal>');
    expect(result[2]).toEqual('H0');

  });


  xit('should return an error (empty array) for any string that wont parse into a boolean expression', function() {
    var result;

    result = this.parser.parse('"FOURTEEN THOUSAND"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

    result = this.parser.parse('$Z9');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

    result = this.parser.parse('(67-X)/(31*Y)');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

  });


  xit('should parse any properly formed boolean expression', function() {
    var result;

    result = this.parser.parse('$Y="Y"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(9);
    expect(po[0]).toEqual('<boolean_expression>');
    expect(po[1]).toEqual('<string_variable>');
    expect(po[2]).toEqual('Y');
    expect(po[3]).toEqual('<equals>');
    expect(po[4]).toEqual('<string_expression>');
    expect(po[5]).toEqual('<string_literal>');
    expect(po[6]).toEqual('Y');
    expect(po[7]).toEqual('<str_exp_end>');
    expect(po[8]).toEqual('<bool_exp_end>');

    result = this.parser.parse('N>0');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);
    expect(po[0]).toEqual('<boolean_expression>');
    expect(po[1]).toEqual('<numeric_variable>');
    expect(po[2]).toEqual('N');
    expect(po[3]).toEqual('<greater_than>');
    expect(po[4]).toEqual('<numeric_expression>');
    expect(po[5]).toEqual('<numeric_literal>');
    expect(po[6]).toEqual(0);
    expect(po[7]).toEqual('<num_exp_end>');
    expect(po[8]).toEqual('<bool_exp_end>');

    result = this.parser.parse('I3<20');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(9);
    expect(po[0]).toEqual('<boolean_expression>');
    expect(po[1]).toEqual('<numeric_variable>');
    expect(po[2]).toEqual('I3');
    expect(po[3]).toEqual('<lesser_than>');
    expect(po[4]).toEqual('<numeric_expression>');
    expect(po[5]).toEqual('<numeric_literal>');
    expect(po[6]).toEqual(20);
    expect(po[7]).toEqual('<num_exp_end>');
    expect(po[8]).toEqual('<bool_exp_end>');

    result = this.parser.parse('Z=A');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(9);
    expect(po[0]).toEqual('<boolean_expression>');
    expect(po[1]).toEqual('<numeric_variable>');
    expect(po[2]).toEqual('Z');
    expect(po[3]).toEqual('<equals>');
    expect(po[4]).toEqual('<numeric_expression>');
    expect(po[5]).toEqual('<numeric_variable>');
    expect(po[6]).toEqual('A');
    expect(po[7]).toEqual('<num_exp_end>');
    expect(po[8]).toEqual('<bool_exp_end>');

    result = this.parser.parse('Q1<>Q2');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(9);
    expect(po[0]).toEqual('<boolean_expression>');
    expect(po[1]).toEqual('<numeric_variable>');
    expect(po[2]).toEqual('Q1');
    expect(po[3]).toEqual('<not_equal>');
    expect(po[4]).toEqual('<numeric_expression>');
    expect(po[5]).toEqual('<numeric_variable>');
    expect(po[6]).toEqual('Q2');
    expect(po[7]).toEqual('<num_exp_end>');
    expect(po[8]).toEqual('<bool_exp_end>');

    result = this.parser.parse('T<=30');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(9);
    expect(po[0]).toEqual('<boolean_expression>');
    expect(po[1]).toEqual('<numeric_variable>');
    expect(po[2]).toEqual('T');
    expect(po[3]).toEqual('<lesser_equal>');
    expect(po[4]).toEqual('<numeric_expression>');
    expect(po[5]).toEqual('<numeric_literal>');
    expect(po[6]).toEqual(30);
    expect(po[7]).toEqual('<num_exp_end>');
    expect(po[8]).toEqual('<bool_exp_end>');

    result = this.parser.parse('H>=H0');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(9);
    expect(po[0]).toEqual('<boolean_expression>');
    expect(po[1]).toEqual('<numeric_variable>');
    expect(po[2]).toEqual('H');
    expect(po[3]).toEqual('<greater_equal>');
    expect(po[4]).toEqual('<numeric_expression>');
    expect(po[5]).toEqual('<numeric_variable>');
    expect(po[6]).toEqual('H0');
    expect(po[7]).toEqual('<num_exp_end>');
    expect(po[8]).toEqual('<bool_exp_end>');

  });


});
