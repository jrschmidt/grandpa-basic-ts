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

    str = '"HELLO, IM JOHNNY CASH"';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(1);
    expect(tokens[0]).toEqual('"HELLO, IM JOHNNY CASH"');

    str = '$Q5+$Q6+$Q7';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(5);
    expect(tokens[0]).toEqual('$Q5');
    expect(tokens[1]).toEqual('<plus>');
    expect(tokens[2]).toEqual('$Q6');
    expect(tokens[3]).toEqual('<plus>');
    expect(tokens[4]).toEqual('$Q7');

    // str = '$W+'.concat('" IS THE WINNER!"');
    str = '$W+' + '" IS THE WINNER!"';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(3);
    expect(tokens[0]).toEqual('$W');
    expect(tokens[1]).toEqual('<plus>');
    expect(tokens[2]).toEqual('" IS THE WINNER!"');

    str = '"MY NAME IS "+$N';
    tokens = this.parser.tokenize(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toEqual(3);
    expect(tokens[0]).toEqual('"MY NAME IS "');
    expect(tokens[1]).toEqual('<plus>');
    expect(tokens[2]).toEqual('$N');

  });


  it('should parse properly formed strings into string variable names', function() {
    var result;

    result = this.parser.parseStringVariableName('$T');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_variable>');
    expect(result[1]).toEqual('T');

    result = this.parser.parseStringVariableName('$Z8');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_variable>');
    expect(result[1]).toEqual('Z8');

    result = this.parser.parseStringVariableName('$K0');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_variable>');
    expect(result[1]).toEqual('K0');

    result = this.parser.parseStringVariableName('$A');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_variable>');
    expect(result[1]).toEqual('A');

  });


  it('should parse properly formed strings into string literals', function() {
    var result;

    result = this.parser.parseStringLiteral('"BANANA"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_literal>');
    expect(result[1]).toEqual('BANANA');

    result = this.parser.parseStringLiteral('"27 BANANAS AND A LEMON"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_literal>');
    expect(result[1]).toEqual('27 BANANAS AND A LEMON');

    result = this.parser.parseStringLiteral('"ALMOST ANY CHARACTERS ..."');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<string_literal>');
    expect(result[1]).toEqual('ALMOST ANY CHARACTERS ...');
    
    result = this.parser.parseStringLiteral('MISSING QUOTE MARKS');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

    result = this.parser.parseStringLiteral('440-(3*X+5*Y)');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

    result = this.parser.parseStringLiteral('260 $E="TOKEN"');
    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toEqual(0);

  });


  it('should parse any properly formed string expression', function() {
    // FIXME What about plus signs ('+') inside a string literal?
    var result;

    result = this.parser.parse('$R');
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual('<string_expression>');
    expect(result[1]).toEqual('<string_variable>');
    expect(result[2]).toEqual('R');
    expect(result[3]).toEqual('<str_exp_end>');

    result = this.parser.parse('$T8');
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual('<string_expression>');
    expect(result[1]).toEqual('<string_variable>');
    expect(result[2]).toEqual('T8');
    expect(result[3]).toEqual('<str_exp_end>');

    result = this.parser.parse('$X0');
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual('<string_expression>');
    expect(result[1]).toEqual('<string_variable>');
    expect(result[2]).toEqual('X0');
    expect(result[3]).toEqual('<str_exp_end>');

    result = this.parser.parse('"HUMMINGBIRD"');
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual('<string_expression>');
    expect(result[1]).toEqual('<string_literal>');
    expect(result[2]).toEqual('HUMMINGBIRD');
    expect(result[3]).toEqual('<str_exp_end>');

    result = this.parser.parse('"ABCDEFGHIJKLMNOPQRSTUVWXYZ"');
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual('<string_expression>');
    expect(result[1]).toEqual('<string_literal>');
    expect(result[2]).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    expect(result[3]).toEqual('<str_exp_end>');

    result = this.parser.parse('"LAST NAME: "+$N2');
    expect(result.length).toEqual(7);
    expect(result[0]).toEqual('<string_expression>');
    expect(result[1]).toEqual('<string_literal>');
    expect(result[2]).toEqual('LAST NAME: ');
    expect(result[3]).toEqual('<plus>');
    expect(result[4]).toEqual('<string_variable>');
    expect(result[5]).toEqual('N2');
    expect(result[6]).toEqual('<str_exp_end>');

    result = this.parser.parse('"FIRST NAME: "+$N0+";  LAST NAME: "+$N2');
    expect(result.length).toEqual(13);
    expect(result[0]).toEqual('<string_expression>');
    expect(result[1]).toEqual('<string_literal>');
    expect(result[2]).toEqual('FIRST NAME: ');
    expect(result[3]).toEqual('<plus>');
    expect(result[4]).toEqual('<string_variable>');
    expect(result[5]).toEqual('N0');
    expect(result[6]).toEqual('<plus>');
    expect(result[7]).toEqual('<string_literal>');
    expect(result[8]).toEqual(';  LAST NAME: ');
    expect(result[9]).toEqual('<plus>');
    expect(result[10]).toEqual('<string_variable>');
    expect(result[11]).toEqual('N2');
    expect(result[12]).toEqual('<str_exp_end>');

    result = this.parser.parse('$C2+" IS IN "+$D2');
    expect(result.length).toEqual(10);
    expect(result[0]).toEqual('<string_expression>');
    expect(result[1]).toEqual('<string_variable>');
    expect(result[2]).toEqual('C2');
    expect(result[3]).toEqual('<plus>');
    expect(result[4]).toEqual('<string_literal>');
    expect(result[5]).toEqual(' IS IN ');
    expect(result[6]).toEqual('<plus>');
    expect(result[7]).toEqual('<string_variable>');
    expect(result[8]).toEqual('D2');
    expect(result[9]).toEqual('<str_exp_end>');

  });

});
