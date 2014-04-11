describe "Numeric variable register", ->

  it "should register a new variable", ->

    num_vars = new NumericVariableRegister

    num_vars.add_var("X")
    expect(num_vars.defined("X")).toEqual("yes")

    num_vars.add_var("A3")
    expect(num_vars.defined("A3")).toEqual("yes")

    num_vars.add_var("H")
    expect(num_vars.defined("H")).toEqual("yes")

    num_vars.add_var("K0")
    expect(num_vars.defined("K0")).toEqual("yes")

    num_vars.add_var("V9")
    expect(num_vars.defined("V9")).toEqual("yes")

    expect(num_vars.defined("Y")).toEqual("no")
    expect(num_vars.defined("M2")).toEqual("no")
    expect(num_vars.defined("P3")).toEqual("no")
    expect(num_vars.defined("Q")).toEqual("no")
    expect(num_vars.defined("A4")).toEqual("no")


  it "should set and get the value for a variable", ->

    num_vars = new NumericVariableRegister

    num_vars.set("J",17)
    num_vars.set("P0",918.64428)
    num_vars.set("M",2)

    expect(num_vars.get("J")).toEqual(17)
    expect(num_vars.get("P0")).toEqual(918.64428)
    expect(num_vars.get("M")).toEqual(2)

    # (Uninitialized numeric variables return 0 in original BASIC implementations)
    expect(num_vars.get("L")).toEqual(0)
    expect(num_vars.get("Z4")).toEqual(0)




