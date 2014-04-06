describe "Program line formatting", ->

  beforeEach ->
    @formatter = new ProgramLineFormatter


  it "should correctly format a program line with a REM statement", ->

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


  it "should correctly format a program line with a numeric assignment statement", ->

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


  it "should correctly format a program line with a string assignment statement", ->

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

    expr = [
      [ "<var>", "M" ]
      [ "<str>", " IS NOT COMPLETE" ] ]

    line = {
      line_no: 40
      command:  "<string_assignment>"
      text: '40 $E=$M+" IS NOT COMPLETE"'
      operand: "E"
      expression: expr }

    result = @formatter.format(parse_object, line_text)
    expect(result.line_no).toEqual(40)
    expect(result.command).toEqual("<string_assignment>")
    expect(result.text).toEqual('40 $E=$M+" IS NOT COMPLETE"')
    expect(result.operand).toEqual("E")
    expect(result.expression[0][0]).toEqual("<var>")
    expect(result.expression[0][1]).toEqual("M")
    expect(result.expression[1][0]).toEqual("<str>")
    expect(result.expression[1][1]).toEqual(" IS NOT COMPLETE")


  it "should correctly format a program line with a GOTO statement", ->

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


  it "should correctly format a program line with a GOSUB statement", ->

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


  it "should correctly format a program line with a RETURN statement", ->

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


  xit "should correctly format a program line with an IF statement", ->

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
      "numeric_literal>"
      0
      "<bool_exp_end>"
      "<sp>"
      "<then>"
      "<sp>"
      "<line_number>"
      340 ]

    line = {
      line_no: 150
      command:  "<if>"
      text: '150 IF Z<0 THEN 340'
      # TODO CHANGE THIS: cond: jasmine.any(BooleanExpression)
      dest: 340 }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()}

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
      "<string_literal>"
      "INCOMPLETE"
      "<bool_exp_end>"
      "<sp>"
      "<then>"
      "<sp>"
      "<line_number>"
      1680 ]

    line = {
      line_no: 610
      command:  "<if>"
      text: '610 IF $T="INCOMPLETE" THEN 1680'
      # TODO CHANGE THIS: cond: jasmine.any(BooleanExpression)
      dest: 1680 }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



  xit "should correctly format a program line with an INPUT statement", ->

    line_text = '110 INPUT R'

    parse_object = [
      "<line_number>"
      110
      "<sp>"
      "<input>"
      "<sp>"
      "<number_variable>"
      "R" ]

    line = {
      line_no: 110
      command:  "<input_numeric>"
      text: '110 INPUT R'
      operand: "R" }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



    line_text = '120 INPUT $V'

    parse_object = [
      "<line_number>"
      120
      "<sp>"
      "<input>"
      "<sp>"
      "<string_variable>"
      "V" ]

    line = {
      line_no: 120
      command:  "<input_string>"
      text: '120 INPUT $V'
      operand: "V" }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



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

    line = {
      line_no: 130
      command:  "<input_numeric_prompt>"
      text: '130 INPUT "HOW MANY?";M'
      operand: "M"
      prompt: "HOW MANY?" }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



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

    line = {
      line_no: 140
      command:  "<input_string_prompt>"
      text: '140 INPUT "LAST NAME?";$N2'
      operand: "N2"
      prompt: "LAST NAME?" }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



  xit "should correctly format a program line with a PRINT statement", ->

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

    line = {
      line_no: 340
      command:  "<print>"
      text: '340 PRINT "WELCOME TO GRANDPA BASIC 1980"'}
      # TODO CHANGE THIS: expression: jasmine.any(StringExpression) }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



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

    line = {
      line_no: 350
      command:  "<print>"
      text: '350 PRINT $Z1'}
      # TODO CHANGE THIS: expression: jasmine.any(StringExpression) }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



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

    line = {
      line_no: 360
      command:  "<print>"
      text: '360 PRINT "LAST NAME = "+$N4'}
      # TODO CHANGE THIS: expression: jasmine.any(StringExpression) }


    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



  xit "should correctly format a program line with a PRINTLN statement", ->

    line_text = '470 PRINTLN'

    parse_object = [
      "<line_number>"
      470
      "<sp>"
      "<print_line>" ]

    line = {
      line_no: 470
      command:  "<print_line>"
      text: '470 PRINTLN'}
      # TODO CHANGE THIS: expression: jasmine.any(StringExpression) }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



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

    line  = {
      line_no: 480
      command:  "<print_line>"
      text: '480 PRINTLN "WELCOME TO GRANDPA BASIC 1980"'}
      # TODO CHANGE THIS: expression: jasmine.any(StringExpression) }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()



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

    line = {
      line_no: 490
      command:  "<print_line>"
      text: '490 PRINTLN $Z1'}
      # TODO CHANGE THIS: expression: jasmine.any(StringExpression) }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()


  it "should correctly format a program line with a CLEARSCRN statement", ->

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


  xit "should correctly format a program line with a TAB statement", ->

    line_text = '870 TAB 28'

    parse_object = [
      "<line_number>"
      870
      "<sp>"
      "<tab>"
      "<sp>"
      "<integer>"
      28 ]

    line = {
      line_no: 870
      command:  "<tab_col>"
      text: '870 TAB 28'
      col: 28 }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()


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

    line = {
      line_no: 880
      command:  "<tab_line_col>"
      text: '880 TAB 12,44'
      line: 12
      col: 44 }

    result = @formatter.format(parse_object, line_text)
#    expect(result.line_no).toEqual()
#    expect(result.command).toEqual()
#    expect(result.text).toEqual()
#    expect(result.).toEqual()


  it "should correctly format a program line with an END statement", ->

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

