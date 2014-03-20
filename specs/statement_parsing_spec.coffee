describe "Test statement line parsing", ->

  beforeEach ->
    @parser = new LineParser


  it "should correctly parse REM statements", ->

    result = @parser.look_for_line_number_statement("REM")
    po = result.parse_object
    expect(po[0]).toEqual("<remark>")

    result = @parser.look_for_line_number_statement("REM WELCOME TO GRANDPA BASIC 1980")
    po = result.parse_object
    expect(po[0]).toEqual("<remark>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<characters>")
    expect(po[3]).toEqual('WELCOME TO GRANDPA BASIC 1980')

    result = @parser.look_for_line_number_statement("REM **** - - - ****")
    po = result.parse_object
    expect(po[0]).toEqual("<remark>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<characters>")
    expect(po[3]).toEqual('**** - - - ****')

    result = @parser.look_for_line_number_statement("REM PARSE LEFT SIDE BEFORE RIGHT SIDE")
    po = result.parse_object
    expect(po[0]).toEqual("<remark>")
    expect(po[1]).toEqual("<sp>")
    expect(po[2]).toEqual("<characters>")
    expect(po[3]).toEqual('PARSE LEFT SIDE BEFORE RIGHT SIDE')


