describe "Program Controller", ->

  beforeEach ->
    @prog = new ProgramController

    @line340 = {
      line_no: 340
      command: "<print>"
      text: '340 PRINT "WELCOME TO GRANDPA BASIC 1980"'
      expression: [ ["<str>", "WELCOME TO GRANDPA BASIC 1980"] ] }

    @line342 = {
      line_no: 342
      command: "<gosub>"
      text: '342 GOSUB 1200"'
      dest: 1200 }

    @line345 = {
      line_no: 345
      command: "<goto>"
      text: '345 GOTO 360'
      dest: 360 }

    @line350 = {
      line_no: 350
      command: "<print>"
      text: '350 PRINT "THIS EMULATES THE EARLY"'
      expression: [ ["<str>", "THIS EMULATES THE EARLY"] ] }

    @line355 = {
      line_no: 355
      command: "<goto>"
      text: '355 GOTO 370'
      dest: 370 }

    @line360 = {
      line_no: 360
      command: "<print>"
      text: '360 PRINT "LINE NUMBER BASIC"'
      expression: [ ["<str>", "LINE NUMBER BASIC"] ] }

    @line362 = {
      line_no: 362
      command: "<goto>"
      text: '362 GOTO 1999'
      dest: 1999 }

    @line365 = {
      line_no: 365
      command: "<goto>"
      text: '365 GOTO 350'
      dest: 350 }

    @line370 = {
      line_no: 370
      command: "<print>"
      text: '370 PRINT "THAT WAS COMMON AROUND 1980"'
      expression: [ ["<str>", "THAT WAS COMMON AROUND 1980"] ] }

    @line1200 = {
      line_no: 1200
      command: "<print>"
      text: '1200 PRINT "  * * * THIS IS THE SUBROUTINE (1200) :-)"'
      expression: [ ["<str>", "  * * * THIS IS THE SUBROUTINE (1200) :-)"] ] }

    @line1299 = {
      line_no: 1299
      command: "<return>"
      text: '1299 RETURN' }

    @line1999 = {
      line_no: 1999
      command: "<print>"
      text: '1999 PRINT "WE HAVE REACHED THE END ..."'
      expression: [ ["<str>", "WE HAVE REACHED THE END ..."] ] }


  it "should execute PRINT statements", ->
    lines = {"340": @line340}
    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(340)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(0)
    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")


  it "should run more than one line", ->

    lines = {
      "340": @line340
      "350": @line350
      "360": @line360
      "370": @line370 }

    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(340)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(350)
    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(360)
    expect(@prog.output).toEqual("THIS EMULATES THE EARLY")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(370)
    expect(@prog.output).toEqual("LINE NUMBER BASIC")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(0)
    expect(@prog.output).toEqual("THAT WAS COMMON AROUND 1980")


  it "should jump in response to GOTO commands", ->

    lines = {
      "340": @line340
      "345": @line345
      "350": @line350
      "355": @line355
      "360": @line360
      "365": @line365
      "370": @line370 }

    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(340)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(345)
    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(360)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(365)
    expect(@prog.output).toEqual("LINE NUMBER BASIC")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(350)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(355)
    expect(@prog.output).toEqual("THIS EMULATES THE EARLY")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(370)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(0)
    expect(@prog.output).toEqual("THAT WAS COMMON AROUND 1980")


  it "should jump on GOSUB then RETURN", ->

    lines = {
      "340": @line340
      "342": @line342
      "350": @line350
      "360": @line360
      "362": @line362
      "1200": @line1200
      "1299": @line1299
      "1999": @line1999 }

    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(340)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(342)
    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(1200)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(1299)
    expect(@prog.output).toEqual("  * * * THIS IS THE SUBROUTINE (1200) :-)")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(350)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(360)
    expect(@prog.output).toEqual("THIS EMULATES THE EARLY")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(362)
    expect(@prog.output).toEqual("LINE NUMBER BASIC")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(1999)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(0)
    expect(@prog.output).toEqual("WE HAVE REACHED THE END ...")


