describe "Test BASIC program line functions", ->

  beforeEach ->
    @line = new BasicProgramLine(10,'10 REM WELCOME TO GRANDPA BASIC 80') 


  it "should create a BasicProgramLine object", ->
    expect(@line).toBeDefined
    expect(@line).toEqual(jasmine.any(BasicProgramLine))
    expect(@line.ln_no).toEqual(10)
    expect(@line.text).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')
    expect(@line.tokens).toEqual(jasmine.any(Array))


