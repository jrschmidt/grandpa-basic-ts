class BasicProgram

  constructor: () ->
    @lines = []


  addline: (n, text) ->
    existing = @lines.filter( (ln) -> ln.ln_no == n )
    if existing.length == 0
      @lines.push( { "ln_no" : n, "text" : text } )
    else
      existing[0].text = text


  fetch: (line_no) ->
    existing = @lines.filter( (ln) -> ln.ln_no == line_no )
    if existing.length == 0
      return {}
    else
      return existing[0]


  remove: (line_no) ->
    line = @fetch(line_no)
    if line != {}
      line.ln_no = null
      line.text = null



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


