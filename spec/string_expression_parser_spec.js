GB80 = require('../gb80');
StringExpressionParser = GB80.StringExpressionParser;

describe('String expression parser', function() {

  beforeEach(function() {
    this.parser = new StringExpressionParser;
  });


  it('should split string at delimiters and tokenize the string', function() {
    var str, tokens;

    str = '$A';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(1);
    expect(tokens[0]).toEqual('$A');

    str = '$R0';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(1);
    expect(tokens[0]).toEqual('$R0');

    str = 'HELLO, IM JOHNNY CASH';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(1);
    expect(tokens[0]).toEqual('HELLO, IM JOHNNY CASH');

    str = '$Q5+$Q6+$Q7';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(5);
    expect(tokens[0]).toEqual('$Q5');
    expect(tokens[1]).toEqual('<plus>');
    expect(tokens[2]).toEqual('$Q6');
    expect(tokens[3]).toEqual('<plus>');
    expect(tokens[4]).toEqual('$Q7');

    str = '$W+'.concat(' IS THE WINNER!');
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(3);
    expect(tokens[0]).toEqual('$W');
    expect(tokens[1]).toEqual('<plus>');
    expect(tokens[2]).toEqual(' IS THE WINNER!');

    str = '"MY NAME IS "+$N';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(3);
    expect(tokens[0]).toEqual('"MY NAME IS "');
    expect(tokens[1]).toEqual('<plus>');
    expect(tokens[2]).toEqual('$N');

  });


  xit('should parse properly formed strings into string variables or literals', function() {
    var result;

    result = this.parser.parseStringValue('$T');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_variable>');
    expect(result[1]).toEqual('T');

    result = this.parser.parseStringValue('$Z8');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_variable>');
    expect(result[1]).toEqual('Z8');

    result = this.parser.parseStringValue('$K0');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_variable>');
    expect(result[1]).toEqual('K0');

    result = this.parser.parseStringValue('BANANA');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_literal>');
    expect(result[1]).toEqual('BANANA');

    result = this.parser.parseStringValue('27 BANANAS AND A LEMON');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_literal>');
    expect(result[1]).toEqual('27 BANANAS AND A LEMON');

    result = this.parser.parseStringValue('ALMOST ANY CHARACTERS ...');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_literal>');
    expect(result[1]).toEqual('ALMOST ANY CHARACTERS ...');

    result = this.parser.parseStringValue('MISSING QUOTE MARKS');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('bad');
    expect(result[1]).toEqual('bad');

    result = this.parser.parseStringValue('440-(3*X+5*Y)');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('bad');
    expect(result[1]).toEqual('bad');

    result = this.parser.parseStringValue('260 $E="TOKEN"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('bad');
    expect(result[1]).toEqual('bad');

  });


  xit('should parse any properly formed string expression', function() {
    // FIXME What about plus signs ('+') inside a string literal?

    var po, result;

    result = this.parser.parseStringExpression('$R');
    po = result.parse_object;
    expect(po.length).toEqual(4);
    expect(po[0]).toEqual('<string_expression>');
    expect(po[1]).toEqual('<string_variable>');
    expect(po[2]).toEqual('R');
    expect(po[3]).toEqual('<str_exp_end>');

    result = this.parser.parseStringExpression('$T8');
    po = result.parse_object;
    expect(po.length).toEqual(4);
    expect(po[0]).toEqual('<string_expression>');
    expect(po[1]).toEqual('<string_variable>');
    expect(po[2]).toEqual('T8');
    expect(po[3]).toEqual('<str_exp_end>');

    result = this.parser.parseStringExpression('$X0');
    po = result.parse_object;
    expect(po.length).toEqual(4);
    expect(po[0]).toEqual('<string_expression>');
    expect(po[1]).toEqual('<string_variable>');
    expect(po[2]).toEqual('X0');
    expect(po[3]).toEqual('<str_exp_end>');

    result = this.parser.parseStringExpression('HUMMINGBIRD');
    po = result.parse_object;
    expect(po.length).toEqual(4);
    expect(po[0]).toEqual('<string_expression>');
    expect(po[1]).toEqual('<string_literal>');
    expect(po[2]).toEqual('HUMMINGBIRD');
    expect(po[3]).toEqual('<str_exp_end>');

    result = this.parser.parseStringExpression('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    po = result.parse_object;
    expect(po.length).toEqual(4);
    expect(po[0]).toEqual('<string_expression>');
    expect(po[1]).toEqual('<string_literal>');
    expect(po[2]).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(po[3]).toEqual('<str_exp_end>');

    result = this.parser.parseStringExpression('"LAST NAME: "+$N2');
    po = result.parse_object;
    expect(po.length).toEqual(7);
    expect(po[0]).toEqual('<string_expression>');
    expect(po[1]).toEqual('<string_literal>');
    expect(po[2]).toEqual('LAST NAME: ');
    expect(po[3]).toEqual('<plus>');
    expect(po[4]).toEqual('<string_variable>');
    expect(po[5]).toEqual('N2');
    expect(po[6]).toEqual('<str_exp_end>');

    result = this.parser.parseStringExpression('"FIRST NAME: "+$N0+";  LAST NAME: "+$N2');
    po = result.parse_object;
    expect(po.length).toEqual(13);
    expect(po[0]).toEqual('<string_expression>');
    expect(po[1]).toEqual('<string_literal>');
    expect(po[2]).toEqual('FIRST NAME: ');
    expect(po[3]).toEqual('<plus>');
    expect(po[4]).toEqual('<string_variable>');
    expect(po[5]).toEqual('N0');
    expect(po[6]).toEqual('<plus>');
    expect(po[7]).toEqual('<string_literal>');
    expect(po[8]).toEqual(';  LAST NAME: ');
    expect(po[9]).toEqual('<plus>');
    expect(po[10]).toEqual('<string_variable>');
    expect(po[11]).toEqual('N2');
    expect(po[12]).toEqual('<str_exp_end>');

    result = this.parser.parseStringExpression('$C2+" IS IN "+$D2');
    po = result.parse_object;
    expect(po.length).toEqual(10);
    expect(po[0]).toEqual('<string_expression>');
    expect(po[1]).toEqual('<string_variable>');
    expect(po[2]).toEqual('C2');
    expect(po[3]).toEqual('<plus>');
    expect(po[4]).toEqual('<string_literal>');
    expect(po[5]).toEqual(' IS IN ');
    expect(po[6]).toEqual('<plus>');
    expect(po[7]).toEqual('<string_variable>');
    expect(po[8]).toEqual('D2');
    expect(po[9]).toEqual('<str_exp_end>');

  });

});
