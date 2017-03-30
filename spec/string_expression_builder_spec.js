GB80 = require('../gb80');
StringExpressionBuilder = GB80.StringExpressionBuilder;

describe("String expression builder", function() {

  return it("should build a usable key-value object from a string expression 'parse object' array", function() {
    strExpBuilder = new StringExpressionBuilder();
    stack = [];
    expected = [];


    // {0}  SPLIT:  "HAPPY THURSDAY!"

    stack[0] = [
      "<string_expression>",
      "<string_literal>",
      "HAPPY THURSDAY!",
      "<str_exp_end>"
    ];

    expected[0] = [
      ["<str>", "HAPPY THURSDAY!"]
    ];


    // {1}  SPLIT:  $R7

    stack[1] = [
      "<string_expression>",
      "<string_variable>",
      "R7",
      "<str_exp_end>"
    ];

    expected[1] = [
      ["<var>", "R7"]
    ];


    // {2}  SPLIT:  $M+" IS NOT THE CORRECT ANSWER"

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
      ["<var>", "M"],
      ["<str>", " IS NOT THE CORRECT ANSWER"]
    ];


    // {3}  SPLIT:  $J0+" AND ANY "+$H1+" WITH "+$H4'

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
      ["<var>", "J0"],
      ["<str>", " AND ANY "],
      ["<var>", "H1"],
      ["<str>", " WITH "],
      ["<var>", "H4"]
    ];

    for (n=0;n<=3;n++) {
      result = strExpBuilder.buildStringExpression(stack[n]);
      expt = expected[n];
      for (k=0;k<=expt.length-1;k++) {
        expect(result[k][0]).toEqual(expt[k][0]);
        expect(result[k][1]).toEqual(expt[k][1]);
      }
    }


  });

});
