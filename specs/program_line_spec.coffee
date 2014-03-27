xdescribe "Test program line formatting", ->


  it "should correctly format a program line with a REM statement", ->

    parse_object = [
      "<line_number>"
      10
      "<sp>"
      "<remark>" ]

    expected = {
      line_no: 10
      type:  "<remark>"
      text: '10 REM' }

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


    parse_object = [
      "<line_number>"
      20
      "<sp>"
      "<remark>"
      "<characters>"
      "WELCOME TO GRANDPA BASIC 1980" ]

    expected = {
      line_no: 20
      type:  "<remark>"
      text: '20 REM WELCOME TO GRANDPA BASIC 1980' }


  it "should correctly format a program line with a numeric assignment statement", ->

    parse_object = [
      "<line_number>"
      30
      "<sp>"
      "<numeric_assignment>"
      "<numeric_variable"
      "D"
      "<equals>"
      "<numeric_expression>"
      "numeric_literal>"
      477
      "<plus>"
      "<numeric_variable>"
      "B" ]


    expected = {
      line_no: 30
      type:  "<numeric_assignment>"
      text: '30 D=477+B'
      operand: "D"
      expression: [NumericExpression] }

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)




  
line_30 = {
      line_no: 30
      type:  "<numeric_assignment>"
      text: '30 D=477+B'
      operand: "D"
      expression: [NumericExpression] }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_40 = {
      line_no: 40
      type:  "<string_assignment>"
      text: '40 $E=$M+" IS NOT COMPLETE"'
      operand: "E"
      expression: [StringExpression] }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_520 = {
      line_no: 520
      type:  "<goto>"
      text: '520 GOTO 880'
      dest: 880 }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_320 = {
      line_no: 320
      type:  "<gosub>"
      text: '320 GOSUB 1200'
      dest: 1200 }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_1299 = {
      line_no: 1299
      type:  "<return>"
      text: '1299 RETURN' }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_150 = {
      line_no: 150
      type:  "<if>"
      text: '150 IF Z<0 THEN 340'
      cond: [BooleanExpression]
      dest: 340 }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_610 = {
      line_no: 610
      type:  "<if>"
      text: '610 IF $T="INCOMPLETE" THEN 1680'
      cond: [BooleanExpression]
      dest: 1680 }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_110 = {
      line_no: 110
      type:  "<input_numeric>"
      text: '110 INPUT R'
      operand: "R" }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_120 = {
      line_no: 120
      type:  "<input_string>"
      text: '120 INPUT $V'
      operand: "V" }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_130 = {
      line_no: 130
      type:  "<input_numeric_prompt>"
      text: '130 INPUT "HOW MANY?";M'
      operand: "M"
      prompt: "HOW MANY?" }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_140 = {
      line_no: 140
      type:  "<input_string_prompt>"
      text: '140 INPUT "LAST NAME?";$N2'
      operand: "N2"
      prompt: "LAST NAME?" }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_340 = {
      line_no: 340
      type:  "<print>"
      text: '340 PRINT "WELCOME TO GRANDPA BASIC 1980"'
      expression: [StringExpression] }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_350 = {
      line_no: 350
      type:  "<print>"
      text: '350 PRINT $Z1'
      expression: [StringExpression] }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_360 = {
      line_no: 360
      type:  "<print>"
      text: '360 PRINT "LAST NAME = "+$N4'
      expression: [StringExpression] }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_470 = {
      line_no: 470
      type:  "<print_line>"
      text: '470 PRINTLN'
      expression: [StringExpression] }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_480 = {
      line_no: 480
      type:  "<print_line>"
      text: '480 PRINTLN "WELCOME TO GRANDPA BASIC 1980"'
      expression: [StringExpression] }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_490 = {
      line_no: 490
      type:  "<print_line>"
      text: '490 PRINTLN $Z1'
      expression: [StringExpression] }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_940 = {
      line_no: 940
      type:  "<clear_screen>"
      text: '940 CLEARSCRN' }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_870 = {
      line_no: 870
      type:  "<tab_col>"
      text: '870 TAB 28'
      col: 28 }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_880 = {
      line_no: 880
      type:  "<tab_line_col>"
      text: '880 TAB 12,44'
      line: 12
      col: 44 }


  it "should correctly format a program line with a  statement", ->

    parse_object = [
      "<line_number>"

      "<sp>"


    expected = 

    result = new BasicProgramLine(parse_object)
    expect(result.components).toEqual(expected)


line_999 = {
      line_no: 999
      type:  "<end>"
      text: '999 END' }


