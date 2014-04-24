describe "BASIC Console", ->

  beforeEach ->
    @console = new BasicConsole
    @console.log_chars = true


  it "should print a character at a given location", ->
    @console.ch_ln_col("A",1,0)
    expect(@console.msg).toEqual("A [1,0]")
    @console.ch_ln_col("B",1,10)
    expect(@console.msg).toEqual("B [1,10]")
    @console.ch_ln_col("C",1,20)
    expect(@console.msg).toEqual("C [1,20]")
    @console.ch_ln_col("D",1,30)
    expect(@console.msg).toEqual("D [1,30]")
    @console.ch_ln_col("E",1,40)
    expect(@console.msg).toEqual("E [1,40]")
    @console.ch_ln_col("F",1,50)
    expect(@console.msg).toEqual("F [1,50]")
    @console.ch_ln_col("G",1,60)
    expect(@console.msg).toEqual("G [1,60]")

    @console.ch_ln_col("H",2,5)
    expect(@console.msg).toEqual("H [2,5]")
    @console.ch_ln_col("I",2,15)
    expect(@console.msg).toEqual("I [2,15]")
    @console.ch_ln_col("J",2,25)
    expect(@console.msg).toEqual("J [2,25]")
    @console.ch_ln_col("K",2,35)
    expect(@console.msg).toEqual("K [2,35]")
    @console.ch_ln_col("L",2,45)
    expect(@console.msg).toEqual("L [2,45]")
    @console.ch_ln_col("M",2,55)
    expect(@console.msg).toEqual("M [2,55]")

    @console.ch_ln_col("N",3,0)
    expect(@console.msg).toEqual("N [3,0]")
    @console.ch_ln_col("O",3,10)
    expect(@console.msg).toEqual("O [3,10]")
    @console.ch_ln_col("P",3,20)
    expect(@console.msg).toEqual("P [3,20]")
    @console.ch_ln_col("Q",3,30)
    expect(@console.msg).toEqual("Q [3,30]")
    @console.ch_ln_col("R",3,40)
    expect(@console.msg).toEqual("R [3,40]")
    @console.ch_ln_col("S",3,50)
    expect(@console.msg).toEqual("S [3,50]")
    @console.ch_ln_col("T",3,60)
    expect(@console.msg).toEqual("T [3,60]")

    @console.ch_ln_col("U",4,5)
    expect(@console.msg).toEqual("U [4,5]")
    @console.ch_ln_col("V",4,15)
    expect(@console.msg).toEqual("V [4,15]")
    @console.ch_ln_col("W",4,25)
    expect(@console.msg).toEqual("W [4,25]")
    @console.ch_ln_col("X",4,35)
    expect(@console.msg).toEqual("X [4,35]")
    @console.ch_ln_col("Y",4,45)
    expect(@console.msg).toEqual("Y [4,45]")
    @console.ch_ln_col("Z",4,55)
    expect(@console.msg).toEqual("Z [4,55]")

    @console.ch_ln_col("0",5,20)
    expect(@console.msg).toEqual("0 [5,20]")

    @console.ch_ln_col("1",6,21)
    expect(@console.msg).toEqual("1 [6,21]")

    @console.ch_ln_col("2",7,22)
    expect(@console.msg).toEqual("2 [7,22]")

    @console.ch_ln_col("3",8,23)
    expect(@console.msg).toEqual("3 [8,23]")

    @console.ch_ln_col("4",9,24)
    expect(@console.msg).toEqual("4 [9,24]")

    @console.ch_ln_col("5",10,25)
    expect(@console.msg).toEqual("5 [10,25]")

    @console.ch_ln_col("6",11,26)
    expect(@console.msg).toEqual("6 [11,26]")

    @console.ch_ln_col("7",12,27)
    expect(@console.msg).toEqual("7 [12,27]")

    @console.ch_ln_col("8",13,28)
    expect(@console.msg).toEqual("8 [13,28]")

    @console.ch_ln_col("9",14,29)
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


