describe "Test statement line parsing", ->

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
    expect(po[3]).toEqual("<number_variable>")
    expect(po[4]).toEqual("X")

    result = @parser.look_for("B=42", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("B")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_literal>")
    expect(po[4]).toEqual(42)

    result = @parser.look_for("Z7=13.477", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("Z7")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_literal>")
    expect(po[4]).toEqual(13.477)

    result = @parser.look_for("E=12/3", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("E")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_literal>")
    expect(po[4]).toEqual(12)
    expect(po[5]).toEqual("<divide>")
    expect(po[6]).toEqual("<numeric_literal>")
    expect(po[7]).toEqual(3)

    result = @parser.look_for("D=477+B", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("D")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_literal>")
    expect(po[4]).toEqual(477)
    expect(po[5]).toEqual("<plus>")
    expect(po[6]).toEqual("<number_variable>")
    expect(po[7]).toEqual("B")

    result = @parser.look_for("F1=C^2", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("F1")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<number_variable>")
    expect(po[4]).toEqual("C")
    expect(po[5]).toEqual("<power>")
    expect(po[6]).toEqual("<numeric_literal>")
    expect(po[7]).toEqual(2)

    result = @parser.look_for("W=X*Y*Z", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("W")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<number_variable>")
    expect(po[4]).toEqual("X")
    expect(po[5]).toEqual("<times>")
    expect(po[6]).toEqual("<number_variable>")
    expect(po[7]).toEqual("Y")
    expect(po[8]).toEqual("<times>")
    expect(po[9]).toEqual("<number_variable>")
    expect(po[10]).toEqual("Z")

    result = @parser.look_for("M=28*(J+2)", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("M")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<numeric_literal>")
    expect(po[4]).toEqual(28)
    expect(po[5]).toEqual("<times>")
    expect(po[6]).toEqual("<left>")
    expect(po[7]).toEqual("<number_variable>")
    expect(po[8]).toEqual("J")
    expect(po[9]).toEqual("<plus>")
    expect(po[10]).toEqual("<numeric_literal>")
    expect(po[11]).toEqual(2)
    expect(po[12]).toEqual("<right>")

    result = @parser.look_for("L3=W5+W7-4*(J^2+K^3)", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("L3")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<number_variable>")
    expect(po[4]).toEqual("W5")
    expect(po[5]).toEqual("<plus>")
    expect(po[6]).toEqual("<number_variable>")
    expect(po[7]).toEqual("W7")
    expect(po[8]).toEqual("<minus>")
    expect(po[9]).toEqual("<numeric_literal>")
    expect(po[10]).toEqual(4)
    expect(po[11]).toEqual("<times>")
    expect(po[12]).toEqual("<left>")
    expect(po[13]).toEqual("<number_variable>")
    expect(po[14]).toEqual("J")
    expect(po[15]).toEqual("<power>")
    expect(po[16]).toEqual("<numeric_literal>")
    expect(po[17]).toEqual(2)
    expect(po[18]).toEqual("<plus>")
    expect(po[19]).toEqual("<number_variable>")
    expect(po[20]).toEqual("K")
    expect(po[21]).toEqual("<power>")
    expect(po[22]).toEqual("<numeric_literal>")
    expect(po[23]).toEqual(3)
    expect(po[24]).toEqual("<right>")

    result = @parser.look_for("G=(18-Q7)/(2.108*(14*M+17*X))", @syntax.line_number_rules[2])
    po = result.parse_object
    expect(po[0]).toEqual("<number_variable>")
    expect(po[1]).toEqual("G")
    expect(po[2]).toEqual("<equals>")
    expect(po[3]).toEqual("<left>")
    expect(po[4]).toEqual("<numeric_literal>")
    expect(po[5]).toEqual(18)
    expect(po[6]).toEqual("<minus>")
    expect(po[7]).toEqual("<number_variable>")
    expect(po[8]).toEqual("Q7")
    expect(po[9]).toEqual("<right>")
    expect(po[10]).toEqual("<divide>")
    expect(po[11]).toEqual("<left>")
    expect(po[12]).toEqual("<numeric_literal>")
    expect(po[13]).toEqual(2.108)
    expect(po[14]).toEqual("<times>")
    expect(po[15]).toEqual("<left>")
    expect(po[16]).toEqual("<numeric_literal>")
    expect(po[17]).toEqual(14)
    expect(po[18]).toEqual("<times>")
    expect(po[19]).toEqual("<number_variable>")
    expect(po[20]).toEqual("M")
    expect(po[21]).toEqual("<plus>")
    expect(po[22]).toEqual("<numeric_literal>")
    expect(po[23]).toEqual(17)
    expect(po[24]).toEqual("<times>")
    expect(po[25]).toEqual("<number_variable>")
    expect(po[26]).toEqual("X")
    expect(po[27]).toEqual("<right>")
    expect(po[28]).toEqual("<right>")



