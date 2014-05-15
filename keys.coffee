
class KeyTalker

  constructor: () ->
    @console = new BasicConsole
    @keys = @console.keys
    @buffer = @console.buffer


  handle: (ch_num) ->
    @console.ch(@keys.char(ch_num))



class BasicConsole

  constructor: ->
    @sprites = document.getElementById("chars")
    @keys = new KeyHelper
    @canvas = document.getElementById('canvas')
    @context = @canvas.getContext('2d')
    @line = -1
    @column = 80 
    @clear()


  print: (string) ->
    for ch in string
      if ch == " "
        @next_char_loc()
      else
        @ch(ch)
    @msg = string


  println: (string) ->
    if @column > 0
      @line = @line + 1
      @column = 0
    console.log "PRINTLN: #{string}"
    @print(string)


  ch: (ch) ->
    loc = @next_char_loc()
    @ch_ln_col(ch, loc[0], loc[1])


  ch_ln_col: (ch, line, col) ->
    @msg = "#{ch} [#{line},#{col}]"
    console.log "draw #{ch} at line #{line}, col #{col}"
    if ch != " "
      sprite = @keys.sprite_xy(ch)
      @context.drawImage(@sprites,sprite[0],sprite[1],11,18,col*11,line*18,11,18)


  clear: ->
    @msg = ""
    @context.clearRect(0,0,1200,400)


  next_char_loc: ->
    if @column >= 79
      @line = @line + 1
      @column = 0
    else
      @column = @column + 1
    return [@line, @column]



class KeyHelper

  constructor: ->
    @code = [33,34,35,36,37,38,39,
             40,41,42,43,44,45,46,47,48,49,
             50,51,52,53,54,55,56,57,58,59,
             60,61,62,63,64,
             94,95,96,97,98,99,
             100,101,102,103,104,105,106,107,108,109,
             110,111,112,113,114,115,116,117,118,119,
             120,121,122,123,124,125,126]

    @chars = [ "!", '"', "#", "$", "%", "&", "'",
               "(", ")", "*", "+", ",", "-", ".", "/", "0", "1",
               "2", "3", "4", "5", "6", "7", "8", "9", ":", ";",
               "<", "=", ">", "?", "@",
               "^", "_", "`", "A", "B", "C",
               "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
               "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
               "X", "Y", "Z", "{", "|", "}","~" ]

    @xy = [ [99,72], [33,72], [33,90], [77,72], [88,72], [44,90], [22,72],
            [66,54], [77,54], [33,54], [11,54], [55,72], [22,54], [44,72], [44,54], [0,36], [11,36],
            [22,36], [33,36], [44,36], [55,36], [66,36], [77,36], [88,36], [99,36], [0,72], [11,72],
            [88,54], [0,54], [99,54], [66,72], [22,90],
            [55,54], [55,90], [0,90], [0,0], [11,0], [22,0],
            [33,0], [44,0], [55,0], [66,0], [77,0], [88,0], [99,0], [110,0], [121,0], [132,0],
            [0,18], [11,18], [22,18], [33,18], [44,18], [55,18], [66,18], [77,18], [88,18], [99,18],
            [110,18], [121,18], [132,18], [66,90], [99,90], [77,90],[11,90] ]


  char: (n) ->
    console.log "char(): n = #{n}"
    n = n + 32 if n in [65..90] # Treat alpha keypress the same without regard to SHIFT
    if n in @code
      i = @code.indexOf(n)
      ch = @chars[i]
    else
      if n == 32
        ch = " "
      else
        ch = null
    return ch


  sprite_xy: (ch) ->
    if ch in @chars
      i = @chars.indexOf(ch)
      return @xy[i]



@keyevent = (e) ->
  e.preventDefault() if @disable_key_defaults
  ch_num = e.charCode
  @app.handle(ch_num)


start = () ->
  @canvas = document.getElementById("canvas")
  @canvas.setAttribute('tabindex','0')
  @canvas.focus()
  @disable_key_defaults = true
  @app = new KeyTalker


window.onload = start

