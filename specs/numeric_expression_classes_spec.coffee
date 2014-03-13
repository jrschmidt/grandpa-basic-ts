describe "Test numeric expression classes", ->


  describe "Test NumericExpression superclass", ->

    beforeEach ->
      @num_exp = new NumericExpression

    it "should create a NumericExpression object", ->
      expect(@num_exp).toBeDefined
      expect(@num_exp).toEqual(jasmine.any(NumericExpression))
      expect(@num_exp.type).toEqual(null)


  describe "Test Scalar class", ->

    beforeEach ->
      @scalar = new Scalar    

    it "should create a Scalar object", ->
      expect(@scalar).toBeDefined
      expect(@scalar).toEqual(jasmine.any(Scalar))
      expect(@scalar.type).toEqual("<scalar>")


