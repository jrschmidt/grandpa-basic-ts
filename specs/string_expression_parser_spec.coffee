describe "String expression parser", ->

  beforeEach ->
    @parser = new StringExpressionParser


  it "should create a StringExpressionParser object", ->
    expect(@parser).toBeDefined
    expect(@parser).toEqual(jasmine.any(StringExpressionParser))


  it "should split string at delimiters and tokenize the delimiters", ->

    str = '$A'
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual('$A')

    str = '$R0'
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual('$R0')

    str = '"HELLO, IM JOHNNY CASH"'
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual('"HELLO, IM JOHNNY CASH"')

    str = '$Q5+$Q6+$Q7'
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual('$Q5')
    expect(tokens[1]).toEqual("<plus>")
    expect(tokens[2]).toEqual('$Q6')
    expect(tokens[3]).toEqual("<plus>")
    expect(tokens[4]).toEqual('$Q7')

    str = '$W+" IS THE WINNER!"'
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual('$W')
    expect(tokens[1]).toEqual("<plus>")
    expect(tokens[2]).toEqual('" IS THE WINNER!"')

    str = '"MY NAME IS "+$N'
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual('"MY NAME IS "')
    expect(tokens[1]).toEqual("<plus>")
    expect(tokens[2]).toEqual('$N')


  it "should parse properly formed strings into string variables or literals", ->

    result = @parser.string_value('$T')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<string_variable>")
    expect(result[1]).toEqual("T")

    result = @parser.string_value('$Z8')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<string_variable>")
    expect(result[1]).toEqual("Z8")

    result = @parser.string_value('$K0')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<string_variable>")
    expect(result[1]).toEqual("K0")

    result = @parser.string_value('"BANANA"')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<string_literal>")
    expect(result[1]).toEqual("BANANA")

    result = @parser.string_value('"27 BANANAS AND A LEMON"')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<string_literal>")
    expect(result[1]).toEqual("27 BANANAS AND A LEMON")

    result = @parser.string_value('"ALMOST ANY CHARACTERS ..."')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<string_literal>")
    expect(result[1]).toEqual("ALMOST ANY CHARACTERS ...")

    result = @parser.string_value('MISSING QUOTE MARKS')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("bad")
    expect(result[1]).toEqual("bad")

    result = @parser.string_value('440-(3*X+5*Y)')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("bad")
    expect(result[1]).toEqual("bad")

    result = @parser.string_value('260 $E="TOKEN"')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("bad")
    expect(result[1]).toEqual("bad")


  it "should return a 'not a string expression' token for any string that won't parse into a string expression", ->

    result = @parser.string_value_parse('MISSING QUOTE MARKS')
    expect(result.match).toEqual("no")

    result = @parser.string_value_parse('440-(3*X+5*Y)')
    expect(result.match).toEqual("no")

    result = @parser.string_value_parse('260 $E="TOKEN"')
    expect(result.match).toEqual("no")


  it "should parse any properly formed string expression", ->
    # FIXME What about plus signs ("+") inside a string literal?

    result = @parser.string_value_parse('$R')
    po = result.parse_object
    expect(po[0]).toEqual("<string_expression>")
    expect(po[1]).toEqual("<string_variable>")
    expect(po[2]).toEqual("R")
    expect(po[3]).toEqual("<str_exp_end>")

    result = @parser.string_value_parse('$T8')
    po = result.parse_object
    expect(po[0]).toEqual("<string_expression>")
    expect(po[1]).toEqual("<string_variable>")
    expect(po[2]).toEqual("T8")
    expect(po[3]).toEqual("<str_exp_end>")

    result = @parser.string_value_parse('$X0')
    po = result.parse_object
    expect(po[0]).toEqual("<string_expression>")
    expect(po[1]).toEqual("<string_variable>")
    expect(po[2]).toEqual("X0")
    expect(po[3]).toEqual("<str_exp_end>")

    result = @parser.string_value_parse('"HUMMINGBIRD"')
    po = result.parse_object
    expect(po[0]).toEqual("<string_expression>")
    expect(po[1]).toEqual("<string_literal>")
    expect(po[2]).toEqual("HUMMINGBIRD")
    expect(po[3]).toEqual("<str_exp_end>")

    result = @parser.string_value_parse('"ABCDEFGHIJKLMNOPQRSTUVWXYZ"')
    po = result.parse_object
    expect(po[0]).toEqual("<string_expression>")
    expect(po[1]).toEqual("<string_literal>")
    expect(po[2]).toEqual("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    expect(po[3]).toEqual("<str_exp_end>")

    result = @parser.string_value_parse('"LAST NAME: "+$N2')
    po = result.parse_object
    expect(po[0]).toEqual("<string_expression>")
    expect(po[1]).toEqual("<string_literal>")
    expect(po[2]).toEqual("LAST NAME: ")
    expect(po[3]).toEqual("<plus>")
    expect(po[4]).toEqual("<string_variable>")
    expect(po[5]).toEqual("N2")
    expect(po[6]).toEqual("<str_exp_end>")

    result = @parser.string_value_parse('"FIRST NAME: "+$N0+";  LAST NAME: "+$N2')
    po = result.parse_object
    expect(po[0]).toEqual("<string_expression>")
    expect(po[1]).toEqual("<string_literal>")
    expect(po[2]).toEqual("FIRST NAME: ")
    expect(po[3]).toEqual("<plus>")
    expect(po[4]).toEqual("<string_variable>")
    expect(po[5]).toEqual("N0")
    expect(po[6]).toEqual("<plus>")
    expect(po[7]).toEqual("<string_literal>")
    expect(po[8]).toEqual(";  LAST NAME: ")
    expect(po[9]).toEqual("<plus>")
    expect(po[10]).toEqual("<string_variable>")
    expect(po[11]).toEqual("N2")
    expect(po[12]).toEqual("<str_exp_end>")

    result = @parser.string_value_parse('$C2+" IS IN "+$D2')
    po = result.parse_object
    expect(po[0]).toEqual("<string_expression>")
    expect(po[1]).toEqual("<string_variable>")
    expect(po[2]).toEqual("C2")
    expect(po[3]).toEqual("<plus>")
    expect(po[4]).toEqual("<string_literal>")
    expect(po[5]).toEqual(" IS IN ")
    expect(po[6]).toEqual("<plus>")
    expect(po[7]).toEqual("<string_variable>")
    expect(po[8]).toEqual("D2")
    expect(po[9]).toEqual("<str_exp_end>")



