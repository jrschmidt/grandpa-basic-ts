describe "Console line buffer", ->

  beforeEach ->
    @console = new BasicConsole
    @buffer = @console.buffer

  it "should add characters to the buffer", ->
    expect(@buffer.chars).toEqual("")
    @buffer.add("4")
    expect(@buffer.chars).toEqual("4")
    @buffer.add("0")
    expect(@buffer.chars).toEqual("40")
    @buffer.add(" ")
    expect(@buffer.chars).toEqual("40 ")
    @buffer.add("X")
    expect(@buffer.chars).toEqual("40 X")
    @buffer.add("=")
    expect(@buffer.chars).toEqual("40 X=")
    @buffer.add("Y")
    expect(@buffer.chars).toEqual("40 X=Y")
    @buffer.add("+")
    expect(@buffer.chars).toEqual("40 X=Y+")
    @buffer.add("1")
    expect(@buffer.chars).toEqual("40 X=Y+1")
    @buffer.add("0")
    expect(@buffer.chars).toEqual("40 X=Y+10")
    @buffer.add("0")
    expect(@buffer.chars).toEqual("40 X=Y+100")


  it "should print the characters in the buffer, then clear the buffer", ->
    expect(@buffer.chars).toEqual("")
    @buffer.add(ch) for ch in "40 X=Y+100"
    expect(@buffer.chars).toEqual("40 X=Y+100")
    @buffer.print()
    expect(@console.msg).toEqual("40 X=Y+100")
    expect(@buffer.chars).toEqual("")    

