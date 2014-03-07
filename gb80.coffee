class Gb80Console

  constructor: () ->
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
