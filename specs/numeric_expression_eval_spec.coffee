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


  xit "should do nothing ...", ->

    # TEST  
    nmx = {
      exp: "<>" }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual()


