describe "Test console line buffer object", ->

  beforeEach ->
    @buffer = new LineBuffer


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


  xit "should load text from the console object into the line buffer object", ->
    @console.addline('10 REM WELCOME TO GRANDPA BASIC 80')
    @console.load_line_buffer(0)
    expect(@buffer.get_text()).toEqual('10 REM WELCOME TO GRANDPA BASIC 80')
    @console.load_line_buffer(7)
    expect(@buffer.get_text()).toEqual("")
