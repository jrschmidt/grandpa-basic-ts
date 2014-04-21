describe "Key helper methods", ->

  beforeEach ->
    @key_help = new KeyHelper


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


  it "should map characters to sprite coordinates", ->
    expect(@key_help.sprite_xy("!")).toEqual([99,72])
    expect(@key_help.sprite_xy("#")).toEqual([33,90])
    expect(@key_help.sprite_xy("+")).toEqual([11,54])
    expect(@key_help.sprite_xy("0")).toEqual([0,36])
    expect(@key_help.sprite_xy("3")).toEqual([33,36])
    expect(@key_help.sprite_xy("<")).toEqual([88,54])
    expect(@key_help.sprite_xy("@")).toEqual([22,90])
    expect(@key_help.sprite_xy("A")).toEqual([0,0])
    expect(@key_help.sprite_xy("B")).toEqual([11,0])
    expect(@key_help.sprite_xy("Q")).toEqual([33,18])
    expect(@key_help.sprite_xy("X")).toEqual([110,18])
    expect(@key_help.sprite_xy("Z")).toEqual([132,18])
    expect(@key_help.sprite_xy("}")).toEqual([77,90])


