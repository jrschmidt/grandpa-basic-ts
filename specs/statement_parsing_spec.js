// Generated by CoffeeScript 1.7.1
describe("Test statement line parsing", function() {
  beforeEach(function() {
    this.parser = new LineParser;
    return this.syntax = new SyntaxRules;
  });
  it("should correctly parse REM statements", function() {
    var po, result;
    result = this.parser.look_for("REM", this.syntax.line_number_rules[1]);
    po = result.parse_object;
    expect(po[0]).toEqual("<remark>");
    result = this.parser.look_for("REM WELCOME TO GRANDPA BASIC 1980", this.syntax.line_number_rules[0]);
    po = result.parse_object;
    expect(po[0]).toEqual("<remark>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<characters>");
    expect(po[3]).toEqual('WELCOME TO GRANDPA BASIC 1980');
    result = this.parser.look_for("REM **** - - - ****", this.syntax.line_number_rules[0]);
    po = result.parse_object;
    expect(po[0]).toEqual("<remark>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<characters>");
    expect(po[3]).toEqual('**** - - - ****');
    result = this.parser.look_for("REM PARSE LEFT SIDE BEFORE RIGHT SIDE", this.syntax.line_number_rules[0]);
    po = result.parse_object;
    expect(po[0]).toEqual("<remark>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<characters>");
    return expect(po[3]).toEqual('PARSE LEFT SIDE BEFORE RIGHT SIDE');
  });
  it("should correctly parse numeric assignment statements", function() {
    var po, result;
    result = this.parser.look_for("A0=X", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("A0");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<number_variable>");
    expect(po[4]).toEqual("X");
    result = this.parser.look_for("B=42", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("B");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<numeric_literal>");
    expect(po[4]).toEqual(42);
    result = this.parser.look_for("Z7=13.477", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("Z7");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<numeric_literal>");
    expect(po[4]).toEqual(13.477);
    result = this.parser.look_for("E=12/3", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("E");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<numeric_literal>");
    expect(po[4]).toEqual(12);
    expect(po[5]).toEqual("<divide>");
    expect(po[6]).toEqual("<numeric_literal>");
    expect(po[7]).toEqual(3);
    result = this.parser.look_for("D=477+B", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("D");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<numeric_literal>");
    expect(po[4]).toEqual(477);
    expect(po[5]).toEqual("<plus>");
    expect(po[6]).toEqual("<number_variable>");
    expect(po[7]).toEqual("B");
    result = this.parser.look_for("F1=C^2", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("F1");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<number_variable>");
    expect(po[4]).toEqual("C");
    expect(po[5]).toEqual("<power>");
    expect(po[6]).toEqual("<numeric_literal>");
    expect(po[7]).toEqual(2);
    result = this.parser.look_for("W=X*Y*Z", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("W");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<number_variable>");
    expect(po[4]).toEqual("X");
    expect(po[5]).toEqual("<times>");
    expect(po[6]).toEqual("<number_variable>");
    expect(po[7]).toEqual("Y");
    expect(po[8]).toEqual("<times>");
    expect(po[9]).toEqual("<number_variable>");
    expect(po[10]).toEqual("Z");
    result = this.parser.look_for("M=28*(J+2)", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("M");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<numeric_literal>");
    expect(po[4]).toEqual(28);
    expect(po[5]).toEqual("<times>");
    expect(po[6]).toEqual("<left>");
    expect(po[7]).toEqual("<number_variable>");
    expect(po[8]).toEqual("J");
    expect(po[9]).toEqual("<plus>");
    expect(po[10]).toEqual("<numeric_literal>");
    expect(po[11]).toEqual(2);
    expect(po[12]).toEqual("<right>");
    result = this.parser.look_for("L3=W5+W7-4*(J^2+K^3)", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("L3");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<number_variable>");
    expect(po[4]).toEqual("W5");
    expect(po[5]).toEqual("<plus>");
    expect(po[6]).toEqual("<number_variable>");
    expect(po[7]).toEqual("W7");
    expect(po[8]).toEqual("<minus>");
    expect(po[9]).toEqual("<numeric_literal>");
    expect(po[10]).toEqual(4);
    expect(po[11]).toEqual("<times>");
    expect(po[12]).toEqual("<left>");
    expect(po[13]).toEqual("<number_variable>");
    expect(po[14]).toEqual("J");
    expect(po[15]).toEqual("<power>");
    expect(po[16]).toEqual("<numeric_literal>");
    expect(po[17]).toEqual(2);
    expect(po[18]).toEqual("<plus>");
    expect(po[19]).toEqual("<number_variable>");
    expect(po[20]).toEqual("K");
    expect(po[21]).toEqual("<power>");
    expect(po[22]).toEqual("<numeric_literal>");
    expect(po[23]).toEqual(3);
    expect(po[24]).toEqual("<right>");
    result = this.parser.look_for("G=(18-Q7)/(2.108*(14*M+17*X))", this.syntax.line_number_rules[2]);
    po = result.parse_object;
    expect(po[0]).toEqual("<number_variable>");
    expect(po[1]).toEqual("G");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<left>");
    expect(po[4]).toEqual("<numeric_literal>");
    expect(po[5]).toEqual(18);
    expect(po[6]).toEqual("<minus>");
    expect(po[7]).toEqual("<number_variable>");
    expect(po[8]).toEqual("Q7");
    expect(po[9]).toEqual("<right>");
    expect(po[10]).toEqual("<divide>");
    expect(po[11]).toEqual("<left>");
    expect(po[12]).toEqual("<numeric_literal>");
    expect(po[13]).toEqual(2.108);
    expect(po[14]).toEqual("<times>");
    expect(po[15]).toEqual("<left>");
    expect(po[16]).toEqual("<numeric_literal>");
    expect(po[17]).toEqual(14);
    expect(po[18]).toEqual("<times>");
    expect(po[19]).toEqual("<number_variable>");
    expect(po[20]).toEqual("M");
    expect(po[21]).toEqual("<plus>");
    expect(po[22]).toEqual("<numeric_literal>");
    expect(po[23]).toEqual(17);
    expect(po[24]).toEqual("<times>");
    expect(po[25]).toEqual("<number_variable>");
    expect(po[26]).toEqual("X");
    expect(po[27]).toEqual("<right>");
    return expect(po[28]).toEqual("<right>");
  });
  it("should correctly parse string assignment statements", function() {
    var po, result;
    result = this.parser.look_for('$L="HAPPY THURSDAY!"', this.syntax.line_number_rules[3]);
    po = result.parse_object;
    expect(po[0]).toEqual("<string_variable>");
    expect(po[1]).toEqual("L");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<string_literal>");
    expect(po[4]).toEqual("HAPPY THURSDAY!");
    result = this.parser.look_for('$U7=$U0+" AND ANY "+$U1+" THAT DOES NOT INCLUDE "+$U4', this.syntax.line_number_rules[3]);
    po = result.parse_object;
    expect(po[0]).toEqual("<string_variable>");
    expect(po[1]).toEqual("U7");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<string_variable>");
    expect(po[4]).toEqual("U0");
    expect(po[5]).toEqual("<plus>");
    expect(po[6]).toEqual("<string_literal>");
    expect(po[7]).toEqual(" AND ANY ");
    expect(po[8]).toEqual("<plus>");
    expect(po[9]).toEqual("<string_variable>");
    expect(po[10]).toEqual("U1");
    expect(po[11]).toEqual("<plus>");
    expect(po[12]).toEqual("<string_literal>");
    expect(po[13]).toEqual(" THAT DOES NOT INCLUDE ");
    expect(po[14]).toEqual("<plus>");
    expect(po[15]).toEqual("<string_variable>");
    expect(po[16]).toEqual("U4");
    result = this.parser.look_for('$B=$C', this.syntax.line_number_rules[3]);
    po = result.parse_object;
    expect(po[0]).toEqual("<string_variable>");
    expect(po[1]).toEqual("B");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<string_variable>");
    expect(po[4]).toEqual("C");
    result = this.parser.look_for('$E=$M+" IS NOT COMPLETE"', this.syntax.line_number_rules[3]);
    po = result.parse_object;
    expect(po[0]).toEqual("<string_variable>");
    expect(po[1]).toEqual("E");
    expect(po[2]).toEqual("<equals>");
    expect(po[3]).toEqual("<string_variable>");
    expect(po[4]).toEqual("M");
    expect(po[5]).toEqual("<plus>");
    expect(po[6]).toEqual("<string_literal>");
    return expect(po[7]).toEqual(" IS NOT COMPLETE");
  });
  it("should correctly parse GOTO statements", function() {
    var po, result;
    result = this.parser.look_for("GOTO 40", this.syntax.line_number_rules[4]);
    po = result.parse_object;
    expect(po[0]).toEqual("<goto>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<line_number>");
    expect(po[3]).toEqual(40);
    result = this.parser.look_for("GOTO 880", this.syntax.line_number_rules[4]);
    po = result.parse_object;
    expect(po[0]).toEqual("<goto>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<line_number>");
    expect(po[3]).toEqual(880);
    result = this.parser.look_for("GOTO 2470", this.syntax.line_number_rules[4]);
    po = result.parse_object;
    expect(po[0]).toEqual("<goto>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<line_number>");
    return expect(po[3]).toEqual(2470);
  });
  it("should correctly parse GOSUB statements", function() {
    var po, result;
    result = this.parser.look_for("GOSUB 60", this.syntax.line_number_rules[5]);
    po = result.parse_object;
    expect(po[0]).toEqual("<gosub>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<line_number>");
    expect(po[3]).toEqual(60);
    result = this.parser.look_for("GOSUB 200", this.syntax.line_number_rules[5]);
    po = result.parse_object;
    expect(po[0]).toEqual("<gosub>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<line_number>");
    expect(po[3]).toEqual(200);
    result = this.parser.look_for("GOSUB 2300", this.syntax.line_number_rules[5]);
    po = result.parse_object;
    expect(po[0]).toEqual("<gosub>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<line_number>");
    return expect(po[3]).toEqual(2300);
  });
  it("should correctly parse return from GOSUB statements", function() {
    var po, result;
    result = this.parser.look_for("RETURN", this.syntax.line_number_rules[6]);
    po = result.parse_object;
    return expect(po[0]).toEqual("<return>");
  });
  it("should correctly parse IF statements", function() {
    var po, result;
    result = this.parser.look_for("IF Z<0 THEN 340", this.syntax.line_number_rules[7]);
    po = result.parse_object;
    expect(po[0]).toEqual("<if>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<number_variable>");
    expect(po[3]).toEqual("Z");
    expect(po[4]).toEqual("<lesser_than>");
    expect(po[5]).toEqual("<numeric_literal>");
    expect(po[6]).toEqual(0);
    expect(po[7]).toEqual("<sp>");
    expect(po[8]).toEqual("<then>");
    expect(po[9]).toEqual("<sp>");
    expect(po[10]).toEqual("<line_number>");
    expect(po[11]).toEqual(340);
    result = this.parser.look_for('IF $T="INCOMPLETE" THEN 1680', this.syntax.line_number_rules[7]);
    po = result.parse_object;
    expect(po[0]).toEqual("<if>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_variable>");
    expect(po[3]).toEqual("T");
    expect(po[4]).toEqual("<equals>");
    expect(po[5]).toEqual("<string_literal>");
    expect(po[6]).toEqual("INCOMPLETE");
    expect(po[7]).toEqual("<sp>");
    expect(po[8]).toEqual("<then>");
    expect(po[9]).toEqual("<sp>");
    expect(po[10]).toEqual("<line_number>");
    expect(po[11]).toEqual(1680);
    result = this.parser.look_for("IF A>B THEN 750", this.syntax.line_number_rules[7]);
    po = result.parse_object;
    expect(po[0]).toEqual("<if>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<number_variable>");
    expect(po[3]).toEqual("A");
    expect(po[4]).toEqual("<greater_than>");
    expect(po[5]).toEqual("<number_variable>");
    expect(po[6]).toEqual("B");
    expect(po[7]).toEqual("<sp>");
    expect(po[8]).toEqual("<then>");
    expect(po[9]).toEqual("<sp>");
    expect(po[10]).toEqual("<line_number>");
    expect(po[11]).toEqual(750);
    result = this.parser.look_for("IF N>=1000 THEN 930", this.syntax.line_number_rules[7]);
    po = result.parse_object;
    expect(po[0]).toEqual("<if>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<number_variable>");
    expect(po[3]).toEqual("N");
    expect(po[4]).toEqual("<greater_equal>");
    expect(po[5]).toEqual("<numeric_literal>");
    expect(po[6]).toEqual(1000);
    expect(po[7]).toEqual("<sp>");
    expect(po[8]).toEqual("<then>");
    expect(po[9]).toEqual("<sp>");
    expect(po[10]).toEqual("<line_number>");
    return expect(po[11]).toEqual(930);
  });
  it("should correctly parse INPUT statements", function() {
    var po, result;
    result = this.parser.look_for("INPUT R", this.syntax.line_number_rules[8]);
    po = result.parse_object;
    expect(po[0]).toEqual("<input>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<number_variable>");
    expect(po[3]).toEqual("R");
    result = this.parser.look_for("INPUT $V", this.syntax.line_number_rules[8]);
    po = result.parse_object;
    expect(po[0]).toEqual("<input>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_variable>");
    expect(po[3]).toEqual("V");
    result = this.parser.look_for('INPUT "HOW MANY?";M', this.syntax.line_number_rules[8]);
    po = result.parse_object;
    expect(po[0]).toEqual("<input>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string>");
    expect(po[3]).toEqual("HOW MANY?");
    expect(po[4]).toEqual("<semicolon>");
    expect(po[5]).toEqual("<number_variable>");
    expect(po[6]).toEqual("M");
    result = this.parser.look_for('INPUT "LAST NAME?";$N2', this.syntax.line_number_rules[8]);
    po = result.parse_object;
    expect(po[0]).toEqual("<input>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string>");
    expect(po[3]).toEqual("LAST NAME?");
    expect(po[4]).toEqual("<semicolon>");
    expect(po[5]).toEqual("<string_variable>");
    return expect(po[6]).toEqual("N2");
  });
  it("should correctly parse PRINT statements", function() {
    var po, result;
    result = this.parser.look_for('PRINT "WELCOME TO GRANDPA BASIC 1980"', this.syntax.line_number_rules[9]);
    po = result.parse_object;
    expect(po[0]).toEqual("<print>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_literal>");
    expect(po[3]).toEqual("WELCOME TO GRANDPA BASIC 1980");
    result = this.parser.look_for("PRINT $Z1", this.syntax.line_number_rules[9]);
    po = result.parse_object;
    expect(po[0]).toEqual("<print>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_variable>");
    expect(po[3]).toEqual("Z1");
    result = this.parser.look_for('PRINT "LAST NAME = "+$N4', this.syntax.line_number_rules[9]);
    po = result.parse_object;
    expect(po[0]).toEqual("<print>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_literal>");
    expect(po[3]).toEqual("LAST NAME = ");
    expect(po[4]).toEqual("<plus>");
    expect(po[5]).toEqual("<string_variable>");
    expect(po[6]).toEqual("N4");
    result = this.parser.look_for('PRINT $T+" : "+$T8+"/"+$T9', this.syntax.line_number_rules[9]);
    po = result.parse_object;
    expect(po[0]).toEqual("<print>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_variable>");
    expect(po[3]).toEqual("T");
    expect(po[4]).toEqual("<plus>");
    expect(po[5]).toEqual("<string_literal>");
    expect(po[6]).toEqual(" : ");
    expect(po[7]).toEqual("<plus>");
    expect(po[8]).toEqual("<string_variable>");
    expect(po[9]).toEqual("T8");
    expect(po[10]).toEqual("<plus>");
    expect(po[11]).toEqual("<string_literal>");
    expect(po[12]).toEqual("/");
    expect(po[13]).toEqual("<plus>");
    expect(po[14]).toEqual("<string_variable>");
    return expect(po[15]).toEqual("T9");
  });
  it("should correctly parse PRINTLN statements", function() {
    var po, result;
    result = this.parser.look_for("PRINTLN", this.syntax.line_number_rules[11]);
    po = result.parse_object;
    expect(po[0]).toEqual("<println>");
    result = this.parser.look_for('PRINTLN "WELCOME TO GRANDPA BASIC 1980"', this.syntax.line_number_rules[10]);
    po = result.parse_object;
    expect(po[0]).toEqual("<println>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_literal>");
    expect(po[3]).toEqual("WELCOME TO GRANDPA BASIC 1980");
    result = this.parser.look_for("PRINTLN $Z1", this.syntax.line_number_rules[10]);
    po = result.parse_object;
    expect(po[0]).toEqual("<println>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_variable>");
    expect(po[3]).toEqual("Z1");
    result = this.parser.look_for('PRINTLN "LAST NAME = "+$N4', this.syntax.line_number_rules[10]);
    po = result.parse_object;
    expect(po[0]).toEqual("<println>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_literal>");
    expect(po[3]).toEqual("LAST NAME = ");
    expect(po[4]).toEqual("<plus>");
    expect(po[5]).toEqual("<string_variable>");
    expect(po[6]).toEqual("N4");
    result = this.parser.look_for('PRINTLN $T+" : "+$T8+"/"+$T9', this.syntax.line_number_rules[10]);
    po = result.parse_object;
    expect(po[0]).toEqual("<println>");
    expect(po[1]).toEqual("<sp>");
    expect(po[2]).toEqual("<string_variable>");
    expect(po[3]).toEqual("T");
    expect(po[4]).toEqual("<plus>");
    expect(po[5]).toEqual("<string_literal>");
    expect(po[6]).toEqual(" : ");
    expect(po[7]).toEqual("<plus>");
    expect(po[8]).toEqual("<string_variable>");
    expect(po[9]).toEqual("T8");
    expect(po[10]).toEqual("<plus>");
    expect(po[11]).toEqual("<string_literal>");
    expect(po[12]).toEqual("/");
    expect(po[13]).toEqual("<plus>");
    expect(po[14]).toEqual("<string_variable>");
    return expect(po[15]).toEqual("T9");
  });
  it("should correctly parse CLEARSCRN statements", function() {
    var po, result;
    result = this.parser.look_for("CLEARSCRN", this.syntax.line_number_rules[12]);
    po = result.parse_object;
    return expect(po[0]).toEqual("<clear_screen>");
  });
  return xit("should correctly parse ??? statements", function() {
    var po, result;
    result = this.parser.look_for("", this.syntax.line_number_rules[0]);
    po = result.parse_object;
    return expect(po[0]).toEqual("");
  });
});
