describe "Numeric expression builder", ->

  beforeEach ->
    @builder = new NumExpBuilder

  it "should strip parentheses in an expression and replace them with nested arrays of tokens", ->

    # TEST  (J+K)
    stack = [
      "<left>"
      "<number_variable>"
      "J"
      "<plus>"
      "<number_variable>"
      "K"
      "<right>" ]

    result = @builder.deparenthesize(stack)
    expect(result.length).toEqual(5)
    expect(result[0]).toEqual("<number_variable>")
    expect(result[1]).toEqual("J")
    expect(result[2]).toEqual("<plus>")
    expect(result[3]).toEqual("<number_variable>")
    expect(result[4]).toEqual("K")


    # TEST  1+(4*A*C)/B
    stack = [
      "<numeric_literal>"
      1
      "<plus>"
      "<left>"
      "<numeric_literal>"
      4
      "<times>"
      "<number_variable>"
      "A"
      "<times>"
      "<number_variable>"
      "C"
      "<right>"
      "<divide>"
      "<number_variable>"
      "B" ]

    result = @builder.deparenthesize(stack)
    expect(result.length).toEqual(7)
    expect(result[0]).toEqual("<numeric_literal>")
    expect(result[1]).toEqual(1)
    expect(result[2]).toEqual("<plus>")
    expect(result[3]).toEqual(jasmine.any(Array))
    expect(result[3].length).toEqual(8)
    expect(result[3][0]).toEqual("<numeric_literal>")
    expect(result[3][1]).toEqual(4)
    expect(result[3][2]).toEqual("<times>")
    expect(result[3][3]).toEqual("<number_variable>")
    expect(result[3][4]).toEqual("A")
    expect(result[3][5]).toEqual("<times>")
    expect(result[3][6]).toEqual("<number_variable>")
    expect(result[3][7]).toEqual("C")
    expect(result[4]).toEqual("<divide>")
    expect(result[5]).toEqual("<number_variable>")
    expect(result[6]).toEqual("B")


    # TEST  INT(W)
    stack = [
      "<integer>"
      "<left>"
      "<number_variable>"
      "W"
      "<right>" ]

    result = @builder.deparenthesize(stack)
    expect(result.length).toEqual(2)
    expect(result[0]).toEqual("<integer>")
    expect(result[1]).toEqual(jasmine.any(Array))
    expect(result[1].length).toEqual(2)
    expect(result[1][0]).toEqual("<number_variable>")
    expect(result[1][1]).toEqual("W")


    # TEST  (200+INT(S7))*44
    stack = [
      "<left>"
      "<numeric_literal>"
      200
      "<plus>"
      "<integer>"
      "<left>"
      "<number_variable>"
      "S7"
      "<right>"
      "<right>"
      "<times>"
      "<numeric_literal>"
      44 ]

    result = @builder.deparenthesize(stack)
    expect(result.length).toEqual(4)
    expect(result[0]).toEqual(jasmine.any(Array))
    expect(result[0].length).toEqual(5)
    expect(result[0][0]).toEqual("<numeric_literal>")
    expect(result[0][1]).toEqual(200)
    expect(result[0][2]).toEqual("<plus>")
    expect(result[0][3]).toEqual("<integer>")
    expect(result[0][4]).toEqual(jasmine.any(Array))
    expect(result[0][4].length).toEqual(2)
    expect(result[0][4][0]).toEqual("<number_variable>")
    expect(result[0][4][1]).toEqual("S7")
    expect(result[1]).toEqual("<times>")
    expect(result[2]).toEqual("<numeric_literal>")
    expect(result[3]).toEqual(44)


    # TEST  (S2+7)/(E4^2-7)
    stack = [
      "<left>"
      "<number_variable>"
      "S2"
      "<plus>"
      "<numeric_literal>"
      7
      "<right>"
      "<divide>"
      "<left>"
      "<number_variable>"
      "E4"
      "<power>"
      "<numeric_literal>"
      2
      "<minus>"
      "<numeric_literal>"
      7
      "<right>" ]

    result = @builder.deparenthesize(stack)
    expect(result.length).toEqual(3)
    expect(result[0]).toEqual(jasmine.any(Array))
    expect(result[0].length).toEqual(5)
    expect(result[0][0]).toEqual("<number_variable>")
    expect(result[0][1]).toEqual("S2")
    expect(result[0][2]).toEqual("<plus>")
    expect(result[0][3]).toEqual("<numeric_literal>")
    expect(result[0][4]).toEqual(7)
    expect(result[1]).toEqual("<divide>")
    expect(result[2]).toEqual(jasmine.any(Array))
    expect(result[2].length).toEqual(8)
    expect(result[2][0]).toEqual("<number_variable>")
    expect(result[2][1]).toEqual("E4")
    expect(result[2][2]).toEqual("<power>")
    expect(result[2][3]).toEqual("<numeric_literal>")
    expect(result[2][4]).toEqual(2)
    expect(result[2][5]).toEqual("<minus>")
    expect(result[2][6]).toEqual("<numeric_literal>")
    expect(result[2][7]).toEqual(7)


    # TEST  (6*A-(400+X2))*11
    stack = [
      "<left>"
      "<numeric_literal>"
      6
      "<times>"
      "<number_variable>"
      "A"
      "<minus>"
      "<left>"
      "<numeric_literal>"
      400
      "<plus>"
      "<number_variable>"
      "X2"
      "<right>"
      "<right>"
      "<times>"
      "<numeric_literal>"
      11 ]

    result = @builder.deparenthesize(stack)
    expect(result.length).toEqual(4)
    expect(result[0]).toEqual(jasmine.any(Array))
    expect(result[0].length).toEqual(7)
    expect(result[0][0]).toEqual("<numeric_literal>")
    expect(result[0][1]).toEqual(6)
    expect(result[0][2]).toEqual("<times>")
    expect(result[0][3]).toEqual("<number_variable>")
    expect(result[0][4]).toEqual("A")
    expect(result[0][5]).toEqual("<minus>")
    expect(result[0][6]).toEqual(jasmine.any(Array))
    expect(result[0][6].length).toEqual(5)
    expect(result[0][6][0]).toEqual("<numeric_literal>")
    expect(result[0][6][1]).toEqual(400)
    expect(result[0][6][2]).toEqual("<plus>")
    expect(result[0][6][3]).toEqual("<number_variable>")
    expect(result[0][6][4]).toEqual("X2")


    # TEST  2*(A-0.3333)*(B+1.7)
    stack = [
      "<numeric_literal>"
      2
      "<times>"
      "<left>"
      "<number_variable>"
      "A"
      "<minus>"
      "<numeric_literal>"
      0.3333
      "<right>"
      "<times>"
      "<left>"
      "<number_variable>"
      "B"
      "<plus>"
      "<numeric_literal>"
      1.7
      "<right>" ]

    result = @builder.deparenthesize(stack)
    expect(result.length).toEqual(6)
    expect(result[0]).toEqual("<numeric_literal>")
    expect(result[1]).toEqual(2)
    expect(result[2]).toEqual("<times>")
    expect(result[3]).toEqual(jasmine.any(Array))
    expect(result[3].length).toEqual(5)
    expect(result[3][0]).toEqual("<number_variable>")
    expect(result[3][1]).toEqual("A")
    expect(result[3][2]).toEqual("<minus>")
    expect(result[3][3]).toEqual("<numeric_literal>")
    expect(result[3][4]).toEqual(0.3333)
    expect(result[4]).toEqual("<times>")
    expect(result[5]).toEqual(jasmine.any(Array))
    expect(result[5].length).toEqual(5)
    expect(result[5][0]).toEqual("<number_variable>")
    expect(result[5][1]).toEqual("B")
    expect(result[5][2]).toEqual("<plus>")
    expect(result[5][3]).toEqual("<numeric_literal>")
    expect(result[5][4]).toEqual(1.7)



  it "should find the designated splitter token in an expression", ->

    # SCAN:  A+B
    # RESULT:  'A' <plus> 'B'
    stack = [
      "<number_variable>"
      "A"
      "<plus>"
      "<number_variable>"
      "B" ]

    left = [
      "<numeric_expression>"
      "<number_variable>"
      "A"
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<number_variable>"
      "B"
      "<num_exp_end>"]

    test_data = {
      stack: stack
      expected_expression: "<plus>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  X-200
    # RESULT:  'X' <minus> '200'
    stack = [
      "<number_variable>"
      "X"
      "<minus>"
      "<numeric_literal>"
      200 ]

    left = [
      "<numeric_expression>"
      "<number_variable>"
      "X"
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<numeric_literal>"
      200
      "<num_exp_end>" ]

    test_data = {
      stack: stack
      expected_expression: "<minus>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  'P+Q+R+S'
    # RESULT:  'P' <plus> 'Q+R+S'
    stack = [
      "<number_variable>"
      "P"
      "<plus>"
      "<number_variable>"
      "Q"
      "<plus>"
      "<number_variable>"
      "R"
      "<plus>"
      "<number_variable>"
      "S" ]

    left = [
      "<numeric_expression>"
      "<number_variable>"
      "P"
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<number_variable>"
      "Q"
      "<plus>"
      "<number_variable>"
      "R"
      "<plus>"
      "<number_variable>"
      "S"
      "<num_exp_end>" ]

    test_data = {
      stack: stack
      expected_expression: "<plus>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  J*Z1-K*Z2
    # RESULT:  'J*Z1' <minus> 'K*Z2'
    stack = [
      "<number_variable>"
      "J"
      "<times>"
      "<number_variable>"
      "Z1"
      "<minus>"
      "<number_variable>"
      "K"
      "<times>"
      "<number_variable>"
      "Z2" ]

    left = [
      "<numeric_expression>"
      "<number_variable>"
      "J"
      "<times>"
      "<number_variable>"
      "Z1"
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<number_variable>"
      "K"
      "<times>"
      "<number_variable>"
      "Z2"
      "<num_exp_end>" ]

    test_data = {
      stack: stack
      expected_expression: "<minus>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN: '21*T'
    # RESULT:  '21' <times> "T"

    stack = [
      "<numeric_literal>"
      21
      "<times>"
      "<number_variable>"
      "T" ]

    left = [
      "<numeric_expression>"
      "<numeric_literal>"
      21
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<number_variable>"
      "T"
      "<num_exp_end>" ]

    test_data = {
      stack: stack
      expected_expression: "<times>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  3.1416/2
    # RESULT:  '3.1416' <divide> '2'
    stack = [
      "<numeric_literal>"
      3.1416
      "<divide>"
      "<numeric_literal>"
      2 ]

    left = [
      "<numeric_expression>"
      "<numeric_literal>"
      3.1416
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<numeric_literal>"
      2
      "<num_exp_end>" ]

    test_data = {
      stack: stack
      expected_expression: "<divide>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  3.3333*Z*A/M
    # RESULT:  '3.3333' <times> 'Z*A/M'
    stack = [
      "<numeric_literal>"
      3.3333
      "<times>"
      "<number_variable>"
      "Z"
      "<times>"
      "<number_variable>"
      "A"
      "<divide>"
      "<number_variable>"
      "M" ]

    left = [
      "<numeric_expression>"
      "<numeric_literal>"
      3.3333
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<number_variable>"
      "Z"
      "<times>"
      "<number_variable>"
      "A"
      "<divide>"
      "<number_variable>"
      "M"
      "<num_exp_end>" ]

    test_data = {
      stack: stack
      expected_expression: "<times>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  'M^3'
    # RESULT:  'M' <power> '3'
    stack = [
      "<number_variable>"
      "M"
      "<power>"
      "<numeric_literal>"
      3 ]

    left = [
      "<numeric_expression>"
      "<number_variable>"
      "M"
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<numeric_literal>"
      3
      "<num_exp_end>" ]

    test_data = {
      stack: stack
      expected_expression: "<power>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  3.1416
    # RESULT:  <numeric_literal> '3.1416'
    stack = [
      "<numeric_literal>"
      3.1416 ]

    left = []

    right = [3.1416]

    test_data = {
      stack: stack
      expected_expression: "<numeric_literal>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  X
    # RESULT:  <number_variable> 'X'
    stack = [
      "<number_variable>"
      "X" ]

    left = []

    right = ["X"]

    test_data = {
      stack: stack
      expected_expression: "<number_variable>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  (1+W)/(Z1+Z2+Z3)
    # RESULT:  '1+W' <divide> 'Z1+Z2+Z3'

    stack = [
      "<left>"
      "<numeric_literal>"
      1
      "<plus>"
      "<number_variable>"
      "W"
      "<right>"
      "<divide>"
      "<left>"
      "<number_variable>"
      "Z1"
      "<plus>"
      "<number_variable>"
      "Z2"
      "plus"
      "<number_variable>"
      "Z3"
      "<right>" ]

    left = [
      "<numeric_expression>"
      "<numeric_literal>"
      1
      "<plus>"
      "<number_variable>"
      "W"
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<number_variable>"
      "Z1"
      "<plus>"
      "<number_variable>"
      "Z2"
      "plus"
      "<number_variable>"
      "Z3"
      "<num_exp_end>" ]

    test_data = {
      stack: stack
      expected_expression: "<divide>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  (6*A-(400+X2))*11
    # RESULT:  '6*A-[400+X2]' <times> '11'
    stack = [
      "<left>"
      "<numeric_literal>"
      6
      "<times>"
      "<number_variable>"
      "A"
      "<minus>"
      "<left>"
      "<numeric_literal>"
      400
      "<plus>"
      "<number_variable>"
      "X2"
      "<right>"
      "<right>"
      "<times>"
      "<numeric_literal>"
      11 ]

    left = [
      "<numeric_expression>"
      "<numeric_literal>"
      6
      "<times>"
      "<number_variable>"
      "A"
      "<minus>"
      ["<numeric_literal>", 400, "<plus>", "<number_variable>", "X2"]
      "<num_exp_end>" ]

    right = [
      "<numeric_expression>"
      "<numeric_literal>"
      11
      "<num_exp_end>" ]

    test_data = {
      stack: stack
      expected_expression: "<times>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  RND
    # RESULT:  '<random>'
    stack = [
      "<random>" ]

    left = []

    right = []

    test_data = {
      stack: stack
      expected_expression: "<random>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]


    # SCAN:  INT(Z6)
    # RESULT:  <integer> "Z6"
    stack = [
      "<integer>"
      "<left>"
      "<number_variable>"
      "Z6"
      "<right>"
      ]

    left = []

    right = [
      "<numeric_expression>"
      "<number_variable>"
      "Z6"
      "<num_exp_end>" ]


    test_data = {
      stack: stack
      expected_expression: "<integer>"
      left: left
      right: right }

    result = @builder.split(test_data.stack)
    expect(result.left.length).toEqual(test_data.left.length)
    expect(result.right.length).toEqual(test_data.right.length)
    expect(result.exp).toEqual(test_data.expected_expression)
    expect(result.left[i]).toEqual(test_data.left[i]) for i in [0..test_data.left.length-1]
    expect(result.right[i]).toEqual(test_data.right[i]) for i in [0..test_data.right.length-1]



  it "should build a usable key-value object from a numeric expression 'parse object' array", ->

    # TEST NUMERIC EXPRESSION:  X
    stack = [
      "<numeric_expression>"
      "<number_variable>"
      "X"
      "<num_exp_end>" ]

    expected = {
      exp: "<var>"
      name: "X" }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.name).toEqual(expected.name)


    # TEST NUMERIC EXPRESSION:  42
    stack = [
      "<numeric_expression>"
      "<numeric_literal>"
      42
      "<num_exp_end>" ]

    expected = {
      exp: "<num>"
      value: 42 }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.value).toEqual(expected.value)


    # TEST NUMERIC EXPRESSION:  13.477
    stack = [
      "<numeric_expression>"
      "<numeric_literal>"
      13.477
      "<num_exp_end>" ]

    expected = {
      exp: "<num>"
      value: 13.477 }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.value).toEqual(expected.value)


    # TEST NUMERIC EXPRESSION:  7/12
    stack = [
      "<numeric_expression>"
      "<numeric_literal>"
      7
      "<divide>"
      "<numeric_literal>"
      12
      "<num_exp_end>" ]

    expected = {
      exp: "<divide>"
      op1: {exp: "<num>", value: 7 }
      op2: {exp: "<num>", value: 12 } }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.value).toEqual(expected.op1.value)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.value).toEqual(expected.op2.value)


    # TEST NUMERIC EXPRESSION:  477+B
    stack = [
      "<numeric_expression>"
      "<numeric_literal>"
      477
      "<plus>"
      "<number_variable>"
      "B"
      "<num_exp_end>" ]

    expected = {
      exp: "<plus>"
      op1: {exp: "<num>", value: 477 }
      op2: {exp: "<var>", name: "B" } }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.value).toEqual(expected.op1.value)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.name).toEqual(expected.op2.name)

    # TEST NUMERIC EXPRESSION:  C^2
    stack = [
      "<numeric_expression>"
      "<number_variable>"
      "C"
      "<power>"
      "<numeric_literal>"
      2
      "<num_exp_end>" ]

    expected = {
      exp: "<power>"
      op1: {exp: "<var>", name: "C" }
      op2: {exp: "<num>", value: 2 } }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.name).toEqual(expected.op1.name)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.value).toEqual(expected.op2.value)


    # TEST NUMERIC EXPRESSION:  8*RND
    stack = [
      "<numeric_expression>"
      "<numeric_literal>"
      8
      "<times>"
      "<random>"
      "<num_exp_end>" ]

    expected = {
      exp: "<times>"
      op1: {exp: "<num>", value: 8 }
      op2: {exp: "<random>" } }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.value).toEqual(expected.op1.value)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)


    # TEST NUMERIC EXPRESSION:  X*Y*Z
    stack = [
      "<numeric_expression>"
      "<number_variable>"
      "X"
      "<times>"
      "<number_variable>"
      "Y"
      "<times>"
      "<number_variable>"
      "Z"
      "<num_exp_end>" ]

    op2 = {
      exp: "<times>"
      op1: {exp: "<var>", name: "Y" }
      op2: {exp: "<var>", name: "Z" } }

    expected = {
      exp: "<times>"
      op1: {exp: "<var>", name: "X" }
      op2: op2 }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.name).toEqual(expected.op1.name)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.op1.exp).toEqual(expected.op2.op1.exp)
    expect(nmx.op2.op1.name).toEqual(expected.op2.op1.name)
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp)
    expect(nmx.op2.op2.name).toEqual(expected.op2.op2.name)

    # TEST NUMERIC EXPRESSION:  28*(J+2)
    stack = [
      "<numeric_expression>"
      "<numeric_literal>"
      28
      "<times>"
      "<left>"
      "<number_variable>"
      "J"
      "<plus>"
      "<numeric_literal>"
      2
      "<right>"
      "<num_exp_end>" ]

    op2 = {
      exp: "<plus>"
      op1: {exp: "<var>", name: "J" }
      op2: {exp: "<num>", value: 2 } }

    expected = {
      exp: "<times>"
      op1: {exp: "<num>", value: 28 }
      op2: op2 }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.value).toEqual(expected.op1.value)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.op1.exp).toEqual(expected.op2.op1.exp)
    expect(nmx.op2.op1.name).toEqual(expected.op2.op1.name)
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp)
    expect(nmx.op2.op2.value).toEqual(expected.op2.op2.value)


    # TEST NUMERIC EXPRESSION:  W5+W7-4*(J^2+K^3)
    stack = [
      "<numeric_expression>"
      "<number_variable>"
      "W5"
      "<plus>"
      "<number_variable>"
      "W7"
      "<minus>"
      "<numeric_literal>"
      4
      "<times>"
      "<left>"
      "<number_variable>"
      "J"
      "<power>"
      "<numeric_literal>"
      2
      "<plus>"
      "<number_variable>"
      "K"
      "<power>"
      "<numeric_literal>"
      3
      "<right>"
      "<num_exp_end>" ]

    op2_2_2_1 = {
      exp: "<power>"
      op1: {exp: "<var>", name: "J" }
      op2: {exp: "<num>", value: 2 } }

    op2_2_2_2 = {
      exp: "<power>"
      op1: {exp:"<var>", name: "K" }
      op2: {exp: "<num>", value: 3 } }

    op2_2_2 = {
      exp: "<plus>"
      op1: op2_2_2_1
      op2: op2_2_2_2 }

    op2_2 = {
      exp: "<times>"
      op1: {exp: "<num>", value: 4 }
      op2: op2_2_2 }

    op2 = {
      exp: "<minus>"
      op1: {exp: "<var>", name: "W7" }
      op2: op2_2 }

    expected = {
      exp: "<plus>"
      op1: {exp: "<var>", name: "W5" }
      op2: op2 }


    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.name).toEqual(expected.op1.name)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp)
    expect(nmx.op2.op2.op1.exp).toEqual(expected.op2.op2.op1.exp)
    expect(nmx.op2.op2.op1.value).toEqual(expected.op2.op2.op1.value)
    expect(nmx.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.exp)
    expect(nmx.op2.op2.op2.op1.exp).toEqual(expected.op2.op2.op2.op1.exp)
    expect(nmx.op2.op2.op2.op1.op1.exp).toEqual(expected.op2.op2.op2.op1.op1.exp)
    expect(nmx.op2.op2.op2.op1.op1.name).toEqual(expected.op2.op2.op2.op1.op1.name)
    expect(nmx.op2.op2.op2.op1.op2.exp).toEqual(expected.op2.op2.op2.op1.op2.exp)
    expect(nmx.op2.op2.op2.op1.op2.value).toEqual(expected.op2.op2.op2.op1.op2.value)
    expect(nmx.op2.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.op2.exp)
    expect(nmx.op2.op2.op2.op2.op1.exp).toEqual(expected.op2.op2.op2.op2.op1.exp)
    expect(nmx.op2.op2.op2.op2.op1.name).toEqual(expected.op2.op2.op2.op2.op1.name)
    expect(nmx.op2.op2.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.op2.op2.exp)
    expect(nmx.op2.op2.op2.op2.op2.value).toEqual(expected.op2.op2.op2.op2.op2.value)


    # TEST NUMERIC EXPRESSION:  (18-Q7)/(2.108*(14*M+17*X))
    stack = [
      "<numeric_expression>"
      "<left>"
      "<numeric_literal>"
      18
      "<minus>"
      "<number_variable>"
      "Q7"
      "<right>"
      "<divide>"
      "<left>"
      "<numeric_literal>"
      2.108
      "<times>"
      "<left>"
      "<numeric_literal>"
      14
      "<times>"
      "<number_variable>"
      "M"
      "<plus>"
      "<numeric_literal>"
      17
      "<times>"
      "<number_variable>"
      "X"
      "<right>"
      "<right>"
      "<num_exp_end>" ]

    op1 = {
      exp: "<minus>"
      op1: {exp: "<num>", value: 18 }
      op2: {exp: "<var>", name: "Q7" } }

    op2_2_1 = {
      exp: "<times>"
      op1: {exp: "<num>", value: 14 }
      op2: {exp: "<var>", name: "M" } }

    op2_2_2 = {
      exp: "<times>"
      op1: {exp: "<num>", value: 17 }
      op2: {exp: "<var>", name: "X" } }

    op2_2 = {
      exp: "<plus>"
      op1: op2_2_1
      op2: op2_2_2 }

    op2 = {
      exp: "<times>"
      op1: {exp: "<num>", value: 2.108 }
      op2: op2_2 }

    expected = {
      exp: "<divide>"
      op1: op1
      op2: op2 }

    nmx = @builder.build_nxp(stack)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.op1.exp).toEqual(expected.op1.op1.exp)
    expect(nmx.op1.op1.value).toEqual(expected.op1.op1.value)
    expect(nmx.op1.op2.exp).toEqual(expected.op1.op2.exp)
    expect(nmx.op1.op2.name).toEqual(expected.op1.op2.name)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.op1.exp).toEqual(expected.op2.op1.exp)
    expect(nmx.op2.op1.value).toEqual(expected.op2.op1.value)
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp)
    expect(nmx.op2.op2.op1.exp).toEqual(expected.op2.op2.op1.exp)
    expect(nmx.op2.op2.op1.op1.exp).toEqual(expected.op2.op2.op1.op1.exp)
    expect(nmx.op2.op2.op1.op1.value).toEqual(expected.op2.op2.op1.op1.value)
    expect(nmx.op2.op2.op1.op2.exp).toEqual(expected.op2.op2.op1.op2.exp)
    expect(nmx.op2.op2.op1.op2.name).toEqual(expected.op2.op2.op1.op2.name)
    expect(nmx.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.exp)
    expect(nmx.op2.op2.op2.op1.exp).toEqual(expected.op2.op2.op2.op1.exp)
    expect(nmx.op2.op2.op2.op1.value).toEqual(expected.op2.op2.op2.op1.value)
    expect(nmx.op2.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.op2.exp)
    expect(nmx.op2.op2.op2.op2.name).toEqual(expected.op2.op2.op2.op2.name)
