describe "Key helper methods", ->

  beforeEach ->
    @key_help = new KeyHelper


  it "should create a KeyHelper object", ->
    expect(@key_help).toBeDefined
    expect(@key_help).toEqual(jasmine.any(KeyHelper))


  it "should map character codes to characters", ->
    expect(@key_help.char(18)).toEqual(null)
    expect(@key_help.char(24)).toEqual(null)
    expect(@key_help.char(32)).toEqual(null)
    expect(@key_help.char(66)).toEqual(null)
    expect(@key_help.char(73)).toEqual(null)
    expect(@key_help.char(88)).toEqual(null)

    expect(@key_help.char(33)).toEqual("!")
    expect(@key_help.char(35)).toEqual("#")
    expect(@key_help.char(43)).toEqual("+")
    expect(@key_help.char(48)).toEqual("0")
    expect(@key_help.char(51)).toEqual("3")
    expect(@key_help.char(60)).toEqual("<")
    expect(@key_help.char(64)).toEqual("@")
    expect(@key_help.char(97)).toEqual("A")
    expect(@key_help.char(98)).toEqual("B")
    expect(@key_help.char(113)).toEqual("Q")
    expect(@key_help.char(120)).toEqual("X")
    expect(@key_help.char(122)).toEqual("Z")
    expect(@key_help.char(125)).toEqual("}")


  it "should map character codes to sprite coordinates", ->
    expect(@key_help.sprite_xy(33)).toEqual([99,72])
    expect(@key_help.sprite_xy(35)).toEqual([33,90])
    expect(@key_help.sprite_xy(43)).toEqual([11,54])
    expect(@key_help.sprite_xy(48)).toEqual([0,36])
    expect(@key_help.sprite_xy(51)).toEqual([33,36])
    expect(@key_help.sprite_xy(60)).toEqual([88,54])
    expect(@key_help.sprite_xy(64)).toEqual([22,90])
    expect(@key_help.sprite_xy(97)).toEqual([0,0])
    expect(@key_help.sprite_xy(98)).toEqual([11,0])
    expect(@key_help.sprite_xy(113)).toEqual([33,18])
    expect(@key_help.sprite_xy(120)).toEqual([110,18])
    expect(@key_help.sprite_xy(122)).toEqual([132,18])
    expect(@key_help.sprite_xy(125)).toEqual([77,90])



