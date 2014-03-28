describe "Numeric expression object", ->

  xit "should build a NumericExpression object from a numeric expression 'parse object'", ->

    # TEST NUMERIC EXPRESSION:  X
    po = [
      "<numeric_expression>"
      "<number_variable>"
      "X"
      "<num_exp_end>" ]

    expected = {
      exp: "<var>"
      name: "X" }

    nmx = new NumericExpression(po)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.name).toEqual(expected.name)


    # TEST NUMERIC EXPRESSION:  42
    po = [
      "<numeric_expression>"
      "<numeric_literal>"
      42
      "<num_exp_end>" ]

    expected = {
      exp: "<num>"
      value: 42 }

    nmx = new NumericExpression(po)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.value).toEqual(expected.value)


    # TEST NUMERIC EXPRESSION:  13.477
    po = [
      "<numeric_expression>"
      "<numeric_literal>"
      13.477
      "<num_exp_end>" ]

    expected = {
      exp: "<num>"
      value: 13.477 }

    nmx = new NumericExpression(po)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.value).toEqual(expected.value)


    # TEST NUMERIC EXPRESSION:  7/12
    po = [
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

    nmx = new NumericExpression(po)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.value).toEqual(expected.op1.value)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.value).toEqual(expected.op2.value)


    # TEST NUMERIC EXPRESSION:  477+B
    po = [
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

    nmx = new NumericExpression(po)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.value).toEqual(expected.op1.value)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.name).toEqual(expected.op2.name)

    # TEST NUMERIC EXPRESSION:  C^2
    po = [
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

    nmx = new NumericExpression(po)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.name).toEqual(expected.op1.name)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.value).toEqual(expected.op2.value)


    # TEST NUMERIC EXPRESSION:  X*Y*Z
    po = [
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

    expected = {
      exp: "<times>"
      op1: {exp: "<var>", name: "X" }
      op2: op2 }

    op2 = {
      exp: "<times>"
      op1: {exp: "<var>", name: "Y" }
      op2: {exp: "<var>", name: "Z" } }

    nmx = new NumericExpression(po)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.name).toEqual(expected.op1.name)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.op1.exp).toEqual(expected.op2.op1.exp)
    expect(nmx.op2.op1.name).toEqual(expected.op2.op1.name)
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp)
    expect(nmx.op2.op2.name).toEqual(expected.op2.op2.name)

    # TEST NUMERIC EXPRESSION:  28*(J+2)
    po = [
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

    expected = {
      exp: "<times>"
      op1: {exp: "<num>", value: 28 }
      op2: op2 }

    op2 = {
      exp: "<plus>"
      op1: {exp: "<var>", name: "J" }
      op2: {exp: "<num>", value: 2 } }

    nmx = new NumericExpression(po)
    expect(nmx.exp).toEqual(expected.exp)
    expect(nmx.op1.exp).toEqual(expected.op1.exp)
    expect(nmx.op1.value).toEqual(expected.op1.value)
    expect(nmx.op2.exp).toEqual(expected.op2.exp)
    expect(nmx.op2.op1.exp).toEqual(expected.op2.op1.exp)
    expect(nmx.op2.op1.name).toEqual(expected.op2.op1.name)
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp)
    expect(nmx.op2.op2.value).toEqual(expected.op2.op2.value)


    # TEST NUMERIC EXPRESSION:  W5+W7-4*(J^2+K^3)
    po = [
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

    expected = {
      exp: "<plus>"
      op1: {exp: "<var>", name: "W5" }
      op2: op2 }

    op2 = {
      exp: "<minus>"
      op1: {exp: "<var>", name: "W7" }
      op2: op2_2 }

    op2_2 = {
      exp: "<times>"
      op1: {exp: "<num>", value: 4 }
      op2: op2_2_2 }

    op2_2_2 = {
      exp: "<plus>"
      op1: op2_2_2_1
      op2: op2_2_2_2 }

    op2_2_2_1 = {
      exp: "<power>"
      op1: {exp: "<var>", name: "J" }
      op2: {exp: "<num>", value: 2 } }

    op2_2_2_2 = {
      exp: "<power>"
      op1: {exp:"<var>", name: "K" }
      op2: {exp: "<num>", value: 3 } }


    nmx = new NumericExpression(po)
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
    po = [
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

    expected = {
      exp: "<divide>"


    nmx = new NumericExpression(po)
    expect(nmx.exp).toEqual(expected.)
    expect(nmx.).toEqual(expected.)




