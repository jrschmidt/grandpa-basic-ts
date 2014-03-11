describe "Test Basic program line parser", ->

  beforeEach ->
    @parser = new LineParser

  describe "Test line parser object", ->

    it "should create a LineParser object", ->
      expect(@parser).toBeDefined
      expect(@parser).toEqual(jasmine.any(LineParser))

    it "should parse a valid string into a parse object", ->
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



