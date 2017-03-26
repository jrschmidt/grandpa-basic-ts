describe "String expression concatenator", ->

  beforeEach ->
    @str_vars = new StringVariableRegister
    hh = {str_vars: @str_vars}
    @str_concat = new StringExpressionConcatenator(hh)

  it "should evaluate a string literal", ->

    str = [ ["<str>", "HELLO"] ]

    value = @str_concat.val(str)
    expect(value).toEqual("HELLO")


    str = [ ["<str>", "THE SUM IS "] ]

    value = @str_concat.val(str)
    expect(value).toEqual("THE SUM IS ")


    str = [ ["<str>", "JAMES"] ]

    value = @str_concat.val(str)
    expect(value).toEqual("JAMES")


  it "should evaluate a reference to a string variable", ->

    str = [ ["<var>", "Q4"] ]

    @str_vars.set("Q4", "BRANCHES")
    value = @str_concat.val(str)
    expect(value).toEqual("BRANCHES")


    str = [ ["<var>", "D"] ]

    @str_vars.set("D", "FRIDAY")
    value = @str_concat.val(str)
    expect(value).toEqual("FRIDAY")


    str = [ ["<var>", "Y8"] ]

    @str_vars.set("Y8", "TURTLES AND RABBITS")
    value = @str_concat.val(str)
    expect(value).toEqual("TURTLES AND RABBITS")


  it "should evaluate a multi-part string expression", ->

    str = [ ["<var>", "Z"]
            ["<str>", "BYTES IN FILE"] ]

    @str_vars.set("Z", "NO ")
    value = @str_concat.val(str)
    expect(value).toEqual("NO BYTES IN FILE")


    str = [ ["<var>", "C1"]
            ["<str>", " WITH "]
            ["<var>", "C2"]
            ["<str>", " OR "]
            ["<var>", "C3"] ]

    @str_vars.set("C1", "POLYGONS")
    @str_vars.set("C2", "DOTS")
    @str_vars.set("C3", "TINY CIRCLES")
    value = @str_concat.val(str)
    expect(value).toEqual("POLYGONS WITH DOTS OR TINY CIRCLES")
