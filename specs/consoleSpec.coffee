describe "Test GB80 Console functions", ->

  beforeEach ->
    @console = new Gb80Console

    @clean_console = { "status" : "clean", "lines" : [] }


  describe "Test console object", ->

    it "should create a Gb80Console object", ->
      expect(@console).toBeDefined
      expect(@console).toEqual(jasmine.any(Gb80Console))
      expect(@console.status).toEqual("clean")
      expect(@console.lines).toEqual([])


  describe "Test console line fetch", ->

    it "should fetch lines from console", ->
      @console.lines.push('10 REM WELCOME TO GRANDPA BASIC 80')
      expect(@console.fetch(0)).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')

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


  describe "Test console line object", ->

    beforeEach ->
      @c_line = @console.line

    it "should create a ConsoleLine object", ->
      expect(@c_line).toBeDefined
      expect(@c_line).toEqual(jasmine.any(ConsoleLine))
      expect(@c_line.get_text()).toEqual("")


    it "should fetch the console line text", ->
      @c_line.text = '10 REM WELCOME TO GRANDPA BASIC 80'
      expect(@c_line.get_text()).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')


    it "should set the console line text", ->
      @c_line.set_text('10 REM WELCOME TO GRANDPA BASIC 80')
      expect(@c_line.get_text()).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')



