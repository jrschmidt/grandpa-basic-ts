describe "Test Syntax Rules", ->

  beforeEach ->
    @parser = new SyntaxRules


  it "should create a SyntaxRules object", ->
    expect(@parser).toEqual(jasmine.any(SyntaxRules))

