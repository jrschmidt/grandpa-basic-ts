describe "Statement parsing", ->

  beforeEach ->
    @parser = new LineParser
    @syntax = new SyntaxRules


  it "should correctly parse REM statements", ->

    result = @parser.look_for("REM", @syntax.line_number_rules[1])
    po = result.parse_object
    expect(po[0]).toEqual("<remark>")

    result = @parser.look_for("REM WELCOME TO GRANDPA BASIC 1980", @syntax.line_number_rules[0])
    po = result.parse_object
    expect(po[0]).toEqual("<remark>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<characters>")
    expect(po[3]).toEqual('WELCOME TO GRANDPA BASIC 1980')

    result = @parser.look_for("REM **** - - - ****", @syntax.line_number_rules[0])
    po = result.parse_object
    expect(po[0]).toEqual("<remark>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<characters>")
    expect(po[3]).toEqual('**** - - - ****')

    result = @parser.look_for("REM PARSE LEFT SIDE BEFORE RIGHT SIDE", @syntax.line_number_rules[0])
    po = result.parse_object
    expect(po[0]).toEqual("<remark>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<characters>")
    expect(po[3]).toEqual('PARSE LEFT SIDE BEFORE RIGHT SIDE')


  it "should correctly parse numeric assignment statements", ->

    result = @parser.look_for("A0=X", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("A0")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<number_variable>")
    expect(po[5]).toEqual("X")
    expect(po[6]).toEqual("<num_exp_end>")

    result = @parser.look_for("B=42", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("B")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<numeric_literal>")
    expect(po[5]).toEqual(42)
    expect(po[6]).toEqual("<num_exp_end>")

    result = @parser.look_for("Z7=13.477", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("Z7")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<numeric_literal>")
    expect(po[5]).toEqual(13.477)
    expect(po[6]).toEqual("<num_exp_end>")

    result = @parser.look_for("E=12/3", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("E")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<numeric_literal>")
    expect(po[5]).toEqual(12)
    expect(po[6]).toEqual("<divide>")
    expect(po[7]).toEqual("<numeric_literal>")
    expect(po[8]).toEqual(3)
    expect(po[9]).toEqual("<num_exp_end>")

    result = @parser.look_for("D=477+B", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("D")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<numeric_literal>")
    expect(po[5]).toEqual(477)
    expect(po[6]).toEqual("<plus>")
    expect(po[7]).toEqual("<number_variable>")
    expect(po[8]).toEqual("B")
    expect(po[9]).toEqual("<num_exp_end>")

    result = @parser.look_for("F1=C^2", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("F1")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<number_variable>")
    expect(po[5]).toEqual("C")
    expect(po[6]).toEqual("<power>")
    expect(po[7]).toEqual("<numeric_literal>")
    expect(po[8]).toEqual(2)
    expect(po[9]).toEqual("<num_exp_end>")

    result = @parser.look_for("W=X*Y*Z", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("W")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<number_variable>")
    expect(po[5]).toEqual("X")
    expect(po[6]).toEqual("<times>")
    expect(po[7]).toEqual("<number_variable>")
    expect(po[8]).toEqual("Y")
    expect(po[9]).toEqual("<times>")
    expect(po[10]).toEqual("<number_variable>")
    expect(po[11]).toEqual("Z")
    expect(po[12]).toEqual("<num_exp_end>")

    result = @parser.look_for("M=28*(J+2)", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("M")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<numeric_literal>")
    expect(po[5]).toEqual(28)
    expect(po[6]).toEqual("<times>")
    expect(po[7]).toEqual("<left>")
    expect(po[8]).toEqual("<number_variable>")
    expect(po[9]).toEqual("J")
    expect(po[10]).toEqual("<plus>")
    expect(po[11]).toEqual("<numeric_literal>")
    expect(po[12]).toEqual(2)
    expect(po[13]).toEqual("<right>")
    expect(po[14]).toEqual("<num_exp_end>")

    result = @parser.look_for("L3=W5+W7-4*(J^2+K^3)", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("L3")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<number_variable>")
    expect(po[5]).toEqual("W5")
    expect(po[6]).toEqual("<plus>")
    expect(po[7]).toEqual("<number_variable>")
    expect(po[8]).toEqual("W7")
    expect(po[9]).toEqual("<minus>")
    expect(po[10]).toEqual("<numeric_literal>")
    expect(po[11]).toEqual(4)
    expect(po[12]).toEqual("<times>")
    expect(po[13]).toEqual("<left>")
    expect(po[14]).toEqual("<number_variable>")
    expect(po[15]).toEqual("J")
    expect(po[16]).toEqual("<power>")
    expect(po[17]).toEqual("<numeric_literal>")
    expect(po[18]).toEqual(2)
    expect(po[19]).toEqual("<plus>")
    expect(po[20]).toEqual("<number_variable>")
    expect(po[21]).toEqual("K")
    expect(po[22]).toEqual("<power>")
    expect(po[23]).toEqual("<numeric_literal>")
    expect(po[24]).toEqual(3)
    expect(po[25]).toEqual("<right>")
    expect(po[26]).toEqual("<num_exp_end>")

    result = @parser.look_for("G=(18-Q7)/(2.108*(14*M+17*X))", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("G")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_expression>")
    expect(po[4]).toEqual("<left>")
    expect(po[5]).toEqual("<numeric_literal>")
    expect(po[6]).toEqual(18)
    expect(po[7]).toEqual("<minus>")
    expect(po[8]).toEqual("<number_variable>")
    expect(po[9]).toEqual("Q7")
    expect(po[10]).toEqual("<right>")
    expect(po[11]).toEqual("<divide>")
    expect(po[12]).toEqual("<left>")
    expect(po[13]).toEqual("<numeric_literal>")
    expect(po[14]).toEqual(2.108)
    expect(po[15]).toEqual("<times>")
    expect(po[16]).toEqual("<left>")
    expect(po[17]).toEqual("<numeric_literal>")
    expect(po[18]).toEqual(14)
    expect(po[19]).toEqual("<times>")
    expect(po[20]).toEqual("<number_variable>")
    expect(po[21]).toEqual("M")
    expect(po[22]).toEqual("<plus>")
    expect(po[23]).toEqual("<numeric_literal>")
    expect(po[24]).toEqual(17)
    expect(po[25]).toEqual("<times>")
    expect(po[26]).toEqual("<number_variable>")
    expect(po[27]).toEqual("X")
    expect(po[28]).toEqual("<right>")
    expect(po[29]).toEqual("<right>")
    expect(po[30]).toEqual("<num_exp_end>")


  it "should correctly parse string assignment statements", ->

    result = @parser.look_for('$L="HAPPY THURSDAY!"', @syntax.line_number_rules[3])
    po = result.parse_object
    expect(po[0]).toEqual("<string_variable>")
    expect(po[1]).toEqual("L")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<string_expression>")
    expect(po[4]).toEqual("<string_literal>")
    expect(po[5]).toEqual("HAPPY THURSDAY!")
    expect(po[6]).toEqual("<str_exp_end>")

    result = @parser.look_for('$U7=$U0+" AND ANY "+$U1+" THAT DOES NOT INCLUDE "+$U4', @syntax.line_number_rules[3])
    po = result.parse_object
    expect(po[0]).toEqual("<string_variable>")
    expect(po[1]).toEqual("U7")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<string_expression>")
    expect(po[4]).toEqual("<string_variable>")
    expect(po[5]).toEqual("U0")
    expect(po[6]).toEqual("<plus>")
    expect(po[7]).toEqual("<string_literal>")
    expect(po[8]).toEqual(" AND ANY ")
    expect(po[9]).toEqual("<plus>")
    expect(po[10]).toEqual("<string_variable>")
    expect(po[11]).toEqual("U1")
    expect(po[12]).toEqual("<plus>")
    expect(po[13]).toEqual("<string_literal>")
    expect(po[14]).toEqual(" THAT DOES NOT INCLUDE ")
    expect(po[15]).toEqual("<plus>")
    expect(po[16]).toEqual("<string_variable>")
    expect(po[17]).toEqual("U4")
    expect(po[18]).toEqual("<str_exp_end>")

    result = @parser.look_for('$B=$C', @syntax.line_number_rules[3])
    po = result.parse_object
    expect(po[0]).toEqual("<string_variable>")
    expect(po[1]).toEqual("B")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<string_expression>")
    expect(po[4]).toEqual("<string_variable>")
    expect(po[5]).toEqual("C")
    expect(po[6]).toEqual("<str_exp_end>")

    result = @parser.look_for('$E=$M+" IS NOT COMPLETE"', @syntax.line_number_rules[3])
    po = result.parse_object
    expect(po[0]).toEqual("<string_variable>")
    expect(po[1]).toEqual("E")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<string_expression>")
    expect(po[4]).toEqual("<string_variable>")
    expect(po[5]).toEqual("M")
    expect(po[6]).toEqual("<plus>")
    expect(po[7]).toEqual("<string_literal>")
    expect(po[8]).toEqual(" IS NOT COMPLETE")
    expect(po[9]).toEqual("<str_exp_end>")


  it "should correctly parse GOTO statements", ->

    result = @parser.look_for("GOTO 40", @syntax.line_number_rules[4])
    po = result.parse_object
    expect(po[0]).toEqual("<goto>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<line_number>")
    expect(po[3]).toEqual(40)

    result = @parser.look_for("GOTO 880", @syntax.line_number_rules[4])
    po = result.parse_object
    expect(po[0]).toEqual("<goto>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<line_number>")
    expect(po[3]).toEqual(880)

    result = @parser.look_for("GOTO 2470", @syntax.line_number_rules[4])
    po = result.parse_object
    expect(po[0]).toEqual("<goto>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<line_number>")
    expect(po[3]).toEqual(2470)


  it "should correctly parse GOSUB statements", ->

    result = @parser.look_for("GOSUB 60", @syntax.line_number_rules[5])
    po = result.parse_object
    expect(po[0]).toEqual("<gosub>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<line_number>")
    expect(po[3]).toEqual(60)

    result = @parser.look_for("GOSUB 200", @syntax.line_number_rules[5])
    po = result.parse_object
    expect(po[0]).toEqual("<gosub>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<line_number>")
    expect(po[3]).toEqual(200)

    result = @parser.look_for("GOSUB 2300", @syntax.line_number_rules[5])
    po = result.parse_object
    expect(po[0]).toEqual("<gosub>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<line_number>")
    expect(po[3]).toEqual(2300)


  it "should correctly parse return from GOSUB statements", ->

    result = @parser.look_for("RETURN", @syntax.line_number_rules[6])
    po = result.parse_object
    expect(po[0]).toEqual("<return>")


  it "should correctly parse IF statements", ->

    result = @parser.look_for("IF Z<0 THEN 340", @syntax.line_number_rules[7])
    po = result.parse_object
    expect(po[0]).toEqual("<if>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<boolean_expression>")
    expect(po[3]).toEqual("<number_variable>")
    expect(po[4]).toEqual("Z")
    expect(po[5]).toEqual("<lesser_than>")
    expect(po[6]).toEqual("<numeric_expression>")
    expect(po[7]).toEqual("<numeric_literal>")
    expect(po[8]).toEqual(0)
    expect(po[9]).toEqual("<num_exp_end>")
    expect(po[10]).toEqual("<bool_exp_end>")
    expect(po[11]).toEqual("<sp>")
    expect(po[12]).toEqual("<then>")
    expect(po[13]).toEqual("<sp>")
    expect(po[14]).toEqual("<line_number>")
    expect(po[15]).toEqual(340)

    result = @parser.look_for('IF $T="INCOMPLETE" THEN 1680', @syntax.line_number_rules[7])
    po = result.parse_object
    expect(po[0]).toEqual("<if>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<boolean_expression>")
    expect(po[3]).toEqual("<string_variable>")
    expect(po[4]).toEqual("T")
    expect(po[5]).toEqual("<equals>")
    expect(po[6]).toEqual("<string_expression>")
    expect(po[7]).toEqual("<string_literal>")
    expect(po[8]).toEqual("INCOMPLETE")
    expect(po[9]).toEqual("<str_exp_end>")
    expect(po[10]).toEqual("<bool_exp_end>")
    expect(po[11]).toEqual("<sp>")
    expect(po[12]).toEqual("<then>")
    expect(po[13]).toEqual("<sp>")
    expect(po[14]).toEqual("<line_number>")
    expect(po[15]).toEqual(1680)

    result = @parser.look_for("IF A>B THEN 750", @syntax.line_number_rules[7])
    po = result.parse_object
    expect(po[0]).toEqual("<if>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<boolean_expression>")
    expect(po[3]).toEqual("<number_variable>")
    expect(po[4]).toEqual("A")
    expect(po[5]).toEqual("<greater_than>")
    expect(po[6]).toEqual("<numeric_expression>")
    expect(po[7]).toEqual("<number_variable>")
    expect(po[8]).toEqual("B")
    expect(po[9]).toEqual("<num_exp_end>")
    expect(po[10]).toEqual("<bool_exp_end>")
    expect(po[11]).toEqual("<sp>")
    expect(po[12]).toEqual("<then>")
    expect(po[13]).toEqual("<sp>")
    expect(po[14]).toEqual("<line_number>")
    expect(po[15]).toEqual(750)

    result = @parser.look_for("IF N>=1000 THEN 930", @syntax.line_number_rules[7])
    po = result.parse_object
    expect(po[0]).toEqual("<if>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<boolean_expression>")
    expect(po[3]).toEqual("<number_variable>")
    expect(po[4]).toEqual("N")
    expect(po[5]).toEqual("<greater_equal>")
    expect(po[6]).toEqual("<numeric_expression>")
    expect(po[7]).toEqual("<numeric_literal>")
    expect(po[8]).toEqual(1000)
    expect(po[9]).toEqual("<num_exp_end>")
    expect(po[10]).toEqual("<bool_exp_end>")
    expect(po[11]).toEqual("<sp>")
    expect(po[12]).toEqual("<then>")
    expect(po[13]).toEqual("<sp>")
    expect(po[14]).toEqual("<line_number>")
    expect(po[15]).toEqual(930)



  it "should correctly parse INPUT statements", ->

    result = @parser.look_for("INPUT R", @syntax.line_number_rules[8])
    po = result.parse_object
    expect(po[0]).toEqual("<input>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<number_variable>")
    expect(po[3]).toEqual("R")


    result = @parser.look_for("INPUT $V", @syntax.line_number_rules[8])
    po = result.parse_object
    expect(po[0]).toEqual("<input>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string_variable>")
    expect(po[3]).toEqual("V")


    result = @parser.look_for('INPUT "HOW MANY?";M', @syntax.line_number_rules[8])
    po = result.parse_object
    expect(po[0]).toEqual("<input>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string>")
    expect(po[3]).toEqual("HOW MANY?")
    expect(po[4]).toEqual("<semicolon>")
    expect(po[5]).toEqual("<number_variable>")
    expect(po[6]).toEqual("M")

    result = @parser.look_for('INPUT "LAST NAME?";$N2', @syntax.line_number_rules[8])
    po = result.parse_object
    expect(po[0]).toEqual("<input>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string>")
    expect(po[3]).toEqual("LAST NAME?")
    expect(po[4]).toEqual("<semicolon>")
    expect(po[5]).toEqual("<string_variable>")
    expect(po[6]).toEqual("N2")


  it "should correctly parse PRINT statements", ->

    result = @parser.look_for('PRINT X', @syntax.line_number_rules[9])
    po = result.parse_object
    expect(po[0]).toEqual("<print>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<number_variable>")
    expect(po[3]).toEqual("X")

    result = @parser.look_for('PRINT "WELCOME TO GRANDPA BASIC 1980"', @syntax.line_number_rules[10])
    po = result.parse_object
    expect(po[0]).toEqual("<print>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string_expression>")
    expect(po[3]).toEqual("<string_literal>")
    expect(po[4]).toEqual("WELCOME TO GRANDPA BASIC 1980")
    expect(po[5]).toEqual("<str_exp_end>")

    result = @parser.look_for("PRINT $Z1", @syntax.line_number_rules[10])
    po = result.parse_object
    expect(po[0]).toEqual("<print>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string_expression>")
    expect(po[3]).toEqual("<string_variable>")
    expect(po[4]).toEqual("Z1")
    expect(po[5]).toEqual("<str_exp_end>")

    result = @parser.look_for('PRINT "LAST NAME = "+$N4', @syntax.line_number_rules[10])
    po = result.parse_object
    expect(po[0]).toEqual("<print>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string_expression>")
    expect(po[3]).toEqual("<string_literal>")
    expect(po[4]).toEqual("LAST NAME = ")
    expect(po[5]).toEqual("<plus>")
    expect(po[6]).toEqual("<string_variable>")
    expect(po[7]).toEqual("N4")
    expect(po[8]).toEqual("<str_exp_end>")

    result = @parser.look_for('PRINT $T+" : "+$T8+"/"+$T9', @syntax.line_number_rules[10])
    po = result.parse_object
    expect(po[0]).toEqual("<print>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string_expression>")
    expect(po[3]).toEqual("<string_variable>")
    expect(po[4]).toEqual("T")
    expect(po[5]).toEqual("<plus>")
    expect(po[6]).toEqual("<string_literal>")
    expect(po[7]).toEqual(" : ")
    expect(po[8]).toEqual("<plus>")
    expect(po[9]).toEqual("<string_variable>")
    expect(po[10]).toEqual("T8")
    expect(po[11]).toEqual("<plus>")
    expect(po[12]).toEqual("<string_literal>")
    expect(po[13]).toEqual("/")
    expect(po[14]).toEqual("<plus>")
    expect(po[15]).toEqual("<string_variable>")
    expect(po[16]).toEqual("T9")
    expect(po[17]).toEqual("<str_exp_end>")


  it "should correctly parse PRINTLN statements", ->

    result = @parser.look_for("PRINTLN", @syntax.line_number_rules[13])
    po = result.parse_object
    expect(po[0]).toEqual("<print_line>")

    result = @parser.look_for('PRINTLN X', @syntax.line_number_rules[11])
    po = result.parse_object
    expect(po[0]).toEqual("<print_line>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<number_variable>")
    expect(po[3]).toEqual("X")

    result = @parser.look_for('PRINTLN "WELCOME TO GRANDPA BASIC 1980"', @syntax.line_number_rules[12])
    po = result.parse_object
    expect(po[0]).toEqual("<print_line>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string_expression>")
    expect(po[3]).toEqual("<string_literal>")
    expect(po[4]).toEqual("WELCOME TO GRANDPA BASIC 1980")
    expect(po[5]).toEqual("<str_exp_end>")

    result = @parser.look_for("PRINTLN $Z1", @syntax.line_number_rules[12])
    po = result.parse_object
    expect(po[0]).toEqual("<print_line>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string_expression>")
    expect(po[3]).toEqual("<string_variable>")
    expect(po[4]).toEqual("Z1")
    expect(po[5]).toEqual("<str_exp_end>")

    result = @parser.look_for('PRINTLN "LAST NAME = "+$N4', @syntax.line_number_rules[12])
    po = result.parse_object
    expect(po[0]).toEqual("<print_line>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string_expression>")
    expect(po[3]).toEqual("<string_literal>")
    expect(po[4]).toEqual("LAST NAME = ")
    expect(po[5]).toEqual("<plus>")
    expect(po[6]).toEqual("<string_variable>")
    expect(po[7]).toEqual("N4")
    expect(po[8]).toEqual("<str_exp_end>")

    result = @parser.look_for('PRINTLN $T+" : "+$T8+"/"+$T9', @syntax.line_number_rules[12])
    po = result.parse_object
    expect(po[0]).toEqual("<print_line>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<string_expression>")
    expect(po[3]).toEqual("<string_variable>")
    expect(po[4]).toEqual("T")
    expect(po[5]).toEqual("<plus>")
    expect(po[6]).toEqual("<string_literal>")
    expect(po[7]).toEqual(" : ")
    expect(po[8]).toEqual("<plus>")
    expect(po[9]).toEqual("<string_variable>")
    expect(po[10]).toEqual("T8")
    expect(po[11]).toEqual("<plus>")
    expect(po[12]).toEqual("<string_literal>")
    expect(po[13]).toEqual("/")
    expect(po[14]).toEqual("<plus>")
    expect(po[15]).toEqual("<string_variable>")
    expect(po[16]).toEqual("T9")
    expect(po[17]).toEqual("<str_exp_end>")


  it "should correctly parse CLEARSCRN statements", ->

    result = @parser.look_for("CLEARSCRN", @syntax.line_number_rules[14])
    po = result.parse_object
    expect(po[0]).toEqual("<clear_screen>")


  it "should correctly parse TAB statements", ->

    result = @parser.look_for("TAB 0", @syntax.line_number_rules[16])
    po = result.parse_object
    expect(po[0]).toEqual("<tab>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<integer>")
    expect(po[3]).toEqual(0)

    result = @parser.look_for("TAB 28", @syntax.line_number_rules[16])
    po = result.parse_object
    expect(po[0]).toEqual("<tab>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<integer>")
    expect(po[3]).toEqual(28)

    result = @parser.look_for("TAB 12,44", @syntax.line_number_rules[15])
    po = result.parse_object
    expect(po[0]).toEqual("<tab>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<integer>")
    expect(po[3]).toEqual(12)
    expect(po[4]).toEqual("<comma>")
    expect(po[5]).toEqual("<integer>")
    expect(po[6]).toEqual(44)


  it "should correctly parse END statements", ->

    result = @parser.look_for("END", @syntax.line_number_rules[17])
    po = result.parse_object
    expect(po[0]).toEqual("<end>")
