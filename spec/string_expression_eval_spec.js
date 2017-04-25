GB80 = require('../gb80');
StringExpressionEvaluator = GB80.StringExpressionEvaluator;
StringVariableRegister = GB80.StringVariableRegister;

xdescribe("String expression concatenator", function() {

  beforeEach(function() {
    this.register = new StringVariableRegister;
    this.evaluator = new StringExpressionEvaluator(this.register);
  });


  it("should evaluate a string literal", function() {
    var expression, result;

    expression = [ ["<str>", "HELLO"] ];
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual("HELLO");

    expression = [ ["<str>", "THE SUM IS "] ];
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual("THE SUM IS ");

    expression = [ ["<str>", "JAMES"] ];
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual("JAMES");

  });


  it("should evaluate a reference to a string variable", function() {
    var expression, result;

    expression = [ ["<var>", "Q4"] ];
    this.register.set("Q4", "BRANCHES");
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual("BRANCHES");

    expression = [ ["<var>", "D"] ];
    this.register.set("D", "FRIDAY");
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual("FRIDAY");

    expression = [ ["<var>", "Y8"] ];
    this.register.set("Y8", "TURTLES AND RABBITS");
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual("TURTLES AND RABBITS");

  });


  it("should evaluate a multi-part string expression", function() {
    var expression, result;

    expression = [
      ["<var>", "Z"],
      ["<str>", "BYTES IN FILE"]
    ];
    this.register.set("Z", "NO ");
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual("NO BYTES IN FILE");

    expression = [
      ["<var>", "C1"],
      ["<str>", " WITH "],
      ["<var>", "C2"],
      ["<str>", " OR "],
      ["<var>", "C3"]
    ];
    this.register.set("C1", "POLYGONS");
    this.register.set("C2", "DOTS");
    this.register.set("C3", "TINY CIRCLES");
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual("POLYGONS WITH DOTS OR TINY CIRCLES");

  });

});
