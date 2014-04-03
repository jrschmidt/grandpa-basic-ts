describe "Numeric expression evaluator", ->

  it "should create a NumericExpressionEvaluator object", ->

    nmx_eval = new NumericExpressionEvaluator
    expect(nmx_eval).toEqual(jasmine.any(NumericExpressionEvaluator))



