describe "Numeric expression parser", ->

  beforeEach ->
    @parser = new NumericExpressionParser


  it "should create a NumericExpressionParser object", ->
    expect(@parser).toBeDefined
    expect(@parser).toEqual(jasmine.any(NumericExpressionParser))


  it "should split string at delimiters and tokenize the delimiters", ->

    str = "X"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("X")

    str = "42"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("42")

    str = "13.477"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("13.477")

    str = "12/3"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("12")
    expect(tokens[1]).toEqual("<divide>")
    expect(tokens[2]).toEqual("3")

    str = "477+B"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("477")
    expect(tokens[1]).toEqual("<plus>")
    expect(tokens[2]).toEqual("B")

    str = "C^2"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("C")
    expect(tokens[1]).toEqual("<power>")
    expect(tokens[2]).toEqual("2")

    str = "X*Y*Z"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("X")
    expect(tokens[1]).toEqual("<times>")
    expect(tokens[2]).toEqual("Y")
    expect(tokens[3]).toEqual("<times>")
    expect(tokens[4]).toEqual("Z")

    str = "28*(J+2)"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("28")
    expect(tokens[1]).toEqual("<times>")
    expect(tokens[2]).toEqual("<left>")
    expect(tokens[3]).toEqual("J")
    expect(tokens[4]).toEqual("<plus>")
    expect(tokens[5]).toEqual("2")
    expect(tokens[6]).toEqual("<right>")

    str = "W5+W7-4*(J^2+K^3)"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("W5")
    expect(tokens[1]).toEqual("<plus>")
    expect(tokens[2]).toEqual("W7")
    expect(tokens[3]).toEqual("<minus>")
    expect(tokens[4]).toEqual("4")
    expect(tokens[5]).toEqual("<times>")
    expect(tokens[6]).toEqual("<left>")
    expect(tokens[7]).toEqual("J")
    expect(tokens[8]).toEqual("<power>")
    expect(tokens[9]).toEqual("2")
    expect(tokens[10]).toEqual("<plus>")
    expect(tokens[11]).toEqual("K")
    expect(tokens[12]).toEqual("<power>")
    expect(tokens[13]).toEqual("3")
    expect(tokens[14]).toEqual("<right>")

    str = "(18-Q7)/(2.108*(14*M+17*X))"
    tokens = @parser.tokenize(str)
    expect(tokens).toEqual(jasmine.any(Array))
    expect(tokens[0]).toEqual("<left>")
    expect(tokens[1]).toEqual("18")
    expect(tokens[2]).toEqual("<minus>")
    expect(tokens[3]).toEqual("Q7")
    expect(tokens[4]).toEqual("<right>")
    expect(tokens[5]).toEqual("<divide>")
    expect(tokens[6]).toEqual("<left>")
    expect(tokens[7]).toEqual("2.108")
    expect(tokens[8]).toEqual("<times>")
    expect(tokens[9]).toEqual("<left>")
    expect(tokens[10]).toEqual("14")
    expect(tokens[11]).toEqual("<times>")
    expect(tokens[12]).toEqual("M")
    expect(tokens[13]).toEqual("<plus>")
    expect(tokens[14]).toEqual("17")
    expect(tokens[15]).toEqual("<times>")
    expect(tokens[16]).toEqual("X")
    expect(tokens[17]).toEqual("<right>")
    expect(tokens[18]).toEqual("<right>")


  it "should parse properly formed strings into numeric variables or literals", ->

    result = @parser.numeric_value("0")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<numeric_literal>")
    expect(result[1]).toEqual(0)

    result = @parser.numeric_value("6")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<numeric_literal>")
    expect(result[1]).toEqual(6)

    result = @parser.numeric_value("967")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<numeric_literal>")
    expect(result[1]).toEqual(967)

    result = @parser.numeric_value("428.17")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<numeric_literal>")
    expect(result[1]).toEqual(428.17)

    result = @parser.numeric_value("X")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<number_variable>")
    expect(result[1]).toEqual("X")

    result = @parser.numeric_value("K7")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<number_variable>")
    expect(result[1]).toEqual("K7")

    result = @parser.numeric_value("1,420,366")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("bad")
    expect(result[1]).toEqual("bad")

    result = @parser.numeric_value("$10")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("bad")
    expect(result[1]).toEqual("bad")

    result = @parser.numeric_value("18 737")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("bad")
    expect(result[1]).toEqual("bad")

    result = @parser.numeric_value("PI")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("bad")
    expect(result[1]).toEqual("bad")

    result = @parser.numeric_value("67.40.11")
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("bad")
    expect(result[1]).toEqual("bad")


  it "should return 'no match' for any string that won't parse into a numeric expression", ->

    result = @parser.numeric_parse('"33-7"')
    expect(result.match).toEqual("no")

    result = @parser.numeric_parse('617.42.9')
    expect(result.match).toEqual("no")

    result = @parser.numeric_parse('180-45DEGREES')
    expect(result.match).toEqual("no")

    result = @parser.numeric_parse('"NOTHING PARSEABLE AS A NUMERIC EXPRESSION"')
    expect(result.match).toEqual("no")

    result = @parser.numeric_parse('2*PI')
    expect(result.match).toEqual("no")

    result = @parser.numeric_parse('22,348,507')
    expect(result.match).toEqual("no")

    result = @parser.numeric_parse('45507')
    expect(result.match).not.toEqual("no")

    result = @parser.numeric_parse('102.54')
    expect(result.match).not.toEqual("no")

    result = @parser.numeric_parse('800/37')
    expect(result.match).not.toEqual("no")

    result = @parser.numeric_parse('(66*A)-Z^4')
    expect(result.match).not.toEqual("no")


  it "should parse any properly formed numeric expression", ->

    result = @parser.numeric_parse("X")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("X")
    expect(po[3]).toEqual("<num_exp_end>")

    result = @parser.numeric_parse("42")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<numeric_literal>")
    expect(po[2]).toEqual(42)
    expect(po[3]).toEqual("<num_exp_end>")

    result = @parser.numeric_parse("13.477")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<numeric_literal>")
    expect(po[2]).toEqual(13.477)
    expect(po[3]).toEqual("<num_exp_end>")

    result = @parser.numeric_parse("12/3")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<numeric_literal>")
    expect(po[2]).toEqual(12)
    expect(po[3]).toEqual("<divide>")
    expect(po[4]).toEqual("<numeric_literal>")
    expect(po[5]).toEqual(3)
    expect(po[6]).toEqual("<num_exp_end>")

    result = @parser.numeric_parse("477+B")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<numeric_literal>")
    expect(po[2]).toEqual(477)
    expect(po[3]).toEqual("<plus>")
    expect(po[4]).toEqual("<number_variable>")
    expect(po[5]).toEqual("B")
    expect(po[6]).toEqual("<num_exp_end>")

    result = @parser.numeric_parse("C^2")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("C")
    expect(po[3]).toEqual("<power>")
    expect(po[4]).toEqual("<numeric_literal>")
    expect(po[5]).toEqual(2)
    expect(po[6]).toEqual("<num_exp_end>")

    result = @parser.numeric_parse("X*Y*Z")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("X")
    expect(po[3]).toEqual("<times>")
    expect(po[4]).toEqual("<number_variable>")
    expect(po[5]).toEqual("Y")
    expect(po[6]).toEqual("<times>")
    expect(po[7]).toEqual("<number_variable>")
    expect(po[8]).toEqual("Z")
    expect(po[9]).toEqual("<num_exp_end>")

    result = @parser.numeric_parse("28*(J+2)")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<numeric_literal>")
    expect(po[2]).toEqual(28)
    expect(po[3]).toEqual("<times>")
    expect(po[4]).toEqual("<left>")
    expect(po[5]).toEqual("<number_variable>")
    expect(po[6]).toEqual("J")
    expect(po[7]).toEqual("<plus>")
    expect(po[8]).toEqual("<numeric_literal>")
    expect(po[9]).toEqual(2)
    expect(po[10]).toEqual("<right>")
    expect(po[11]).toEqual("<num_exp_end>")

    result = @parser.numeric_parse("W5+W7-4*(J^2+K^3)")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<number_variable>")
    expect(po[2]).toEqual("W5")
    expect(po[3]).toEqual("<plus>")
    expect(po[4]).toEqual("<number_variable>")
    expect(po[5]).toEqual("W7")
    expect(po[6]).toEqual("<minus>")
    expect(po[7]).toEqual("<numeric_literal>")
    expect(po[8]).toEqual(4)
    expect(po[9]).toEqual("<times>")
    expect(po[10]).toEqual("<left>")
    expect(po[11]).toEqual("<number_variable>")
    expect(po[12]).toEqual("J")
    expect(po[13]).toEqual("<power>")
    expect(po[14]).toEqual("<numeric_literal>")
    expect(po[15]).toEqual(2)
    expect(po[16]).toEqual("<plus>")
    expect(po[17]).toEqual("<number_variable>")
    expect(po[18]).toEqual("K")
    expect(po[19]).toEqual("<power>")
    expect(po[20]).toEqual("<numeric_literal>")
    expect(po[21]).toEqual(3)
    expect(po[22]).toEqual("<right>")
    expect(po[23]).toEqual("<num_exp_end>")

    result = @parser.numeric_parse("(18-Q7)/(2.108*(14*M+17*X))")
    expect(result.match).toEqual("yes")
    po = result.parse_object
    expect(po[0]).toEqual("<numeric_expression>")
    expect(po[1]).toEqual("<left>")
    expect(po[2]).toEqual("<numeric_literal>")
    expect(po[3]).toEqual(18)
    expect(po[4]).toEqual("<minus>")
    expect(po[5]).toEqual("<number_variable>")
    expect(po[6]).toEqual("Q7")
    expect(po[7]).toEqual("<right>")
    expect(po[8]).toEqual("<divide>")
    expect(po[9]).toEqual("<left>")
    expect(po[10]).toEqual("<numeric_literal>")
    expect(po[11]).toEqual(2.108)
    expect(po[12]).toEqual("<times>")
    expect(po[13]).toEqual("<left>")
    expect(po[14]).toEqual("<numeric_literal>")
    expect(po[15]).toEqual(14)
    expect(po[16]).toEqual("<times>")
    expect(po[17]).toEqual("<number_variable>")
    expect(po[18]).toEqual("M")
    expect(po[19]).toEqual("<plus>")
    expect(po[20]).toEqual("<numeric_literal>")
    expect(po[21]).toEqual(17)
    expect(po[22]).toEqual("<times>")
    expect(po[23]).toEqual("<number_variable>")
    expect(po[24]).toEqual("X")
    expect(po[25]).toEqual("<right>")
    expect(po[26]).toEqual("<right>")
    expect(po[27]).toEqual("<num_exp_end>")



