describe "Numeric expression object", ->

  it "should create a NumericExpression object", ->

    nxp = new NumericExpression( ["<numeric_literal>", 3] )
    expect(nxp).toEqual(jasmine.any(NumericExpression))


