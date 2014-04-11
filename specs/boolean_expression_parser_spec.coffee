describe "Boolean expression parser", ->

  beforeEach ->
    @helpers = new ParseHelpers
    @parser = @helpers.bool_exp_parser


  it "should separate a boolean expression from the characters that follow it", ->

    result = @parser.strip_remainder("Z<0 THEN 340")
    expect(result.string).toEqual("Z<0")
    expect(result.remainder).toEqual(" THEN 340")

    result = @parser.strip_remainder('$T="INCOMPLETE" THEN 1680')
    expect(result.string).toEqual('$T="INCOMPLETE"')
    expect(result.remainder).toEqual(" THEN 1680")

    result = @parser.strip_remainder("A>B THEN 750")
    expect(result.string).toEqual("A>B")
    expect(result.remainder).toEqual(" THEN 750")

    result = @parser.strip_remainder("N>=1000 THEN 930")
    expect(result.string).toEqual("N>=1000")
    expect(result.remainder).toEqual(" THEN 930")


  it "should split and tokenize a boolean expression string", ->

    str = '$Y="Y"'
    tokens = @parser.split(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("$Y")
    expect(tokens[1]).toEqual("<equals>")
    expect(tokens[2]).toEqual('"Y"')

    str = 'N>0'
    tokens = @parser.split(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("N")
    expect(tokens[1]).toEqual("<greater_than>")
    expect(tokens[2]).toEqual("0")

    str = 'I3<20'
    tokens = @parser.split(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("I3")
    expect(tokens[1]).toEqual("<lesser_than>")
    expect(tokens[2]).toEqual("20")

    str = 'Z=A'
    tokens = @parser.split(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("Z")
    expect(tokens[1]).toEqual("<equals>")
    expect(tokens[2]).toEqual("A")

    str = 'Q1<>Q2'
    tokens = @parser.split(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("Q1")
    expect(tokens[1]).toEqual("<not_equal>")
    expect(tokens[2]).toEqual("Q2")

    str = 'T<=30'
    tokens = @parser.split(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("T")
    expect(tokens[1]).toEqual("<lesser_equal>")
    expect(tokens[2]).toEqual("30")

    str = 'H>=H0'
    tokens = @parser.split(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("H")
    expect(tokens[1]).toEqual("<greater_equal>")
    expect(tokens[2]).toEqual("H0")


  it "should return 'no match' for any string that won't parse into a boolean expression", ->

    result = @parser.boolean_parse('"FOURTEEN THOUSAND"')
    expect(result.match).toEqual("no")

    result = @parser.boolean_parse('$Z9')
    expect(result.match).toEqual("no")

    result = @parser.boolean_parse('(67-X)/(31*Y)')
    expect(result.match).toEqual("no")


  it "should parse any properly formed boolean expression", ->

    result = @parser.boolean_parse('$Y="Y"')
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<boolean_expression>")
    expect(po[1]).toEqual("<string_variable>")
    expect(po[2]).toEqual("Y")
    expect(po[3]).toEqual("<equals>")
    expect(po[4]).toEqual("<string_expression>")
    expect(po[5]).toEqual("<string_literal>")
    expect(po[6]).toEqual("Y")
    expect(po[7]).toEqual("<str_exp_end>")
    expect(po[8]).toEqual("<bool_exp_end>")

    result = @parser.boolean_parse('N>0')
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<boolean_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("N")
    expect(po[3]).toEqual("<greater_than>")
    expect(po[4]).toEqual("<numeric_expression>")
    expect(po[5]).toEqual("<numeric_literal>")
    expect(po[6]).toEqual(0)
    expect(po[7]).toEqual("<num_exp_end>")
    expect(po[8]).toEqual("<bool_exp_end>")

    result = @parser.boolean_parse('I3<20')
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<boolean_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("I3")
    expect(po[3]).toEqual("<lesser_than>")
    expect(po[4]).toEqual("<numeric_expression>")
    expect(po[5]).toEqual("<numeric_literal>")
    expect(po[6]).toEqual(20)
    expect(po[7]).toEqual("<num_exp_end>")
    expect(po[8]).toEqual("<bool_exp_end>")

    result = @parser.boolean_parse('Z=A')
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<boolean_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("Z")
    expect(po[3]).toEqual("<equals>")
    expect(po[4]).toEqual("<numeric_expression>")
    expect(po[5]).toEqual("<number_variable>")
    expect(po[6]).toEqual("A")
    expect(po[7]).toEqual("<num_exp_end>")
    expect(po[8]).toEqual("<bool_exp_end>")

    result = @parser.boolean_parse('Q1<>Q2')
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<boolean_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("Q1")
    expect(po[3]).toEqual("<not_equal>")
    expect(po[4]).toEqual("<numeric_expression>")
    expect(po[5]).toEqual("<number_variable>")
    expect(po[6]).toEqual("Q2")
    expect(po[7]).toEqual("<num_exp_end>")
    expect(po[8]).toEqual("<bool_exp_end>")

    result = @parser.boolean_parse('T<=30')
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<boolean_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("T")
    expect(po[3]).toEqual("<lesser_equal>")
    expect(po[4]).toEqual("<numeric_expression>")
    expect(po[5]).toEqual("<numeric_literal>")
    expect(po[6]).toEqual(30)
    expect(po[7]).toEqual("<num_exp_end>")
    expect(po[8]).toEqual("<bool_exp_end>")

    result = @parser.boolean_parse('H>=H0')
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<boolean_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("H")
    expect(po[3]).toEqual("<greater_equal>")
    expect(po[4]).toEqual("<numeric_expression>")
    expect(po[5]).toEqual("<number_variable>")
    expect(po[6]).toEqual("H0")
    expect(po[7]).toEqual("<num_exp_end>")
    expect(po[8]).toEqual("<bool_exp_end>")


