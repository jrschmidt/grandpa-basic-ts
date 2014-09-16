describe "Numeric string formatter", ->

  beforeEach ->
    @helpers = new InterpreterHelpers
    @num_form = @helpers.num_form


  it "should format a number to a string with no more than 8 digits", ->

    str = @num_form.num_to_str(0)
    expect(str).toEqual("0")

    str = @num_form.num_to_str(1)
    expect(str).toEqual("1")

    str = @num_form.num_to_str(-1)
    expect(str).toEqual("-1")

    str = @num_form.num_to_str(488)
    expect(str).toEqual("488")

    str = @num_form.num_to_str(3.1416)
    expect(str).toEqual("3.1416")

    str = @num_form.num_to_str(1/3)
    expect(str).toEqual("0.3333333")

    str = @num_form.num_to_str(3/7)
    expect(str).toEqual("0.4285714")

    str = @num_form.num_to_str(30/7)
    expect(str).toEqual("4.2857142")

    str = @num_form.num_to_str(3000/7)
    expect(str).toEqual("428.57142")

    str = @num_form.num_to_str(12345678)
    expect(str).toEqual("12345678")

    # str = @num_form.num_to_str(123456789)
    # expect(str).toEqual("1.2345678E08")
    #
    # str = @num_form.num_to_str(1234567899999)
    # expect(str).toEqual("1.2345678E12")

    str = @num_form.num_to_str(0.1)
    expect(str).toEqual("0.1")

    str = @num_form.num_to_str(0.1234567)
    expect(str).toEqual("0.1234567")

    str = @num_form.num_to_str(0.12345678)
    expect(str).toEqual("0.1234567")

    # str = @num_form.num_to_str(477/(10**28))
    # expect(str).toEqual("4.77E-26")
    #
    # str = @num_form.num_to_str(47733/(10**28))
    # expect(str).toEqual("4.7733E-24")
    #
    # str = @num_form.num_to_str(0.04)
    # expect(str).toEqual("4E-02")
    #
    # str = @num_form.num_to_str(0.00004)
    # expect(str).toEqual("4E-05")
