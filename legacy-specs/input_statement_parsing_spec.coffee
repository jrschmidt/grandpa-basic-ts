describe "Input statement parsing", ->

  beforeEach ->
    @parser = new LineParser


  it "should correctly parse a no-prompt numeric input statement", ->

    result = @parser.look_for_input_parameters("R")
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("R")

    result = @parser.look_for_input_parameters("Z")
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("Z")

    result = @parser.look_for_input_parameters("V7")
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("V7")


  it "should correctly parse a no-prompt string input statement", ->

    result = @parser.look_for_input_parameters("$V")
    po = result.parse_object
    expect(po[0]).toEqual("<string_variable>")
    expect(po[1]).toEqual("V")

    result = @parser.look_for_input_parameters("$L")
    po = result.parse_object
    expect(po[0]).toEqual("<string_variable>")
    expect(po[1]).toEqual("L")

    result = @parser.look_for_input_parameters("$G9")
    po = result.parse_object
    expect(po[0]).toEqual("<string_variable>")
    expect(po[1]).toEqual("G9")


  it "should correctly parse a numeric input statement with a prompt string", ->

    result = @parser.look_for_input_parameters('"HOW MANY?";M')
    po = result.parse_object
    expect(po[0]).toEqual("<string>")
    expect(po[1]).toEqual("HOW MANY?")
    expect(po[2]).toEqual("<semicolon>")
    expect(po[3]).toEqual("<number_variable>")
    expect(po[4]).toEqual("M")

    result = @parser.look_for_input_parameters('"INPUT X COORDINATE: ";Y')
    po = result.parse_object
    expect(po[0]).toEqual("<string>")
    expect(po[1]).toEqual("INPUT X COORDINATE: ")
    expect(po[2]).toEqual("<semicolon>")
    expect(po[3]).toEqual("<number_variable>")
    expect(po[4]).toEqual("Y")


  it "should correctly parse a string input statement with a prompt string", ->

    result = @parser.look_for_input_parameters('"LAST NAME?";$N2')
    po = result.parse_object
    expect(po[0]).toEqual("<string>")
    expect(po[1]).toEqual("LAST NAME?")
    expect(po[2]).toEqual("<semicolon>")
    expect(po[3]).toEqual("<string_variable>")
    expect(po[4]).toEqual("N2")

    result = @parser.look_for_input_parameters('"STREET ADDRESS: ";$A')
    po = result.parse_object
    expect(po[0]).toEqual("<string>")
    expect(po[1]).toEqual("STREET ADDRESS: ")
    expect(po[2]).toEqual("<semicolon>")
    expect(po[3]).toEqual("<string_variable>")
    expect(po[4]).toEqual("A")


