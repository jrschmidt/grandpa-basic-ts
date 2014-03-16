describe "Test string expression parser", ->

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


  xit "should parse properly formed strings into string variables or literals", ->

    result = @parser.string_value('')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<string_variable>")
    expect(result[1]).toEqual(0)

    result = @parser.string_value('')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<string_literal>")
    expect(result[1]).toEqual(0)

    result = @parser.string_value('')
    expect(result).toEqual(jasmine.any(Array))
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("bad")
    expect(result[1]).toEqual("bad")


  xit "should return a 'not a string expression' token for any string that won't parse into a string expression", ->

    result = @parser.string_parse('')
    expect(result).toEqual("<not_a_string_expression>")



  xit "should parse any properly formed string expression", ->

    po = @parser.string_parse('')
    expect(po).toEqual(jasmine.any(Array))
    expect(po[0]).toEqual("<string_variable>")
    expect(po[1]).toEqual("")





