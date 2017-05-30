GB80 = require('../gb80');
BooleanExpressionBuilder = GB80.BooleanExpressionBuilder;
NumericExpressionBuilder = GB80.BooleanExpressionBuilder;
StringExpressionBuilder = GB80.BooleanExpressionBuilder;

describe('Boolean expression builder', function() {

  it('should build a usable boolean expression object from the parse stack array', function() {
    var result, stack;

    numericBuilder = new NumericExpressionBuilder;
    stringBuilder = new StringExpressionBuilder;
    this.builder = new BooleanExpressionBuilder(numericBuilder, stringBuilder);


    // EXPRESSION: Z < 0

    stack = [
      '<boolean_expression>',
      '<numeric_variable>',
      'Z',
      '<number_lesser_than>',
      '<numeric_expression>',
      '<numeric_literal>',
      0,
      '<num_exp_end>',
      '<bool_exp_end>'
    ];

    result = this.builder.buildBooleanExpression(stack);
    expect(result.comparator).toEqual('<number_lesser_than>');
    expect(result.variable).toEqual('Z');
    expect(result.expression.tag).toEqual('<numeric_literal>');
    expect(result.expression.value).toEqual(0);


    // EXPRESSION: $W = 'TOMORROW'

    stack = [
      '<boolean_expression>',
      '<string_variable>',
      'W',
      '<string_equals>',
      '<string_expression>',
      '<string_literal>',
      'TOMORROW',
      '<str_exp_end>',
      '<bool_exp_end>'
    ];

    result = this.builder.buildBooleanExpression(stack);
    expect(result.comparator).toEqual('<string_equals>');
    expect(result.variable).toEqual('W');
    expect(result.expression[0].tag).toEqual('<string_literal>');
    expect(result.expression[0].value).toEqual('TOMORROW');


    // EXPRESSION: N >= 20

    stack = [
      '<boolean_expression>',
      '<numeric_variable>',
      'N',
      '<number_greater_equal>',
      '<numeric_expression>',
      '<numeric_literal>',
      20,
      '<num_exp_end>',
      '<bool_exp_end>'
    ];

    result = this.builder.buildBooleanExpression(stack);
    expect(result.comparator).toEqual('<number_greater_equal>');
    expect(result.variable).toEqual('N');
    expect(result.expression.tag).toEqual('<numeric_literal>');
    expect(result.expression.value).toEqual(20);


    // EXPRESSION: Q = 7

    stack = [
      '<boolean_expression>',
      '<numeric_variable>',
      'Q',
      '<number_equals>',
      '<numeric_expression>',
      '<numeric_literal>',
      7,
      '<num_exp_end>',
      '<bool_exp_end>'
    ];

    result = this.builder.buildBooleanExpression(stack);
    expect(result.comparator).toEqual('<number_equals>');
    expect(result.variable).toEqual('Q');
    expect(result.expression.tag).toEqual('<numeric_literal>');
    expect(result.expression.value).toEqual(7);


    // EXPRESSION: L4 >= L5

    stack = [
      '<boolean_expression>',
      '<numeric_variable>',
      'L4',
      '<number_greater_equal>',
      '<numeric_expression>',
      '<numeric_variable>',
      'L5',
      '<num_exp_end>',
      '<bool_exp_end>'
    ];

    result = this.builder.buildBooleanExpression(stack);
    expect(result.comparator).toEqual('<number_greater_equal>');
    expect(result.variable).toEqual('L4');
    expect(result.expression.tag).toEqual('<numeric_variable>');
    expect(result.expression.name).toEqual('L5');


    // EXPRESSION: V <= P + 4

    stack = [
      '<boolean_expression>',
      '<numeric_variable>',
      'V',
      '<number_lesser_equal>',
      '<numeric_expression>',
      '<numeric_variable>',
      'P',
      '<plus>',
      '<numeric_literal>',
      4,
      '<num_exp_end>',
      '<bool_exp_end>'
    ];

    result = this.builder.buildBooleanExpression(stack);
    expect(result.comparator).toEqual('<number_lesser_equal>');
    expect(result.variable).toEqual('V');
    expect(result.expression.tag).toEqual('<plus>');
    expect(result.expression.op1.tag).toEqual('<numeric_variable>');
    expect(result.expression.op1.name).toEqual('P');
    expect(result.expression.op2.tag).toEqual('<numeric_literal>');
    expect(result.expression.op2.value).toEqual(4);


    // EXPRESSION: $H <> 'YES'

    stack = [
      '<boolean_expression>',
      '<string_variable>',
      'H',
      '<string_not_equal>',
      '<string_expression>',
      '<string_literal>',
      'YES',
      '<str_exp_end>',
      '<bool_exp_end>'
    ];

    result = this.builder.buildBooleanExpression(stack);
    expect(result.comparator).toEqual('<string_not_equal>');
    expect(result.variable).toEqual('H');
    expect(result.expression[0].tag).toEqual('<string_literal>');
    expect(result.expression[0].value).toEqual('YES');


    // EXPRESSION: A <> B

    stack = [
      '<boolean_expression>',
      '<numeric_variable>',
      'A',
      '<number_not_equal>',
      '<numeric_expression>',
      '<numeric_variable>',
      'B',
      '<num_exp_end>',
      '<bool_exp_end>'
    ];

    result = this.builder.buildBooleanExpression(stack);
    expect(result.comparator).toEqual('<number_not_equal>');
    expect(result.variable).toEqual('A');
    expect(result.expression.tag).toEqual('<numeric_variable>');
    expect(result.expression.name).toEqual('B');

  });

});
