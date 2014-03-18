describe "Test syntax rules", ->

  beforeEach ->
    @parser = new SyntaxRules


  it "should create a SyntaxRules object", ->
    expect(@parser).toEqual(jasmine.any(SyntaxRules))

