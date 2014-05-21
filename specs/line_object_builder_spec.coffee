describe "Program line object builder", ->

  beforeEach ->
    @formatter = new ProgramLineBuilder


  it "should build a valid console command object from a parsed console command", ->

    line_text = 'CLEAR'

    parse_object = ["<clear_command>"]

    result = @formatter.format(parse_object, line_text)
    expect(result.command).toEqual("<clear_command>")


    line_text = 'RUN'

    parse_object = ["<run_command>"]

    result = @formatter.format(parse_object, line_text)
    expect(result.command).toEqual("<run_command>")


    line_text = 'INFO'

    parse_object = ["<info_command>"]

    result = @formatter.format(parse_object, line_text)
    expect(result.command).toEqual("<info_command>")


    line_text = 'LIST'

    parse_object = ["<list_command>"]

    result = @formatter.format(parse_object, line_text)
    expect(result.command).toEqual("<list_command>")


  it "should build a valid program line object from a parsed line with a REM statement", ->

    line_text = '10 REM'

    parse_object = [
      "<line_number>"
      10
      "<sp>"
      "<remark>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(10)
    expect(result.command).toEqual("<remark>")
    expect(result.text).toEqual('10 REM')


    line_text = '20 REM WELCOME TO GRANDPA BASIC 1980'

    parse_object = [
      "<line_number>"
      20
      "<sp>"
      "<remark>"
      "<characters>"
      "WELCOME TO GRANDPA BASIC 1980" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(20)
    expect(result.command).toEqual("<remark>")
    expect(result.text).toEqual('20 REM WELCOME TO GRANDPA BASIC 1980')


  it "should build a valid program line object from a parsed line with a numeric assignment statement", ->

    line_text = '30 D=477+B'

    parse_object = [
      "<line_number>"
      30
      "<sp>"
      "<number_variable>"
      "D"
      "<equals>"
      "<numeric_expression>"
      "<numeric_literal>"
      477
      "<plus>"
      "<number_variable>"
      "B"
      "<num_exp_end>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(30)
    expect(result.command).toEqual("<numeric_assignment>")
    expect(result.text).toEqual('30 D=477+B')
    expect(result.operand).toEqual("D")
    expr = result.expression
    expect(expr.exp).toEqual("<plus>")
    expect(expr.op1.exp).toEqual("<num>")
    expect(expr.op1.value).toEqual(477)
    expect(expr.op2.exp).toEqual("<var>")
    expect(expr.op2.name).toEqual("B")


  it "should build a valid program line object from a parsed line with a string assignment statement", ->

    line_text = '40 $E=$M+" IS NOT COMPLETE"'

    parse_object = [
      "<line_number>"
      40
      "<sp>"
      "<string_variable>"
      "E"
      "<equals>"
      "<string_expression>"
      "<string_variable>"
      "M"
      "<plus>"
      "<string_literal>"
      " IS NOT COMPLETE"
      "<str_exp_end>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(40)
    expect(result.command).toEqual("<string_assignment>")
    expect(result.text).toEqual('40 $E=$M+" IS NOT COMPLETE"')
    expect(result.operand).toEqual("E")
    expect(result.expression[0][0]).toEqual("<var>")
    expect(result.expression[0][1]).toEqual("M")
    expect(result.expression[1][0]).toEqual("<str>")
    expect(result.expression[1][1]).toEqual(" IS NOT COMPLETE")


  it "should build a valid program line object from a parsed line with a GOTO statement", ->

    line_text = '520 GOTO 880'

    parse_object = [
      "<line_number>"
      520
      "<sp>"
      "<goto>"
      "<sp>"
      "<line_number>"
      880 ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(520)
    expect(result.command).toEqual("<goto>")
    expect(result.text).toEqual('520 GOTO 880')
    expect(result.dest).toEqual(880)


  it "should build a valid program line object from a parsed line with a GOSUB statement", ->

    line_text = '320 GOSUB 1200'

    parse_object = [
      "<line_number>"
      320
      "<sp>"
      "<gosub>"
      "<sp>"
      "<line_number>"
      1200 ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(320)
    expect(result.command).toEqual("<gosub>")
    expect(result.text).toEqual('320 GOSUB 1200')
    expect(result.dest).toEqual(1200)


  it "should build a valid program line object from a parsed line with a RETURN statement", ->

    line_text = '1299 RETURN'

    parse_object = [
      "<line_number>"
      1299
      "<sp>"
      "<return>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(1299)
    expect(result.command).toEqual("<return>")
    expect(result.text).toEqual('1299 RETURN')


  it "should build a valid program line object from a parsed line with an IF statement", ->

    line_text = '150 IF Z<0 THEN 340'

    parse_object = [
      "<line_number>"
      150
      "<sp>"
      "<if>"
      "<sp>"
      "<boolean_expression>"
      "<number_variable>"
      "Z"
      "<lesser_than>"
      "<numeric_expression>"
      "<numeric_literal>"
      0
      "<num_exp_end>"
      "<bool_exp_end>"
      "<sp>"
      "<then>"
      "<sp>"
      "<line_number>"
      340 ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(150)
    expect(result.command).toEqual("<if>")
    expect(result.text).toEqual('150 IF Z<0 THEN 340')
    expect(result.cond.exp).toEqual("<num_lesser_than>")
    expect(result.cond.var).toEqual("Z")
    expect(result.cond.num_exp.exp).toEqual("<num>")
    expect(result.cond.num_exp.value).toEqual(0)
    expect(result.dest).toEqual(340)


    line_text = '610 IF $T="INCOMPLETE" THEN 1680'

    parse_object = [
      "<line_number>"
      610
      "<sp>"
      "<if>"
      "<sp>"
      "<boolean_expression>"
      "<string_variable>"
      "T"
      "<equals>"
      "<string_expression>"
      "<string_literal>"
      "INCOMPLETE"
      "<str_exp_end>"
      "<bool_exp_end>"
      "<sp>"
      "<then>"
      "<sp>"
      "<line_number>"
      1680 ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(610)
    expect(result.command).toEqual("<if>")
    expect(result.text).toEqual('610 IF $T="INCOMPLETE" THEN 1680')
    expect(result.cond.exp).toEqual("<str_equals>")
    expect(result.cond.var).toEqual("T")
    expect(result.cond.str_exp[0][0]).toEqual("<str>")
    expect(result.cond.str_exp[0][1]).toEqual("INCOMPLETE")
    expect(result.dest).toEqual(1680)



  it "should build a valid program line object from a parsed line with an INPUT statement", ->

    line_text = '110 INPUT R'

    parse_object = [
      "<line_number>"
      110
      "<sp>"
      "<input>"
      "<sp>"
      "<number_variable>"
      "R" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(110)
    expect(result.command).toEqual("<input_numeric>")
    expect(result.text).toEqual('110 INPUT R')
    expect(result.operand).toEqual("R")


    line_text = '120 INPUT $V'

    parse_object = [
      "<line_number>"
      120
      "<sp>"
      "<input>"
      "<sp>"
      "<string_variable>"
      "V" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(120)
    expect(result.command).toEqual("<input_string>")
    expect(result.text).toEqual('120 INPUT $V')
    expect(result.operand).toEqual("V")


    line_text = '130 INPUT "HOW MANY?";M'

    parse_object = [
      "<line_number>"
      130
      "<sp>"
      "<input>"
      "<sp>"
      "<string>"
      "HOW MANY?"
      "<semicolon>"
      "<number_variable>"
      "M" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(130)
    expect(result.command).toEqual("<input_numeric_prompt>")
    expect(result.text).toEqual('130 INPUT "HOW MANY?";M')
    expect(result.operand).toEqual("M")
    expect(result.prompt).toEqual("HOW MANY?")


    line_text = '140 INPUT "LAST NAME?";$N2'

    parse_object = [
      "<line_number>"
      140
      "<sp>"
      "<input>"
      "<sp>"
      "<string>"
      "LAST NAME?"
      "<semicolon>"
      "<string_variable>"
      "N2" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(140)
    expect(result.command).toEqual("<input_string_prompt>")
    expect(result.text).toEqual('140 INPUT "LAST NAME?";$N2')
    expect(result.operand).toEqual("N2")
    expect(result.prompt).toEqual("LAST NAME?")



  it "should build a valid program line object from a parsed line with a PRINT statement", ->

    line_text = '340 PRINT "WELCOME TO GRANDPA BASIC 1980"'

    parse_object = [
      "<line_number>"
      340
      "<sp>"
      "<print>"
      "sp>"
      "<string_expression>"
      "<string_literal>"
      "WELCOME TO GRANDPA BASIC 1980"
      "<str_exp_end>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(340)
    expect(result.command).toEqual("<print>")
    expect(result.text).toEqual('340 PRINT "WELCOME TO GRANDPA BASIC 1980"')
    expect(result.expression[0][0]).toEqual("<str>")
    expect(result.expression[0][1]).toEqual("WELCOME TO GRANDPA BASIC 1980")


    line_text = '350 PRINT $Z1'

    parse_object = [
      "<line_number>"
      350
      "<sp>"
      "<print>"
      "sp>"
      "<string_expression>"
      "<string_variable>"
      "Z1"
      "<str_exp_end>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(350)
    expect(result.command).toEqual("<print>")
    expect(result.text).toEqual('350 PRINT $Z1')
    expect(result.expression[0][0]).toEqual("<var>")
    expect(result.expression[0][1]).toEqual("Z1")


    line_text = '360 PRINT "LAST NAME = "+$N4'

    parse_object = [
      "<line_number>"
      360
      "<sp>"
      "<print>"
      "sp>"
      "<string_expression>"
      "<string_literal>"
      "LAST NAME = "
      "<plus>"
      "<string_variable>"
      "N4"
      "<str_exp_end>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(360)
    expect(result.command).toEqual("<print>")
    expect(result.text).toEqual('360 PRINT "LAST NAME = "+$N4')
    expect(result.expression[0][0]).toEqual("<str>")
    expect(result.expression[0][1]).toEqual("LAST NAME = ")
    expect(result.expression[1][0]).toEqual("<var>")
    expect(result.expression[1][1]).toEqual("N4")


  it "should build a valid program line object from a parsed line with a PRINTLN statement", ->

    line_text = '470 PRINTLN'

    parse_object = [
      "<line_number>"
      470
      "<sp>"
      "<print_line>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(470)
    expect(result.command).toEqual("<print_line>")
    expect(result.text).toEqual('470 PRINTLN')
    expect(result.expression[0][0]).toEqual("<str>")
    expect(result.expression[0][1]).toEqual("")


    line_text = '480 PRINTLN "WELCOME TO GRANDPA BASIC 1980"'

    parse_object = [
      "<line_number>"
      480
      "<sp>"
      "<print_line>"
      "sp>"
      "<string_expression>"
      "<string_literal>"
      "WELCOME TO GRANDPA BASIC 1980"
      "<str_exp_end>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(480)
    expect(result.command).toEqual("<print_line>")
    expect(result.text).toEqual('480 PRINTLN "WELCOME TO GRANDPA BASIC 1980"')
    expect(result.expression[0][0]).toEqual("<str>")
    expect(result.expression[0][1]).toEqual("WELCOME TO GRANDPA BASIC 1980")


    line_text = '490 PRINTLN $Z1'

    parse_object = [
      "<line_number>"
      490
      "<sp>"
      "<print_line>"
      "sp>"
      "<string_expression>"
      "<string_variable>"
      "Z1"
      "<str_exp_end>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(490)
    expect(result.command).toEqual("<print_line>")
    expect(result.text).toEqual('490 PRINTLN $Z1')
    expect(result.expression[0][0]).toEqual("<var>")
    expect(result.expression[0][1]).toEqual("Z1")



  it "should build a valid program line object from a parsed line with a CLEARSCRN statement", ->

    line_text = '940 CLEARSCRN'

    parse_object = [
      "<line_number>"
      940
      "<sp>"
      "<clear_screen>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(940)
    expect(result.command).toEqual("<clear_screen>")
    expect(result.text).toEqual('940 CLEARSCRN')


  it "should build a valid program line object from a parsed line with a TAB statement", ->

    line_text = '870 TAB 28'

    parse_object = [
      "<line_number>"
      870
      "<sp>"
      "<tab>"
      "<sp>"
      "<integer>"
      28 ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(870)
    expect(result.command).toEqual("<tab_col>")
    expect(result.text).toEqual('870 TAB 28')
    expect(result.col).toEqual(28)


    line_text = '880 TAB 12,44'

    parse_object = [
      "<line_number>"
      880
      "<sp>"
      "<tab>"
      "<sp>"
      "<integer>"
      12
      "<comma>"
      "<integer>"
      44 ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(880)
    expect(result.command).toEqual("<tab_line_col>")
    expect(result.text).toEqual('880 TAB 12,44')
    expect(result.line).toEqual(12)
    expect(result.col).toEqual(44)


  it "should build a valid program line object from a parsed line with an END statement", ->

    line_text = '999 END'

    parse_object = [
      "<line_number>"
      999
      "<sp>"
      "<end>" ]

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(999)
    expect(result.command).toEqual("<end>")
    expect(result.text).toEqual('999 END')
