describe "BASIC Console", ->

  beforeEach ->
    @console = new BasicConsole
    @console.log_chars = true


  it "should print a character at a given location", ->
    @console.ch("A",1,0)
    expect(@console.msg).toEqual("A [1,0]")
    @console.ch("B",1,10)
    expect(@console.msg).toEqual("B [1,10]")
    @console.ch("C",1,20)
    expect(@console.msg).toEqual("C [1,20]")
    @console.ch("D",1,30)
    expect(@console.msg).toEqual("D [1,30]")
    @console.ch("E",1,40)
    expect(@console.msg).toEqual("E [1,40]")
    @console.ch("F",1,50)
    expect(@console.msg).toEqual("F [1,50]")
    @console.ch("G",1,60)
    expect(@console.msg).toEqual("G [1,60]")

    @console.ch("H",2,5)
    expect(@console.msg).toEqual("H [2,5]")
    @console.ch("I",2,15)
    expect(@console.msg).toEqual("I [2,15]")
    @console.ch("J",2,25)
    expect(@console.msg).toEqual("J [2,25]")
    @console.ch("K",2,35)
    expect(@console.msg).toEqual("K [2,35]")
    @console.ch("L",2,45)
    expect(@console.msg).toEqual("L [2,45]")
    @console.ch("M",2,55)
    expect(@console.msg).toEqual("M [2,55]")

    @console.ch("N",3,0)
    expect(@console.msg).toEqual("N [3,0]")
    @console.ch("O",3,10)
    expect(@console.msg).toEqual("O [3,10]")
    @console.ch("P",3,20)
    expect(@console.msg).toEqual("P [3,20]")
    @console.ch("Q",3,30)
    expect(@console.msg).toEqual("Q [3,30]")
    @console.ch("R",3,40)
    expect(@console.msg).toEqual("R [3,40]")
    @console.ch("S",3,50)
    expect(@console.msg).toEqual("S [3,50]")
    @console.ch("T",3,60)
    expect(@console.msg).toEqual("T [3,60]")

    @console.ch("U",4,5)
    expect(@console.msg).toEqual("U [4,5]")
    @console.ch("V",4,15)
    expect(@console.msg).toEqual("V [4,15]")
    @console.ch("W",4,25)
    expect(@console.msg).toEqual("W [4,25]")
    @console.ch("X",4,35)
    expect(@console.msg).toEqual("X [4,35]")
    @console.ch("Y",4,45)
    expect(@console.msg).toEqual("Y [4,45]")
    @console.ch("Z",4,55)
    expect(@console.msg).toEqual("Z [4,55]")

    @console.ch("0",5,20)
    expect(@console.msg).toEqual("0 [5,20]")

    @console.ch("1",6,21)
    expect(@console.msg).toEqual("1 [6,21]")

    @console.ch("2",7,22)
    expect(@console.msg).toEqual("2 [7,22]")

    @console.ch("3",8,23)
    expect(@console.msg).toEqual("3 [8,23]")

    @console.ch("4",9,24)
    expect(@console.msg).toEqual("4 [9,24]")

    @console.ch("5",10,25)
    expect(@console.msg).toEqual("5 [10,25]")

    @console.ch("6",11,26)
    expect(@console.msg).toEqual("6 [11,26]")

    @console.ch("7",12,27)
    expect(@console.msg).toEqual("7 [12,27]")

    @console.ch("8",13,28)
    expect(@console.msg).toEqual("8 [13,28]")

    @console.ch("9",14,29)
    expect(@console.msg).toEqual("9 [14,29]")


  it "should print a string of characters", ->
    @console.print("10 REM - WELCOME TO GRANDPA BASIC 1980")
    expect(@console.msg).toEqual("10 REM - WELCOME TO GRANDPA BASIC 1980")


  it "should clear the screen of text", ->
    @console.clear()
    expect(@console.msg).toEqual("")


  it "should print multiple lines of text", ->
    @console.println('10 REM - WELCOME TO GRANDPA BASIC 1980')
    expect(@console.msg).toEqual('10 REM - WELCOME TO GRANDPA BASIC 1980')

    @console.println('20 $T = "JOHN"')
    expect(@console.msg).toEqual('20 $T = "JOHN"')

    @console.println('30 INPUT "DISPLAY NAME (Y/N)?";$Y')
    expect(@console.msg).toEqual('30 INPUT "DISPLAY NAME (Y/N)?";$Y')

    @console.println('40 IF $Y<>"Y" THEN 100')
    expect(@console.msg).toEqual('40 IF $Y<>"Y" THEN 100')

    @console.println('50 PRINT "WRITTEN BY "+$T')
    expect(@console.msg).toEqual('50 PRINT "WRITTEN BY "+$T')

    @console.println('100 PRINT "OK BYE"')
    expect(@console.msg).toEqual('100 PRINT "OK BYE"')

    @console.println('999 END')
    expect(@console.msg).toEqual('999 END')


