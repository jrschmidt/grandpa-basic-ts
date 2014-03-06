describe "Test of GB80 Grandpa Basic browser code", ->


  describe "Test GB80 Console functions", ->

    beforeEach ->
      @console = new Gb80Console

    it "should create a Gb80Console object", ->
      expect(@console).toBeDefined
      expect(@console).toEqual(jasmine.any(Gb80Console))


