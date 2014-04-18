describe "Program Controller", ->

  beforeEach ->
    @prog = new ProgramController

    @line300 = {
      line_no: 300
      command: "<remark>"
      text: '300 REM' }

    @line308 = {
      line_no: 308
      command: "<remark>"
      text: '308 REM THIS IS THE LINE 308 REMARK' }

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

    @line348 = {
      line_no: 348
      command: "<remark>"
      text: '348 REM THIS IS THE LINE 348 REMARK' }

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

    @line358 = {
      line_no: 358
      command: "<remark>"
      text: '358 REM THIS IS THE LINE 358 REMARK' }

    @line359 = {
      line_no: 359
      command: "<end>"
      text: '359 END' }

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

    @line368 = {
      line_no: 368
      command: "<remark>"
      text: '368 REM THIS IS THE LINE 368 REMARK' }

    @line370 = {
      line_no: 370
      command: "<print>"
      text: '370 PRINT "THAT WAS COMMON AROUND 1980"'
      expression: [ ["<str>", "THAT WAS COMMON AROUND 1980"] ] }

    @line388 = {
      line_no: 388
      command: "<remark>"
      text: '388 REM THIS IS THE LINE 388 REMARK' }

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


  it "should pass REM statements without doing anything", ->

    lines = {
      "300": @line300
      "308": @line308
      "340": @line340
      "348": @line348
      "350": @line350
      "358": @line358
      "360": @line360
      "368": @line368
      "370": @line370
      "388": @line388 }

    @prog.load(lines)

    expect(@prog.next_line_no).toEqual(300)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(308)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(340)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(348)
    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(350)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(358)
    expect(@prog.output).toEqual("THIS EMULATES THE EARLY")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(360)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(368)
    expect(@prog.output).toEqual("LINE NUMBER BASIC")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(370)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(388)
    expect(@prog.output).toEqual("THAT WAS COMMON AROUND 1980")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(0)


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


  it "should stop when it reaches an END statement", ->

    lines = {
      "340": @line340
      "350": @line350
      "359": @line359
      "360": @line360
      "370": @line370 }

    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(340)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(350)
    expect(@prog.output).toEqual("WELCOME TO GRANDPA BASIC 1980")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(359)
    expect(@prog.output).toEqual("THIS EMULATES THE EARLY")

    @prog.run_next_line()
    expect(@prog.next_line_no).not.toBeDefined()



