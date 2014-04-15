describe "Program interpreter", ->

  beforeEach ->
    @prog = new ProgramInterpreter

  it "should execute PRINT statements", ->

    @prog.reset

    line = {
      line_no: 340
      command: "<print>"
      text: '340 PRINT "WELCOME TO GRANDPA BASIC 1980"'
      expression: [ ["<str>", "WELCOME TO GRANDPA BASIC 1980"] ] }
      
    @prog.run_line(line)

    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")
