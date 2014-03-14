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


  xdescribe "Test line number parsing", ->
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



  describe "Test numeric assignment parsing", ->

    xit "should correctly parse a numeric assignment statement", ->

      po = @parser.parse('180 X=77')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(180)
      expect(po[2]).toEqual("<numeric_identifier>")
      expect(po[3]).toEqual("X")
      expect(po[4]).toEqual("<equals_sign>")
      expect(po[5]).toEqual("<numeric_expression>")
      expect(po[6]).toEqual("numeric_literal")
      expect(po[7]).toEqual("77")

      po = @parser.parse('320 K5=K2*K3+(2*K4)')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(320)
      expect(po[2]).toEqual("<numeric_identifier>")
      expect(po[3]).toEqual("K5")
      expect(po[4]).toEqual("<equals_sign>")
      expect(po[5]).toEqual("<numeric_expression>")
      expect(po[6]).toEqual("<numeric_identifier>")
      expect(po[7]).toEqual("K2")
      expect(po[8]).toEqual("<times>")
      expect(po[9]).toEqual("<numeric_identifier>")
      expect(po[10]).toEqual("K3")
      expect(po[11]).toEqual("<plus>")
      expect(po[12]).toEqual("<left>")
      expect(po[13]).toEqual("numeric_literal")
      expect(po[14]).toEqual("2")
      expect(po[15]).toEqual("<times>")
      expect(po[16]).toEqual("<numeric_identifier>")
      expect(po[17]).toEqual("K4")
      expect(po[18]).toEqual("<right>")

      po = @parser.parse('660 R=1+(B^2-4*A*C)/(2*A)')
      expect(po).toEqual(jasmine.any(Array))
      expect(po[0]).toEqual("<line_number>")
      expect(po[1]).toEqual(660)
      expect(po[2]).toEqual("<numeric_identifier>")
      expect(po[3]).toEqual("R")
      expect(po[4]).toEqual("<equals_sign>")
      expect(po[5]).toEqual("<numeric_expression>")
      expect(po[6]).toEqual("numeric_literal")
      expect(po[7]).toEqual("1")
      expect(po[8]).toEqual("<plus>")
      expect(po[10]).toEqual("<left>")
      expect(po[9]).toEqual("<numeric_identifier>")
      expect(po[11]).toEqual("B")
      expect(po[10]).toEqual("<power>")
      expect(po[12]).toEqual("numeric_literal")
      expect(po[13]).toEqual("2")
      expect(po[14]).toEqual("<minus>")
      expect(po[15]).toEqual("numeric_literal")
      expect(po[16]).toEqual("4")
      expect(po[17]).toEqual("<times>")
      expect(po[18]).toEqual("<numeric_identifier>")
      expect(po[19]).toEqual("A")
      expect(po[20]).toEqual("<times>")
      expect(po[21]).toEqual("<numeric_identifier>")
      expect(po[22]).toEqual("C")
      expect(po[23]).toEqual("<right>")
      expect(po[24]).toEqual("<divide>")
      expect(po[25]).toEqual("<left>")
      expect(po[26]).toEqual("numeric_literal")
      expect(po[27]).toEqual("2")
      expect(po[28]).toEqual("<times>")
      expect(po[29]).toEqual("<numeric_identifier>")
      expect(po[30]).toEqual("A")
      expect(po[31]).toEqual("<right>")


    xit "should flag any string that doesn't parse into a numeric expression after the equals sign", ->

      po = @parser.parse('110 Q="33-7"')
      expect(po).toEqual("<not_a_numeric_expression>")
      # TODO What would be a better value for these flags?

      po = @parser.parse('404 V6=180-45DEGREES')
      expect(po).toEqual("<not_a_numeric_expression>")

      po = @parser.parse('470 X5="NOTHING PARSEABLE AS A NUMERIC EXPRESSION"')
      expect(po).toEqual("<not_a_numeric_expression>")

      po = @parser.parse('590 Q=2*PI')
      expect(po).toEqual("<not_a_numeric_expression>")

      po = @parser.parse('740 J2=22,348,507')
      expect(po).toEqual("<not_a_numeric_expression>")






