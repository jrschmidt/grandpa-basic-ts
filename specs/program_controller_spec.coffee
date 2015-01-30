describe "Program controller", ->

  beforeEach ->
    @keys = new KeyTalker
    @prog = @keys.controller.program_control
    @statement_runner = @prog.statement_runner
    @helpers = @statement_runner.helpers
    @num_vars = @helpers.num_vars
    @str_vars = @helpers.str_vars
    @num_eval = @helpers.num_eval
    @str_eval = @helpers.str_eval
    @bx_eval = @helpers.bx_eval

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

    @line510 = {
      line_no: 510
      command: "<numeric_assignment>"
      text: '510 A=77'
      operand: "A"
      expression: {exp: "<num>", value: 77} }

    @line520 = {
      line_no: 520
      command: "<numeric_assignment>"
      text: '520 P=3.1416'
      operand: "P"
      expression: {exp: "<num>", value: 3.1416} }

    @line530 = {
      line_no: 530
      command: "<numeric_assignment>"
      text: '530 Q=302'
      operand: "Q"
      expression: {exp: "<num>", value: 302} }

    @line540 = {
      line_no: 540
      command: "<numeric_assignment>"
      text: '540 R=203'
      operand: "R"
      expression: {exp: "<num>", value: 203} }

    @line550 = {
      line_no: 550
      command: "<numeric_assignment>"
      text: '550 T=Q+R'
      operand: "T"
      expression: {exp: "<plus>", op1: {exp: "<var>", name: "Q" }, op2: {exp: "<var>", name: "R" } } }

    @line560 = {
      line_no: 560
      command: "<numeric_assignment>"
      text: 'F2=51'
      operand: "F2"
      expression: {exp: "<num>", value: 51} }

    @line570 = {
      line_no: 570
      command: "<numeric_assignment>"
      text: '570 M=F2/3'
      operand: "M"
      expression: {exp: "<divide>", op1: {exp: "<var>", name: "F2" }, op2: {exp: "<num>", value: 3 } } }

    @line610 = {
      line_no: 610
      command: "<string_assignment>"
      text: '610 $V="OHIO"'
      operand: "V"
      expression: [ ["<str>", "OHIO"] ] }

    @line620 = {
      line_no: 620
      command: "<print>"
      text: '620 PRINT $V'
      expression: [ ["<var>", "V"] ] }

    @line630 = {
      line_no: 630
      command: "<string_assignment>"
      text: '630 $W="KENTUCKY"'
      operand: "W"
      expression: [ ["<str>", "KENTUCKY"] ] }

    @line640 = {
      line_no: 640
      command: "<print>"
      text: '640 PRINT $W'
      expression: [ ["<var>", "W"] ] }

    @line650 = {
      line_no: 650
      command: "<string_assignment>"
      text: '650 $A=$V+" IS NORTH OF "+$W'
      operand: "A"
      expression: [ ["<var>", "V"], ["<str>", " IS NORTH OF "], ["<var>", "W"] ] }

    @line660 = {
      line_no: 660
      command: "<print>"
      text: '660 PRINT $A'
      expression: [ ["<var>", "A"] ] }

    @line710 = {
      line_no: 710
      command: "<numeric_assignment>"
      text: '710 N=22'
      operand: "N"
      expression: {exp: "<num>", value: 22} }

    @line720 = {
      line_no: 720
      command: "<numeric_assignment>"
      text: '720 N=N+10'
      operand: "N"
      expression: {exp: "<plus>", op1: {exp: "<var>", name: "N"}, op2: {exp: "<num>", value: 10} } }

    @line730 = {
      line_no: 730
      command: "<if>"
      text: '730 IF N>40 THEN 760'
      cond: {exp: "<num_greater_than>", var: "N", num_exp: {exp: "<num>", value: 40} }
      dest: 760 }

    @line740 = {
      line_no: 740
      command: "<print>"
      text: '740 PRINT "NOT BIG ENOUGH YET"'
      expression: [ ["<str>", "NOT BIG ENOUGH YET" ] ] }

    @line750 = {
      line_no: 750
      command: "<goto>"
      text: '750 GOTO 720'
      dest: 720 }

    @line760 = {
      line_no: 760
      command: "<print>"
      text: '760 PRINT "NOW IT IS BIG ENOUGH"'
      expression: [ ["<str>", "NOW IT IS BIG ENOUGH" ] ] }

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


  it "should execute numeric assignment statements", ->

    lines = {
      "510": @line510
      "520": @line520
      "530": @line530
      "540": @line540
      "550": @line550
      "560": @line560
      "570": @line570 }

    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(510)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(520)
    expect(@num_vars.get("A")).toEqual(77)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(530)
    expect(@num_vars.get("P")).toEqual(3.1416)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(540)
    expect(@num_vars.get("Q")).toEqual(302)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(550)
    expect(@num_vars.get("R")).toEqual(203)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(560)
    expect(@num_vars.get("T")).toEqual(505)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(570)
    expect(@num_vars.get("F2")).toEqual(51)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(0)
    expect(@num_vars.get("M")).toEqual(17)


  it "should execute string assignment statements", ->

    lines = {
      "610": @line610
      "620": @line620
      "630": @line630
      "640": @line640
      "650": @line650
      "660": @line660 }

    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(610)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(620)
    expect(@str_vars.get("V")).toEqual("OHIO")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(630)
    expect(@prog.output).toEqual("OHIO")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(640)
    expect(@str_vars.get("W")).toEqual("KENTUCKY")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(650)
    expect(@prog.output).toEqual("KENTUCKY")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(660)
    expect(@str_vars.get("A")).toEqual("OHIO IS NORTH OF KENTUCKY")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(0)
    expect(@prog.output).toEqual("OHIO IS NORTH OF KENTUCKY")


  it "should execute IF statements", ->

    lines = {
      "710": @line710
      "720": @line720
      "730": @line730
      "740": @line740
      "750": @line750
      "760": @line760 }

    @prog.load(lines)
    expect(@prog.next_line_no).toEqual(710)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(720)
    expect(@num_vars.get("N")).toEqual(22)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(730)
    expect(@num_vars.get("N")).toEqual(32)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(740)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(750)
    expect(@prog.output).toEqual("NOT BIG ENOUGH YET")

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(720)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(730)
    expect(@num_vars.get("N")).toEqual(42)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(760)

    @prog.run_next_line()
    expect(@prog.next_line_no).toEqual(0)
    expect(@prog.output).toEqual("NOW IT IS BIG ENOUGH")
