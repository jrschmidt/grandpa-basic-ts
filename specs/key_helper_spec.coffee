describe "Key helper methods", ->

  beforeEach ->
    @key_help = new KeyHelper
    @key_help.monitor_color = "amber"


  it "should map key code - shift state combinations to characters", ->
    expect(@key_help.char(32, "<no-shift>")).toEqual(" ")
    expect(@key_help.char(32, "<shift>")).toEqual(" ")

    # Characters that have different codes for Firefox and Chrome
    # [Firefox codes]
    expect(@key_help.char(173, "<no-shift>")).toEqual("-")
    expect(@key_help.char(173, "<shift>")).toEqual("_")
    expect(@key_help.char(61, "<no-shift>")).toEqual("=")
    expect(@key_help.char(61, "<shift>")).toEqual("+")
    expect(@key_help.char(59, "<no-shift>")).toEqual(";")
    expect(@key_help.char(59, "<shift>")).toEqual(":")
    # [Chrome codes]
    expect(@key_help.char(189, "<no-shift>")).toEqual("-")
    expect(@key_help.char(189, "<shift>")).toEqual("_")
    expect(@key_help.char(187, "<no-shift>")).toEqual("=")
    expect(@key_help.char(187, "<shift>")).toEqual("+")
    expect(@key_help.char(186, "<no-shift>")).toEqual(";")
    expect(@key_help.char(186, "<shift>")).toEqual(":")

  # Numbered keys - alpha keyboard
    expect(@key_help.char(48, "<no-shift>")).toEqual("0")
    expect(@key_help.char(48, "<shift>")).toEqual(")")
    expect(@key_help.char(49, "<no-shift>")).toEqual("1")
    expect(@key_help.char(49, "<shift>")).toEqual("!")
    expect(@key_help.char(50, "<no-shift>")).toEqual("2")
    expect(@key_help.char(50, "<shift>")).toEqual("@")
    expect(@key_help.char(51, "<no-shift>")).toEqual("3")
    expect(@key_help.char(51, "<shift>")).toEqual("#")
    expect(@key_help.char(52, "<no-shift>")).toEqual("4")
    expect(@key_help.char(52, "<shift>")).toEqual("$")
    expect(@key_help.char(53, "<no-shift>")).toEqual("5")
    expect(@key_help.char(53, "<shift>")).toEqual("%")
    expect(@key_help.char(54, "<no-shift>")).toEqual("6")
    expect(@key_help.char(54, "<shift>")).toEqual("^")
    expect(@key_help.char(55, "<no-shift>")).toEqual("7")
    expect(@key_help.char(55, "<shift>")).toEqual("&")
    expect(@key_help.char(56, "<no-shift>")).toEqual("8")
    expect(@key_help.char(56, "<shift>")).toEqual("*")
    expect(@key_help.char(57, "<no-shift>")).toEqual("9")
    expect(@key_help.char(57, "<shift>")).toEqual("(")

  # Numeric keypad
    expect(@key_help.char(96, "<no-shift>")).toEqual("0")
    expect(@key_help.char(96, "<shift>")).toEqual("0")
    expect(@key_help.char(97, "<no-shift>")).toEqual("1")
    expect(@key_help.char(97, "<shift>")).toEqual("1")
    expect(@key_help.char(98, "<no-shift>")).toEqual("2")
    expect(@key_help.char(98, "<shift>")).toEqual("2")
    expect(@key_help.char(99, "<no-shift>")).toEqual("3")
    expect(@key_help.char(99, "<shift>")).toEqual("3")
    expect(@key_help.char(100, "<no-shift>")).toEqual("4")
    expect(@key_help.char(100, "<shift>")).toEqual("4")
    expect(@key_help.char(101, "<no-shift>")).toEqual("5")
    expect(@key_help.char(101, "<shift>")).toEqual("5")
    expect(@key_help.char(102, "<no-shift>")).toEqual("6")
    expect(@key_help.char(102, "<shift>")).toEqual("6")
    expect(@key_help.char(103, "<no-shift>")).toEqual("7")
    expect(@key_help.char(103, "<shift>")).toEqual("7")
    expect(@key_help.char(104, "<no-shift>")).toEqual("8")
    expect(@key_help.char(104, "<shift>")).toEqual("8")
    expect(@key_help.char(105, "<no-shift>")).toEqual("9")
    expect(@key_help.char(105, "<shift>")).toEqual("9")
    expect(@key_help.char(107, "<no-shift>")).toEqual("+")
    expect(@key_help.char(107, "<shift>")).toEqual("+")
    expect(@key_help.char(109, "<no-shift>")).toEqual("-")
    expect(@key_help.char(109, "<shift>")).toEqual("-")
    expect(@key_help.char(106, "<no-shift>")).toEqual("*")
    expect(@key_help.char(106, "<shift>")).toEqual("*")
    expect(@key_help.char(111, "<no-shift>")).toEqual("/")
    expect(@key_help.char(111, "<shift>")).toEqual("/")
    expect(@key_help.char(110, "<no-shift>")).toEqual(".")
    expect(@key_help.char(110, "<shift>")).toEqual(".")

    # Alphabetic keys
    expect(@key_help.char(65, "<no-shift>")).toEqual("A")
    expect(@key_help.char(65, "<shift>")).toEqual("A")
    expect(@key_help.char(66, "<no-shift>")).toEqual("B")
    expect(@key_help.char(66, "<shift>")).toEqual("B")
    expect(@key_help.char(72, "<no-shift>")).toEqual("H")
    expect(@key_help.char(72, "<shift>")).toEqual("H")
    expect(@key_help.char(78, "<no-shift>")).toEqual("N")
    expect(@key_help.char(78, "<shift>")).toEqual("N")
    expect(@key_help.char(81, "<no-shift>")).toEqual("Q")
    expect(@key_help.char(81, "<shift>")).toEqual("Q")
    expect(@key_help.char(85, "<no-shift>")).toEqual("U")
    expect(@key_help.char(85, "<shift>")).toEqual("U")
    expect(@key_help.char(88, "<no-shift>")).toEqual("X")
    expect(@key_help.char(88, "<shift>")).toEqual("X")
    expect(@key_help.char(90, "<no-shift>")).toEqual("Z")
    expect(@key_help.char(90, "<shift>")).toEqual("Z")

    # Other keys
    expect(@key_help.char(188, "<no-shift>")).toEqual(",")
    expect(@key_help.char(188, "<shift>")).toEqual("<")
    expect(@key_help.char(190, "<no-shift>")).toEqual(".")
    expect(@key_help.char(190, "<shift>")).toEqual(">")
    expect(@key_help.char(191, "<no-shift>")).toEqual("/")
    expect(@key_help.char(191, "<shift>")).toEqual("?")
    expect(@key_help.char(192, "<no-shift>")).toEqual("`")
    expect(@key_help.char(192, "<shift>")).toEqual("~")
    expect(@key_help.char(219, "<no-shift>")).toEqual("[")
    expect(@key_help.char(219, "<shift>")).toEqual("{")
    expect(@key_help.char(221, "<no-shift>")).toEqual("]")
    expect(@key_help.char(221, "<shift>")).toEqual("}")
    expect(@key_help.char(222, "<no-shift>")).toEqual("'")
    expect(@key_help.char(222, "<shift>")).toEqual('"')


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
