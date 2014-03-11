describe "Test numeric expression parser", ->

  beforeEach ->
    @parser = new NumericExpressionParser


  describe "Test numeric expression parser", ->

    it "should create a NumericExpressionParser object", ->
      expect(@parser).toBeDefined
      expect(@parser).toEqual(jasmine.any(NumericExpressionParser))


