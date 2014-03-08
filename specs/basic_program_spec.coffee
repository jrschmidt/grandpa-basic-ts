describe "Test Basic program object functions", ->

  beforeEach ->
    @program = new BasicProgram


  describe "TestBasic program object", ->

    it "should create a BasicProgram object", ->
      expect(@program).toBeDefined
      expect(@program).toEqual(jasmine.any(BasicProgram))
      expect(@program.lines).toEqual(jasmine.any(Array))


    it "should add lines to the Basic program", ->
      @program.addline(10, '10 REM WELCOME TO GRANDPA BASIC 80')
      @program.addline(20, '20 $T = "JOHN R SCHMIDT"')
      @program.addline(30, '30 INPUT "DISPLAY NAME (Y/N)?";$Y')
      @program.addline(40, '40 IF $Y<>"Y" THEN 100')
      @program.addline(50, '50 PRINT "WRITTEN BY "+$T')
      @program.addline(100, '100 PRINT "OK BYE"')
      @program.addline(999, '999 END')

      expect(@program.lines).toContain( {"ln_no" : 10, "text" : '10 REM WELCOME TO GRANDPA BASIC 80'} )
      expect(@program.lines).toContain( {"ln_no" : 20, "text" : '20 $T = "JOHN R SCHMIDT"'} )
      expect(@program.lines).toContain( {"ln_no" : 30, "text" : '30 INPUT "DISPLAY NAME (Y/N)?";$Y'} )
      expect(@program.lines).toContain( {"ln_no" : 40, "text" : '40 IF $Y<>"Y" THEN 100'} )
      expect(@program.lines).toContain( {"ln_no" : 50, "text" : '50 PRINT "WRITTEN BY "+$T'} )
      expect(@program.lines).toContain( {"ln_no" : 100, "text" : '100 PRINT "OK BYE"'} )
      expect(@program.lines).toContain( {"ln_no" : 999, "text" : '999 END'} )

      @program.addline(50, '50 PRINT "PROGRAM AUTHOR: "+$T')
      expect(@program.lines).toContain( {"ln_no" : 50, "text" : '50 PRINT "PROGRAM AUTHOR: "+$T'} )
      expect(@program.lines).not.toContain( {"ln_no" : 50, "text" : '50 PRINT "WRITTEN BY "+$T'} )


    it "should fetch lines from the Basic program", ->
      @program.addline(10, '10 REM WELCOME TO GRANDPA BASIC 80')
      @program.addline(20, '20 $T = "JOHN R SCHMIDT"')
      @program.addline(30, '30 INPUT "DISPLAY NAME (Y/N)?";$Y')
      @program.addline(40, '40 IF $Y<>"Y" THEN 100')
      @program.addline(50, '50 PRINT "WRITTEN BY "+$T')
      @program.addline(100, '100 PRINT "OK BYE"')
      @program.addline(999, '999 END')

      expect(@program.fetch(10).text).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')
      expect(@program.fetch(20).text).toEqual('20 $T = "JOHN R SCHMIDT"')
      expect(@program.fetch(30).text).toEqual('30 INPUT "DISPLAY NAME (Y/N)?";$Y')
      expect(@program.fetch(40).text).toEqual('40 IF $Y<>"Y" THEN 100')
      expect(@program.fetch(50).text).toEqual('50 PRINT "WRITTEN BY "+$T')
      expect(@program.fetch(100).text).toEqual('100 PRINT "OK BYE"')
      expect(@program.fetch(999).text).toEqual('999 END')


    it "should remove lines from the Basic program", ->
      @program.addline(10, '10 REM WELCOME TO GRANDPA BASIC 80')
      @program.addline(20, '20 $T = "JOHN R SCHMIDT"')
      @program.addline(30, '30 INPUT "DISPLAY NAME (Y/N)?";$Y')
      @program.addline(40, '40 IF $Y<>"Y" THEN 100')
      @program.addline(50, '50 PRINT "WRITTEN BY "+$T')
      @program.addline(100, '100 PRINT "OK BYE"')
      @program.addline(999, '999 END')

      @program.remove(30)
      @program.remove(40)
      @program.remove(100)

      expect(@program.fetch(10).text).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')
      expect(@program.fetch(20).text).toEqual('20 $T = "JOHN R SCHMIDT"')
      expect(@program.fetch(30)).toEqual( {} )
      expect(@program.fetch(40)).toEqual( {} )
      expect(@program.fetch(50).text).toEqual('50 PRINT "WRITTEN BY "+$T')
      expect(@program.fetch(100)).toEqual( {} )
      expect(@program.fetch(999).text).toEqual('999 END')





