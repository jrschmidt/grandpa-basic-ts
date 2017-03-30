describe "Console scrolling", ->

  beforeEach ->
    @console = new BasicConsole
    @scroll = @console.scroll

  afterEach ->
    @console.clear_all()


  it "should add lines to the scroll buffer as they are printed", ->
    expect(@scroll.length).toEqual(0)

    @console.println("10 X=100")
    expect(@scroll.length).toEqual(1)
    expect(@scroll[0]).toEqual("10 X=100")

    @console.println("20 Y=33")
    expect(@scroll.length).toEqual(2)
    expect(@scroll[1]).toEqual("20 Y=33")

    @console.println("30 Z=888")
    expect(@scroll.length).toEqual(3)
    expect(@scroll[2]).toEqual("30 Z=888")

    @console.println("40 M=X+Y")
    expect(@scroll.length).toEqual(4)
    expect(@scroll[3]).toEqual("40 M=X+Y")

    @console.println("50 W=M/Z")
    expect(@scroll.length).toEqual(5)
    expect(@scroll[4]).toEqual("50 W=M/Z")

    for n in [1..15]
      @console.println("88 REM FILLER LINE")
    expect(@scroll.length).toEqual(20)


  it "should move lines towards top of 'screen' as lines are added at bottom", ->

    # First we repeat the steps above, to fill the first 20 lines:
    expect(@scroll.length).toEqual(0)
    @console.println("10 X=100")
    @console.println("20 Y=33")
    @console.println("30 Z=888")
    @console.println("40 M=X+Y")
    @console.println("50 W=M/Z")
    for n in [1..15]
      @console.println("88 REM FILLER LINE")
    expect(@scroll.length).toEqual(20)

    # Now we add more lines, expecting them to 'scroll up'
    @console.println("210 X=110")
    expect(@scroll.length).toEqual(21)
    expect(@scroll[20]).toEqual("210 X=110")

    @console.println("220 X=120")
    expect(@scroll.length).toEqual(22)
    expect(@scroll[21]).toEqual("220 X=120")

    @console.println("230 X=130")
    expect(@scroll.length).toEqual(22)
    expect(@scroll[21]).toEqual("230 X=130")
    expect(@scroll[0]).toEqual("20 Y=33")
    expect(@scroll[1]).toEqual("30 Z=888")

    @console.println("240 X=140")
    expect(@scroll.length).toEqual(22)
    expect(@scroll[21]).toEqual("240 X=140")
    expect(@scroll[0]).toEqual("30 Z=888")
    expect(@scroll[1]).toEqual("40 M=X+Y")

    @console.println("250 X=150")
    expect(@scroll.length).toEqual(22)
    expect(@scroll[21]).toEqual("250 X=150")
    expect(@scroll[0]).toEqual("40 M=X+Y")
    expect(@scroll[1]).toEqual("50 W=M/Z")
