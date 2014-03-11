describe "Test Basic program line parser", ->

  beforeEach ->
    @parser = new LineParser


  describe "Test line parser object", ->

    it "should create a LineParser object", ->
      expect(@parser).toBeDefined
      expect(@parser).toEqual(jasmine.any(LineParser))


  describe "Test command parsing", ->

    it "should correctly parse a terminal command", ->
      po = @parser.parse("CLEAR")
      expect(po).toEqual(jasmine.any(Array))
      expect(po.length).toEqual(1)
      expect(po[0]).toEqual("<clear>")

      po = @parser.parse("RUN")
      expect(po).toEqual(jasmine.any(Array))
      expect(po.length).toEqual(1)
      expect(po[0]).toEqual("<run>")

      po = @parser.parse("INFO")
      expect(po).toEqual(jasmine.any(Array))
      expect(po.length).toEqual(1)
      expect(po[0]).toEqual("<info>")


      po = @parser.parse("LIST")
      expect(po).toEqual(jasmine.any(Array))
      expect(po.length).toEqual(1)
      expect(po[0]).toEqual("<list>")


  describe "Test line number parsing", ->
    it "should correctly parse line numbers", ->

      po = @parser.parse('10 REM WELCOME TO GRANDPA BASIC 80')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(10)

      po = @parser.parse('20 $T = "JOHN R SCHMIDT"')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(20)

      po = @parser.parse('30 INPUT "DISPLAY NAME (Y/N)?";$Y')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(30)

      po = @parser.parse('40 IF $Y<>"Y" THEN 100')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(40)

      po = @parser.parse('50 PRINT "WRITTEN BY "+$T')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(50)

      po = @parser.parse('100 PRINT "OK BYE"')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(100)

      po = @parser.parse('999 END')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(999)




