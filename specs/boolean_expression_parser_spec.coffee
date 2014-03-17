describe "Test boolean expression parser", ->

  beforeEach ->
    @parser = new BooleanExpressionParser


  it "should create a BooleanExpressionParser object", ->
    expect(@parser).toBeDefined
    expect(@parser).toEqual(jasmine.any(BooleanExpressionParser))


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


  xit "should return a 'not a boolean expression' token for any string that won't parse into a boolean expression", ->

    result = @parser.boolean_parse('')
    expect(result).toEqual("<not_a_boolean_expression>")


  xit "should parse any properly formed boolean expression", ->

    po = @parser.boolean_parse('')
    expect(po).toEqual(jasmine.any(Array))
    expect(po[0]).toEqual("")
    expect(po[1]).toEqual("")
    expect(po[2]).toEqual("")
    expect(po[3]).toEqual("")
    expect(po[4]).toEqual("")


