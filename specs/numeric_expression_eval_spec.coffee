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


