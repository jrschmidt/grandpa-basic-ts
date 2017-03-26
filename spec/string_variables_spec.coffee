describe "String variable register", ->

  it "should register a new variable", ->

    str_vars = new StringVariableRegister

    str_vars.add_var("Q")
    expect(str_vars.defined("Q")).toEqual("yes")

    str_vars.add_var("Z3")
    expect(str_vars.defined("Z3")).toEqual("yes")

    str_vars.add_var("F")
    expect(str_vars.defined("F")).toEqual("yes")

    str_vars.add_var("T0")
    expect(str_vars.defined("T0")).toEqual("yes")

    str_vars.add_var("W9")
    expect(str_vars.defined("W9")).toEqual("yes")

    expect(str_vars.defined("Y")).toEqual("no")
    expect(str_vars.defined("M2")).toEqual("no")
    expect(str_vars.defined("P3")).toEqual("no")
    expect(str_vars.defined("S")).toEqual("no")
    expect(str_vars.defined("A4")).toEqual("no")


  it "should set and get the value for a variable", ->

    str_vars = new StringVariableRegister

    str_vars.set("E", "ERROR!!")
    str_vars.set("R9", "PLEASE REPEAT YOUR ANSWER")
    str_vars.set("U4", "315 ELM ST")

    expect(str_vars.get("E")).toEqual("ERROR!!")
    expect(str_vars.get("R9")).toEqual("PLEASE REPEAT YOUR ANSWER")
    expect(str_vars.get("U4")).toEqual("315 ELM ST")

    # (Uninitialized String variables return "" (empty string) in original BASIC implementations)
    expect(str_vars.get("L2")).toEqual("")
    expect(str_vars.get("V4")).toEqual("")




