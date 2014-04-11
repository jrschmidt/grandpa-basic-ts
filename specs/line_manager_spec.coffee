describe "Program line manager", ->

  beforeEach ->


    @prog_lines = new ProgramLineManager

    @prog_lines.lines["10"] = {line_no: 10, text: '10 REM' }
    @prog_lines.lines["20"] = {line_no: 20, text: '20 REM WELCOME TO GRANDPA BASIC 1980' }
    @prog_lines.lines["30"] = {line_no: 30, text: '30 D=477+B' }
    @prog_lines.lines["40"] = {line_no: 40, text: '40 $E=$M+" IS NOT COMPLETE"' }
    @prog_lines.lines["520"] = {line_no: 520, text: '520 GOTO 880' }
    @prog_lines.lines["320"] = {line_no: 320, text: '320 GOSUB 1200' }
    @prog_lines.lines["1299"] = {line_no: 1299, text: '1299 RETURN' }
    @prog_lines.lines["150"] = {line_no: 150, text: '150 IF Z<0 THEN 340' }
    @prog_lines.lines["610"] = {line_no: 610, text: '610 IF $T="INCOMPLETE" THEN 1680' }
    @prog_lines.lines["110"] = {line_no: 110, text: '110 INPUT R' }
    @prog_lines.lines["120"] = {line_no: 120, text: '120 INPUT $V' }
    @prog_lines.lines["130"] = {line_no: 130, text: '130 INPUT "HOW MANY?";M' }
    @prog_lines.lines["140"] = {line_no: 140, text: '140 INPUT "LAST NAME?";$N2' }
    @prog_lines.lines["340"] = {line_no: 340, text: '340 PRINT "WELCOME TO GRANDPA BASIC 1980"' }
    @prog_lines.lines["350"] = {line_no: 350, text: '350 PRINT $Z1' }
    @prog_lines.lines["360"] = {line_no: 360, text: '360 PRINT "LAST NAME = "+$N4' }
    @prog_lines.lines["470"] = {line_no: 470, text: '470 PRINTLN' }
    @prog_lines.lines["480"] = {line_no: 480, text: '480 PRINTLN "WELCOME TO GRANDPA BASIC 1980"' }
    @prog_lines.lines["490"] = {line_no: 490, text: '490 PRINTLN $Z1' }
    @prog_lines.lines["940"] = {line_no: 940, text: '940 CLEARSCRN' }
    @prog_lines.lines["870"] = {line_no: 870, text: '870 TAB 28' }
    @prog_lines.lines["880"] = {line_no: 880, text: '880 TAB 12,44' }
    @prog_lines.lines["999"] = {line_no: 999, text: '999 END' }


  it "should list all program lines in correct order", ->

    list = @prog_lines.list()
    expect(list.length).toEqual(23)
    expect(list[0]).toEqual('10 REM')
    expect(list[8]).toEqual('150 IF Z<0 THEN 340')
    expect(list[11]).toEqual('350 PRINT $Z1')
    expect(list[16]).toEqual('520 GOTO 880')
    expect(list[21]).toEqual('999 END')
    expect(list[22]).toEqual('1299 RETURN')
    

  it "should clear all program lines", ->

    list = @prog_lines.list()
    expect(list.length).toEqual(23)
    @prog_lines.clear()
    list = @prog_lines.list()
    expect(list.length).toEqual(0)


  it "should add a program line, or change it if it already exists", ->

    list = @prog_lines.list()
    expect(list.length).toEqual(23)

    @prog_lines.add_or_change(15, '15 REM WELCOME TO LINE 15')
    list = @prog_lines.list()
    expect(list.length).toEqual(24)
    expect(list[0]).toEqual('10 REM')
    expect(list[1]).toEqual('15 REM WELCOME TO LINE 15')
    expect(list[6]).toEqual('120 INPUT $V')
    expect(list[12]).toEqual('350 PRINT $Z1')
    expect(list[21]).toEqual('940 CLEARSCRN')
    expect(list[23]).toEqual('1299 RETURN')

    @prog_lines.add_or_change(400, '400 $Z7 = ""')
    list = @prog_lines.list()
    expect(list.length).toEqual(25)
    expect(list[3]).toEqual('30 D=477+B')
    expect(list[14]).toEqual('400 $Z7 = ""')
    expect(list[19]).toEqual('610 IF $T="INCOMPLETE" THEN 1680')
    expect(list[24]).toEqual('1299 RETURN')

    expect(list[5]).toEqual('110 INPUT R')
    expect(list.length).toEqual(25)
    @prog_lines.add_or_change(110, '110 INPUT R4')
    list = @prog_lines.list()
    expect(list.length).toEqual(25)
    expect(list[5]).toEqual('110 INPUT R4')
    expect(list[14]).toEqual('400 $Z7 = ""')
    expect(list[19]).toEqual('610 IF $T="INCOMPLETE" THEN 1680')
    expect(list[24]).toEqual('1299 RETURN')


  it "should delete a designated line, or do nothing if that line number doesn't exist", ->

    list = @prog_lines.list()
    expect(list.length).toEqual(23)

    @prog_lines.remove(130)
    list = @prog_lines.list()
    expect(list.length).toEqual(22)
    expect(list[5]).toEqual('120 INPUT $V')
    expect(list[6]).toEqual('140 INPUT "LAST NAME?";$N2')

    @prog_lines.remove(140)
    list = @prog_lines.list()
    expect(list.length).toEqual(21)
    expect(list[5]).toEqual('120 INPUT $V')
    expect(list[6]).toEqual('150 IF Z<0 THEN 340')

    @prog_lines.remove(20)
    list = @prog_lines.list()
    expect(list.length).toEqual(20)
    expect(list[0]).toEqual('10 REM')
    expect(list[1]).toEqual('30 D=477+B')

    @prog_lines.remove(550)
    list = @prog_lines.list()
    expect(list.length).toEqual(20)

    @prog_lines.remove(720)
    list = @prog_lines.list()
    expect(list.length).toEqual(20)




