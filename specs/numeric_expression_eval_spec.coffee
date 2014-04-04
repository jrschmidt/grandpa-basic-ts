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

    nmx = {
      exp: "<plus>"
      op1: 440
      op2: 16 }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(456)


    nmx = {
      exp: "<minus>"
      op1: 888
      op2: 555 }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(333)


    nmx = {
      exp: "<times>"
      op1: 3
      op2: 17 }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(51)


    nmx = {
      exp: "<divide>"
      op1: 1024
      op2: 256 }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(4)


    nmx = {
      exp: "<power>"
      op1: 2
      op2: 5 }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual(32)


  xit "should do nothing ...", ->

    nmx = {
      exp: "<>" }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual()

    nmx = {
      exp: "<>" }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual()

    nmx = {
      exp: "<>" }

    value = @nmx_eval.val(nmx)
    expect(value).toEqual()


