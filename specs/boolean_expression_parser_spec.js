// Generated by CoffeeScript 1.7.1
describe("Test boolean expression parser", function() {
  beforeEach(function() {
    this.helpers = new ParseHelpers;
    return this.parser = this.helpers.bool_exp_parser;
  });
  it("should create a BooleanExpressionParser object", function() {
    expect(this.parser).toBeDefined;
    return expect(this.parser).toEqual(jasmine.any(BooleanExpressionParser));
  });
  it("should split and tokenize a boolean expression string", function() {
    var str, tokens;
    str = '$Y="Y"';
    tokens = this.parser.split(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens[0]).toEqual("$Y");
    expect(tokens[1]).toEqual("<equals>");
    expect(tokens[2]).toEqual('"Y"');
    str = 'N>0';
    tokens = this.parser.split(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens[0]).toEqual("N");
    expect(tokens[1]).toEqual("<greater_than>");
    expect(tokens[2]).toEqual("0");
    str = 'I3<20';
    tokens = this.parser.split(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens[0]).toEqual("I3");
    expect(tokens[1]).toEqual("<lesser_than>");
    expect(tokens[2]).toEqual("20");
    str = 'Z=A';
    tokens = this.parser.split(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens[0]).toEqual("Z");
    expect(tokens[1]).toEqual("<equals>");
    expect(tokens[2]).toEqual("A");
    str = 'Q1<>Q2';
    tokens = this.parser.split(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens[0]).toEqual("Q1");
    expect(tokens[1]).toEqual("<not_equal>");
    expect(tokens[2]).toEqual("Q2");
    str = 'T<=30';
    tokens = this.parser.split(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens[0]).toEqual("T");
    expect(tokens[1]).toEqual("<lesser_equal>");
    expect(tokens[2]).toEqual("30");
    str = 'H>=H0';
    tokens = this.parser.split(str);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens[0]).toEqual("H");
    expect(tokens[1]).toEqual("<greater_equal>");
    return expect(tokens[2]).toEqual("H0");
  });
  it("should return 'no match' for any string that won't parse into a boolean expression", function() {
    var result;
    result = this.parser.boolean_parse('"FOURTEEN THOUSAND"');
    expect(result.match).toEqual("no");
    result = this.parser.boolean_parse('$Z9');
    expect(result.match).toEqual("no");
    result = this.parser.boolean_parse('(67-X)/(31*Y)');
    return expect(result.match).toEqual("no");
  });
  return it("should parse any properly formed boolean expression", function() {
    var po, result;
    result = this.parser.boolean_parse('$Y="Y"');
    expect(result.match).toEqual("yes");
    po = result.parse_object;
    expect(po[0]).toEqual("<string_variable>");
    expect(po[1]).toEqual("Y");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<string_literal>");
    expect(po[4]).toEqual("Y");
    result = this.parser.boolean_parse('N>0');
    expect(result.match).toEqual("yes");
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("N");
    expect(po[2]).toEqual("<greater_than>");
    expect(po[3]).toEqual("<numeric_literal>");
    expect(po[4]).toEqual(0);
    result = this.parser.boolean_parse('I3<20');
    expect(result.match).toEqual("yes");
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("I3");
    expect(po[2]).toEqual("<lesser_than>");
    expect(po[3]).toEqual("<numeric_literal>");
    expect(po[4]).toEqual(20);
    result = this.parser.boolean_parse('Z=A');
    expect(result.match).toEqual("yes");
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("Z");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<number_variable>");
    expect(po[4]).toEqual("A");
    result = this.parser.boolean_parse('Q1<>Q2');
    expect(result.match).toEqual("yes");
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("Q1");
    expect(po[2]).toEqual("<not_equal>");
    expect(po[3]).toEqual("<number_variable>");
    expect(po[4]).toEqual("Q2");
    result = this.parser.boolean_parse('T<=30');
    expect(result.match).toEqual("yes");
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("T");
    expect(po[2]).toEqual("<lesser_equal>");
    expect(po[3]).toEqual("<numeric_literal>");
    expect(po[4]).toEqual(30);
    result = this.parser.boolean_parse('H>=H0');
    expect(result.match).toEqual("yes");
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("H");
    expect(po[2]).toEqual("<greater_equal>");
    expect(po[3]).toEqual("<number_variable>");
    return expect(po[4]).toEqual("H0");
  });
});
