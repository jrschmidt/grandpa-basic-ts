describe "Test Basic Program Line functions", ->

  beforeEach ->
    @line = new BasicProgramLine(10,'10 REM WELCOME TO GRANDPA BASIC 80') 


  describe "Test Basic program line object", ->

    it "should create a BasicProgramLine object", ->
      expect(@line).toBeDefined
      expect(@line).toEqual(jasmine.any(BasicProgramLine))
      expect(@line.ln_no).toEqual(10)
      expect(@line.text).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')
      expect(@line.tokens).toEqual(jasmine.any(Array))


    xit "should create a ProgramLineParseObject", ->
      expect(@line.parse_object).toEqual(jasmine.any(ProgramLineParseObject))



