GB80 = require('../gb80');
StringExpressionBuilder = GB80.StringExpressionBuilder;

describe("String expression builder", function() {

  return it("should build a usable key-value object from a string expression 'parse object' array", function() {
    builder = new StringExpressionBuilder();
    stack = [];
    expected = [];


    stack[0] = [
      "<string_expression>",
      "<string_literal>",
      "HAPPY THURSDAY!",
      "<str_exp_end>"
    ];

    expected[0] = [
      {
        tag: '<string_literal>',
        value: 'HAPPY THURSDAY!'
      }
    ];


    stack[1] = [
      "<string_expression>",
      "<string_variable>",
      "R7",
      "<str_exp_end>"
    ];

    expected[1] = [
      {
        tag: '<string_variable>',
        name: 'R7'
      },
    ];


    stack[2] = [
      "<string_expression>",
      "<string_variable>",
      "M",
      "<plus>",
      "<string_literal>",
      " IS NOT THE CORRECT ANSWER",
      "<str_exp_end>"
    ];

    expected[2] = [
      {
        tag: '<string_variable>',
        name: 'M'
      },
      {
        tag: '<string_literal>',
        value: ' IS NOT THE CORRECT ANSWER'
      },
    ];


    stack[3] = [
      "<string_expression>",
      "<string_variable>",
      "J0",
      "<plus>",
      "<string_literal>",
      " AND ANY ",
      "<plus>",
      "<string_variable>",
      "H1",
      "<plus>",
      "<string_literal>",
      " WITH ",
      "<plus>",
      "<string_variable>",
      "H4",
      "<str_exp_end>"
    ];

    expected[3] = [
      {
        tag: '<string_variable>',
        name: 'J0'
      },
      {
        tag: '<string_literal>',
        value: ' AND ANY '
      },
      {
        tag: '<string_variable>',
        name: 'H1'
      },
      {
        tag: '<string_literal>',
        value: ' WITH '
      },
      {
        tag: '<string_variable>',
        name: 'H4'
      },
    ];

    for (n=0;n<=3;n++) {
      result = builder.buildStringExpression(stack[n]);
      expt = expected[n];
      for (k=0;k<=expt.length-1;k++) {
        expect(result[k][0]).toEqual(expt[k][0]);
        expect(result[k][1]).toEqual(expt[k][1]);
      }
    }


  });

});
