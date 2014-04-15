describe "Boolean expression evaluator", ->

  beforeEach ->
    @helpers = new InterpreterHelpers("vars1_bx_eval", "BoolExpEval SPEC: beforeEach") #ABC
    @bx_eval = @helpers.bx_eval
    @num_vars = @helpers.num_vars
    @str_vars = @helpers.str_vars


  it "should calculate the value of a boolean expression", ->

    #  TEST:  Z<0
    bx = {
      exp: "<num_lesser_than>"
      var: "Z"
      num_exp: {exp: "<num>", value: 0 } }

    @num_vars.set("Z", -7)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @num_vars.set("Z", 49.208)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(false)


    #  TEST:  $W="TOMORROW"
    bx = {
      exp: "<str_equals>"
      var: "W"
      str_exp: [ ["<str>", "TOMORROW"] ] }

    @str_vars.set("W", "TOMORROW")
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @str_vars.set("W", "YESTERDAY")
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(false)


    #  TEST:  N>=20
    bx = {
      exp: "<num_greater_equal>"
      var: "N"
      num_exp: {exp: "<num>", value: 20 } }

    @num_vars.set("N", 206)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @num_vars.set("N", 20)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @num_vars.set("N", 6)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(false)


    #  TEST:  Q=7
    bx = {
      exp: "<num_equals>"
      var: "Q"
      num_exp: {exp: "<num>", value: 7 } }

    @num_vars.set("Q", 7)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @num_vars.set("Q", 3)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(false)

    @num_vars.set("Q", 47)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(false)


    #  TEST:  L4>L5
    bx = {
      exp: "<num_greater_than>"
      var: "L4"
      num_exp: {exp: "<var>", name: "L5" } }

    @num_vars.set("L4", 1677)
    @num_vars.set("L5", 1340)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @num_vars.set("L4", 1340)
    @num_vars.set("L5", 1677)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(false)


    #  TEST:  V<=P+4
    op1 = {exp: "<var>", name: "P" }
    op2 = {exp: "<num>", value: 4 }

    bx = {
      exp: "<num_lesser_equal>"
      var: "V"
      num_exp: { exp: "<plus>", op1: op1, op2: op2 } }

    @num_vars.set("V", 15)

    @num_vars.set("P", 5)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(false)

    @num_vars.set("P", 15)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @num_vars.set("P", 25)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)


    #  TEST:  $H<>"YES"
    bx = {
      exp: "<str_not_equal>"
      var: "H"
      str_exp: [ ["<str>", "YES"] ] }

    @str_vars.set("H", "NO")
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @str_vars.set("H", "YES")
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(false)


    #  TEST:  A<>B
    bx = {
      exp: "<num_not_equal>"
      var: "A"
      num_exp: {exp: "<var>", name: "B" } }

    @num_vars.set("A", 99)

    @num_vars.set("B", 98)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @num_vars.set("B", 2)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(true)

    @num_vars.set("B", 99)
    tf = @bx_eval.val(bx)
    expect(tf).toEqual(false)


