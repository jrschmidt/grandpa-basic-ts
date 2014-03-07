class Gb80Console

  constructor: () ->
    @line = new ConsoleLine

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
      return ""



class ConsoleLine

  constructor: () ->
    @text = ""


  set_text: (string) ->
    @text = string


  get_text: () ->
    return @text


