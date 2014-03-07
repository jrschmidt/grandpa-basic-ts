describe "Test Basic program object functions", ->

  beforeEach ->
    @console = new BasicProgram


  describe "TestBasic program object", ->

    it "should create a BasicProgram object", ->
      expect(@console).toBeDefined
      expect(@console).toEqual(jasmine.any(BasicProgram))


  xdescribe "Test console line fetch", ->

    it "should fetch lines from console", ->
      @console.lines.push( {"ln_no" : 10, "text" : '10 REM WELCOME TO GRANDPA BASIC 80'} )
      @console.lines.push( {"ln_no" : 20, "text" : '20 $T = "JOHN R SCHMIDT"'} )
      @console.lines.push( {"ln_no" : 30, "text" : '30 INPUT "DISPLAY NAME (Y/N)?";$Y'} )
      @console.lines.push( {"ln_no" : 40, "text" : '40 IF $Y<>"Y" THEN 100'} )
      @console.lines.push( {"ln_no" : 50, "text" : '50 PRINT "WRITTEN BY "+$T'} )
      @console.lines.push( {"ln_no" : 100, "text" : '100 PRINT "OK BYE"'} )
      @console.lines.push( {"ln_no" : 999, "text" : '999 END'} )

      expect(@console.fetch(0).text).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')
      expect(@console.fetch(17)).toEqual( {} )

    it "should add lines to console", ->
      @console.addline('10 REM WELCOME TO GRANDPA BASIC 80')
      @console.addline('20 $T = "JOHN R SCHMIDT"')
      @console.addline('30 INPUT "DISPLAY NAME (Y/N)?";$Y')
      @console.addline('40 IF $Y<>"Y" THEN 100')
      @console.addline('50 PRINT "WRITTEN BY "+$T')
      @console.addline('100 PRINT "OK BYE"')
      @console.addline('999 END')

      expect(@console.fetch(0)).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')
      expect(@console.fetch(1)).toEqual('20 $T = "JOHN R SCHMIDT"')
      expect(@console.fetch(2)).toEqual('30 INPUT "DISPLAY NAME (Y/N)?";$Y')
      expect(@console.fetch(3)).toEqual('40 IF $Y<>"Y" THEN 100')
      expect(@console.fetch(4)).toEqual('50 PRINT "WRITTEN BY "+$T')
      expect(@console.fetch(5)).toEqual('100 PRINT "OK BYE"')
      expect(@console.fetch(6)).toEqual('999 END')


  xdescribe "Test console line buffer object", ->

    beforeEach ->
      @buffer = @console.line_buffer

    it "should create a LineBuffer object", ->
      expect(@buffer).toBeDefined
      expect(@buffer).toEqual(jasmine.any(LineBuffer))
      expect(@buffer.get_text()).toEqual("")


    it "should fetch the line buffer text", ->
      @buffer.text = '10 REM WELCOME TO GRANDPA BASIC 80'
      expect(@buffer.get_text()).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')


    it "should set the line buffer text", ->
      @buffer.set_text('10 REM WELCOME TO GRANDPA BASIC 80')
      expect(@buffer.get_text()).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')


    it "should load text from the console object into the line buffer object", ->
      @console.addline('10 REM WELCOME TO GRANDPA BASIC 80')
      @console.load_line_buffer(0)
      expect(@buffer.get_text()).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')
      @console.load_line_buffer(7)
      expect(@buffer.get_text()).toEqual("")




