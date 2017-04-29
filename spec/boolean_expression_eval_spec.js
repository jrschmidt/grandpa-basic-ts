GB80 = require('../gb80');
BooleanExpressionEvaluator = GB80.BooleanExpressionEvaluator;
NumericExpressionEvaluator = GB80.NumericExpressionEvaluator;
StringExpressionEvaluator = GB80.StringExpressionEvaluator;
NumericVariableRegister = GB80.NumericVariableRegister;
StringVariableRegister = GB80.StringVariableRegister;

describe("Boolean expression evaluator", function() {

  beforeEach(function() {
    this.numericRegister = new NumericVariableRegister;
    this.stringRegister = new StringVariableRegister;
    this.numericEvaluator = new NumericExpressionEvaluator(this.numericRegister);
    this.stringEvaluator = new StringExpressionEvaluator(this.stringRegister);

    this.evaluator = new BooleanExpressionEvaluator(
      this.numericRegister,
      this.stringRegister,
      this.numericEvaluator,
      this.stringEvaluator
    );

  });


  it("should compare two numbers to determine if one is greater or lesser", function() {

    result = this.evaluator.numericCompare(0, 0);
    expect(result).toEqual('<equal>');

    result = this.evaluator.numericCompare(17, 3);
    expect(result).toEqual('<greater>');

    result = this.evaluator.numericCompare(3, 17);
    expect(result).toEqual('<lesser>');

    result = this.evaluator.numericCompare(6, 344.8);
    expect(result).toEqual('<lesser>');

    result = this.evaluator.numericCompare(6, 3.448);
    expect(result).toEqual('<greater>');

    result = this.evaluator.numericCompare(29, -29);
    expect(result).toEqual('<greater>');

    result = this.evaluator.numericCompare(-29, 29);
    expect(result).toEqual('<lesser>');

    result = this.evaluator.numericCompare(3.1416, 3.1416);
    expect(result).toEqual('<equal>');

    result = this.evaluator.numericCompare(0, 1);
    expect(result).toEqual('<lesser>');

    result = this.evaluator.numericCompare(1, 0);
    expect(result).toEqual('<greater>');

    result = this.evaluator.numericCompare(0, -1);
    expect(result).toEqual('<greater>');

    result = this.evaluator.numericCompare(-1, 0);
    expect(result).toEqual('<lesser>');

    result = this.evaluator.numericCompare(0.003, 0);
    expect(result).toEqual('<greater>');

    result = this.evaluator.numericCompare(0, 0.003);
    expect(result).toEqual('<lesser>');

    result = this.evaluator.numericCompare(18.724, 18.724);
    expect(result).toEqual('<equal>');

    result = this.evaluator.numericCompare(18.725, 18.724);
    expect(result).toEqual('<greater>');

    result = this.evaluator.numericCompare(18.724, 18.725);
    expect(result).toEqual('<lesser>');

    result = this.evaluator.numericCompare(-9, -9);
    expect(result).toEqual('<equal>');

  });



  it("should compare two strings to determine if they are equal", function() {

    result = this.evaluator.stringCompare('A', 'A');
    expect(result).toEqual('<equal>');

    result = this.evaluator.stringCompare('A', 'B');
    expect(result).toEqual('<not_equal>');

    result = this.evaluator.stringCompare('APPLES', 'ORANGES');
    expect(result).toEqual('<not_equal>');

    result = this.evaluator.stringCompare('FRUIT', 'FRUIT');
    expect(result).toEqual('<equal>');

    result = this.evaluator.stringCompare(' ', '');
    expect(result).toEqual('<not_equal>');

    result = this.evaluator.stringCompare(';', ';');
    expect(result).toEqual('<equal>');

    result = this.evaluator.stringCompare('?', '*');
    expect(result).toEqual('<not_equal>');

    result = this.evaluator.stringCompare('HELLO', 'HELLO');
    expect(result).toEqual('<equal>');

    result = this.evaluator.stringCompare('HELLO', 'HELLO     ');
    expect(result).toEqual('<not_equal>');

    result = this.evaluator.stringCompare('HELLO', '');
    expect(result).toEqual('<not_equal>');

    result = this.evaluator.stringCompare('HELLO', 'GOODBY');
    expect(result).toEqual('<not_equal>');

    result = this.evaluator.stringCompare('NO', 'YES');
    expect(result).toEqual('<not_equal>');

    result = this.evaluator.stringCompare('A LONG PHRASE', 'A LONGER PHRASE');
    expect(result).toEqual('<not_equal>');

    result = this.evaluator.stringCompare('A LONGER PHRASE', 'A LONGER PHRASE');
    expect(result).toEqual('<equal>');

    result = this.evaluator.stringCompare('THIS IS THE END.', 'THIS IS, THE END.');
    expect(result).toEqual('<not_equal>');

  });



  it("should calculate the value of a boolean expression", function() {


    // EXPRESSION: Z < 0

    expression = {
      comparator: '<number_lesser_than>',
      variable: 'Z',
      expression: {tag: '<numeric_literal>', value: 0}
    }

    this.numericRegister.set("Z", -7);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.numericRegister.set("Z", 49.208);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(false);


    // EXPRESSION: $W = 'TOMORROW'

    expression = {
      comparator: '<string_equals>',
      variable: 'W',
      expression: [ {tag: '<string_literal>', value: 'TOMORROW'} ]
    }

    this.stringRegister.set("W", "TOMORROW");
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.stringRegister.set("W", "YESTERDAY");
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(false);


    // EXPRESSION: N >= 20

    expression = {
      comparator: '<number_greater_equal>',
      variable: 'N',
      expression: {tag: '<numeric_literal>', value: 20}
    }

    this.numericRegister.set("N", 206);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.numericRegister.set("N", 20);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.numericRegister.set("N", 6);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(false);


    // EXPRESSION: Q = 7

    expression = {
      comparator: '<number_equals>',
      variable: 'Q',
      expression: {tag: '<numeric_literal>', value: 7}
    }

    this.numericRegister.set("Q", 7);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.numericRegister.set("Q", 3);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(false);

    this.numericRegister.set("Q", 47);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(false);


    // EXPRESSION: L4 > L5

    expression = {
      comparator: '<number_greater_than>',
      variable: 'L4',
      expression: {tag: '<numeric_variable>', name: 'L5'}
    }

    this.numericRegister.set("L4", 1677);
    this.numericRegister.set("L5", 1340);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.numericRegister.set("L4", 1340);
    this.numericRegister.set("L5", 1677);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(false);


    // EXPRESSION: V <= P + 4

    expression = {
      comparator: '<number_lesser_equal>',
      variable: 'V',
      expression: {
        tag: '<plus>',
        op1: {tag: '<numeric_variable>', name: 'P'},
        op2: {tag: '<numeric_literal>', value: 4}
      }
    }

    this.numericRegister.set("V", 15);

    this.numericRegister.set("P", 5);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(false);

    this.numericRegister.set("P", 15);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.numericRegister.set("P", 25);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);


    // EXPRESSION: $H <> 'YES'

    expression = {
      comparator: '<string_not_equal>',
      variable: 'H',
      expression: [ {tag: '<string_literal>', value: 'YES'} ]
    }

    this.stringRegister.set("H", "NO");
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.stringRegister.set("H", "YES");
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(false);


    // EXPRESSION: A <> B

    expression = {
      comparator: '<number_not_equal>',
      variable: 'A',
      expression: {tag: '<numeric_variable>', name: 'B'}
    }

    this.numericRegister.set("A", 99);

    this.numericRegister.set("B", 98);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.numericRegister.set("B", 2);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(true);

    this.numericRegister.set("B", 99);
    result = this.evaluator.evaluate(expression);
    expect(result).toEqual(false);

  });

});
