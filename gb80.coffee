class BasicProgram



class ConsoleText

  constructor: () ->
    @line_buffer = new LineBuffer

    @reset()


  reset: () ->
    @status = "clean"
    @lines = []


  addline: (line) ->
    @lines.push(line)


  fetch: (n) ->
    if n>=0 && n<@lines.length
      return @lines[n]
    else
      return {}


  load_line_buffer: (n) ->
    if n>=@lines.length
      text = ""
    else
      text = @lines[n]
    @line_buffer.set_text(text)



class BasicProgramLine

  constructor: (n,str) ->
    @ln_no = n
    @text = str
    @parse_object = {}



class LineBuffer

  constructor: () ->
    @text = ""


  set_text: (string) ->
    @text = string


  get_text: () ->
    return @text


