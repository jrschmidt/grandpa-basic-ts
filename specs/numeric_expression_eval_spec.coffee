describe "Numeric expression evaluator", ->

  it "should create a NumericExpressionEvaluator object", ->

    nmx_eval = new NumericExpressionEvaluator
    expect(nmx_eval).toEqual(jasmine.any(NumericExpressionEvaluator))


  # Hoping that placing the beforeEach() here, after the first it() call, will
  # make it execute AFTER the first it(). If this doesn't work, no harm is done.
  beforeEach ->
    @nmx_eval = new NumericExpressionEvaluator
    @num_vars = @nmx_eval.vars


  it "should evaluate a numeric literal", ->

    nmx = {
      exp: "<num>"
      value: 42 }    

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(42)

    nmx = {
      exp: "<num>"
      value: 0 }    

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(0)

    nmx = {
      exp: "<num>"
      value: 6 }    

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(6)

    nmx = {
      exp: "<num>"
      value: 3.1416 }    

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(3.1416)


  it "should evaluate a reference to a number variable", ->

    nmx = {
      exp: "<var>"
      name: "Y" }

    @num_vars.set("Y", 7)
    value = @nmx_eval.val(nmx)
    expect(value).toEqual(7)

    nmx = {
      exp: "<var>"
      name: "A8" }

    @num_vars.set("A8", 0)
    value = @nmx_eval.val(nmx)
    expect(value).toEqual(0)

    nmx = {
      exp: "<var>"
      name: "E" }

    @num_vars.set("E",944.67)
    value = @nmx_eval.val(nmx)
    expect(value).toEqual(944.67)


  it "should evaluate a simple binary expression", ->

    # TEST  440+16
    nmx = {
      exp: "<plus>"
      op1: {exp: "<num>", value: 440 }
      op2: {exp: "<num>", value: 16 } }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(456)


    # TEST  888-555
    nmx = {
      exp: "<minus>"
      op1: {exp: "<num>", value: 888 }
      op2: {exp: "<num>", value: 555 } }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(333)


    # TEST  3*17
    nmx = {
      exp: "<times>"
      op1: {exp: "<num>", value: 3 }
      op2: {exp: "<num>", value: 17 } }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(51)


    # TEST  1024/256
    nmx = {
      exp: "<divide>"
      op1: {exp: "<num>", value: 1024 }
      op2: {exp: "<num>", value: 256 } }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(4)


    # TEST  2^5
    nmx = {
      exp: "<power>"
      op1: {exp: "<num>", value: 2 }
      op2: {exp: "<num>", value: 5 } }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(32)


  it "should evaluate compound binary expressions", ->

    # TEST  X*Y*Z
    op2 = {
      exp: "<times>"
      op1: {exp: "<var>", name: "Y" }
      op2: {exp: "<var>", name: "Z" } }

    nmx = {
      exp: "<times>"
      op1: {exp: "<var>", name: "X" }
      op2: op2 }

    @num_vars.set("X", 2)
    @num_vars.set("Y", 3)
    @num_vars.set("Z", 5)

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(30)

    @num_vars.set("X", 11)
    @num_vars.set("Y", 3)
    @num_vars.set("Z", 100)

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(3300)

    # TEST  800+12-4
    op2 = {
      exp: "<minus>"
      op1: {exp: "<num>", value: 12 }
      op2: {exp: "<num>", value: 4 } }

    nmx = {
      exp: "<plus>"
      op1: {exp: "<num>", value: 800 }
      op2: op2 }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(808)


  it "should evaluate numeric expressions with parentheses", ->

    # TEST  (A-B)/3
    op1 = {
      exp: "<minus>"
      op1: {exp: "<var>", name: "A" }
      op2: {exp: "<var>", name: "B" } }

    nmx = {
      exp: "<divide>"
      op1: op1
      op2: {exp: "<num>", value: 3 } }

    @num_vars.set("A", 555)
    @num_vars.set("B", 222)

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(111)

    @num_vars.set("A", 71)
    @num_vars.set("B", 20)

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(17)


    # TEST  W*(40+L)
    op2 = {
      exp: "<plus>"
      op1: {exp: "<num>", value: 40 }
      op2: {exp: "<var>", name: "L" } }

    nmx = {
      exp: "<times>"
      op1: {exp: "<var>", name: "W" }
      op2: op2 }

    @num_vars.set("W", 100)
    @num_vars.set("L", 28)

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(6800)

    @num_vars.set("W", 7)
    @num_vars.set("L", 30)

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(490)


    # TEST  (14+M1)/(11+M2)
    op1 = {
      exp: "<plus>"
      op1: {exp: "<num>", value: 14 }
      op2: {exp: "<var>", name: "M1" } }

    op2 = {
      exp: "<plus>"
      op1: {exp: "<num>", value: 11 }
      op2: {exp: "<var>", name: "M2" } }

    nmx = {
      exp: "<divide>"
      op1: op1
      op2: op2 }

    @num_vars.set("M1", 28)
    @num_vars.set("M2", 3)

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(3)

    @num_vars.set("M1", 16)
    @num_vars.set("M2", 9)

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(1.5)

    # TEST  (201-3*(L-7))/9
    op1_2_2 = {
      tag: "op1_2_2"
      exp: "<minus>"
      op1: {exp: "<var>", name: "L" }
      op2: {exp: "<num>", value: 7 } }

    op1_2 = {
      tag: "op1_2"
      exp: "<times>"
      op1: {exp: "<num>", value: 3 }
      op2: op1_2_2 }

    op1 = {
      tag: "op1"
      exp: "<minus>"
      op1: {exp: "<num>", value: 201 }
      op2: op1_2 }

    nmx = {
      tag: "nmx"
      exp: "<divide>"
      op1: op1
      op2: {exp: "<num>", value: 9 } }

    @num_vars.set("L", 14)

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(20)



