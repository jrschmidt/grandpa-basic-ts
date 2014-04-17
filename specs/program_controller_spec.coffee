describe "Program Controller", ->

  beforeEach ->
    @prog = new ProgramController

    @line340 = {
      line_no: 340
      command: "<print>"
      text: '340 PRINT "WELCOME TO GRANDPA BASIC 1980"'
      expression: [ ["<str>", "WELCOME TO GRANDPA BASIC 1980"] ] }

    @line345 = {
      line_no: 345
      command: "<goto>"
      text: '345 GOTO 360'
      dest: 360 }

    @line350 = {
      line_no: 350
      command: "<print>"
      text: '350 PRINT "THIS EMULATES THE EARLY"'
      expression: [ ["<str>", ""] ] }

    @line355 = {
      line_no: 355
      command: "<goto>"
      text: '355 GOTO 370'
      dest: 370 }

    @line360 = {
      line_no: 360
      command: "<print>"
      text: '360 PRINT "COMMAND LINE BASIC"'
      expression: [ ["<str>", ""] ] }

    @line365 = {
      line_no: 365
      command: "<goto>"
      text: '365 GOTO 350'
      dest: 350 }

    @line370 = {
      line_no: 370
      command: "<print>"
      text: '370 PRINT "THAT WAS COMMON AROUND 1980"'
      expression: [ ["<str>", ""] ] }


  it "should execute PRINT statements", ->
    lines = {"340": @line340}
    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(340)
    @prog.run_next_line()
    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")
    expect(@prog.next_line_no).toEqual(0)


  xit "should run more than one line", ->

    lines = {
      "340": @line340
      "350": @line350
      "360": @line360
      "370": @line370 }

    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(340)
    @prog.run_next_line()
    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")

    expect(@prog.next_line_no).toEqual(350)
    @prog.run_next_line()
    expect(@prog.output).toEqual("THIS EMULATES THE EARLY")

    expect(@prog.next_line_no).toEqual(360)
    @prog.run_next_line()
    expect(@prog.output).toEqual("COMMAND LINE BASIC")

    expect(@prog.next_line_no).toEqual(370)
    @prog.run_next_line()
    expect(@prog.output).toEqual("THAT WAS COMMON AROUND 1980")
    expect(@prog.next_line_no).toEqual(0)


  xit "should jump in response to GOTO commands", ->

    lines = {
      "340": @line340
      "345": @line345
      "350": @line350
      "355": @line365
      "360": @line360
      "365": @line365
      "370": @line370 }

    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(340)

    @prog.run_next_line()
    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")
    expect(@prog.next_line_no).toEqual(345)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(360)

    @prog.run_next_line()
    expect(@prog.output).toEqual("COMMAND LINE BASIC")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(365)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(350)

    @prog.run_next_line()
    expect(@prog.output).toEqual("THIS EMULATES THE EARLY")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(355)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(370)

    @prog.run_next_line()
    expect(@prog.output).toEqual("THAT WAS COMMON AROUND 1980")
    expect(@prog.next_line_no).toEqual(0)




