# *** ***                        *** ***
# *** ***   GRANDPA BASIC 1980   *** ***
# *** ***                        *** ***

# Emulates the action of a computing platform in common use around the year
# 1980 - a dedicated machine hard-wired for writing and executing programs
# written in a line numbered version of BASIC, based on the original Dartmouth
# BASIC. ALL code was prefixed with line numbers, and execution proceeded
# sequentially according to line number except where control structures such as
# GOTO or IF - THEN diverted execution elsewhere. These machines, at first, had
# monochrome monitors that only printed uppercase letters.
#
# This app uses Javascript code, from source written in Coffeescript, to act
# upon an HTML5 canvas element designed to resemble the look of the original
# platform. Event handling classes echo key press events by printing the
# characters onto the 'console' (the canvas element) and filling a line buffer.
# When the <enter> key is pressed, the ActionController tries to parse the
# string and build a line object.
#
# Each line object has a "command" property which identifies the type of
# command or program line statement it is, as well as other properties which
# vary for each type. The test specs are a good resource for describing the
# exact format for each type of program line object. Console commands such as
# RUN or LIST are executed immediately. Line numbered program statements are
# entered into the collection of program line objects, either as a new line if
# that line number isn't yet in use, or changing the object for an existing
# line number.
#
# When a RUN command is executed, the ProgramController and ProgramRunner
# classes try to interpret each program line object, accessing them sequentially
# according to line number except where program execution is rerouted to
# another line number. Values for numeric and string variables are stored in
# VariableRegister objects, and output is written to the console emulator.



class KeyTalker
  # Handles keyboard input received from the canvas element and takes
  # appropriate action.

  constructor: ->
    @bconsole = new BasicConsole
    @controller = new ActionController(this)
    @keys = @bconsole.keys


  handle: (ch_num, ch_key) ->
    if ch_num > 0
      @bconsole.ch(@keys.char(ch_num)) # TODO Change ch() to add_ch() ??
    else
      @bconsole.backspace() if ch_key == 8
      if ch_key == 13
        line = @bconsole.enter_line()
        @controller.process_line(line)



class ActionController
  # When a line is entered, tries to parse the string and build a line object.
  # Adds or amends a line number object, or executes a console command such as
  # RUN or LIST.

  constructor: (key_talker)->
    @keys = key_talker
    @bconsole = @keys.bconsole
    @parser = new LineParser
    @formatter = new ProgramLineBuilder
    @lines = new ProgramLineListing
    @program = new ProgramController(this)


  process_line: (string) ->
    console.log " "
    console.log "ActionController#process_line"
    console.log "   line = #{string}"
    line_object = @build_line_object(string)
    for k,v of line_object
      console.log "   #{k} : #{v}"
    if line_object.line_no
      @lines.add_or_change(line_object)
    else
      switch line_object.command
        when "<list_command>"
          console.log " "
          console.log "LIST"
          lines = @lines.list()
          console.log "@lines.list() returned #{lines.length} items"
          console.log(line.text) for line in lines
          @bconsole.println(line.text) for line in lines
        when "<run_command>"
          console.log "RUN"
          @run_program()
        when "<clear_command>"
          console.log "CLEAR"
        when "<info_command>"
          console.log "INFO"
        else
          console.log "ERROR"


  run_program: ->
    line_objects = @lines.get_program_objects()
    console.log " "
    console.log "RUN_PROG:"
    console.log "   #{line_objects.length} lines"
    @program.load(line_objects)
#    next = @program.next_line_no
#    while ( next and (next > 0) )
#    until ( next and (next > 0) )
    while true
      console.log "trying to run line ..."
      @program.run_next_line()


  build_line_object: (string) ->
    parse_object = @parser.parse(string)
    if parse_object == "<parse_error>"
      return "<parse_error>"
    else
      return @formatter.format(parse_object, string)



class ProgramController
  # Methods to manage program lines.

  constructor: (action_controller)->
    @controller = action_controller
    @bconsole = @controller.bconsole
    @commands = new ProgramRunner
    @lines = {}
    @line_order = []
    @next_line_index = -1
    @next_line_no = 0
    @return_line_no = 0
    @return_line_index = 0
    @output = ""
    @line_result = {}


  load: (lines) ->
    @lines = lines
    @line_order = @sort_lines(lines)
    if @line_order.length > 0
      @next_line_index = 0
      @next_line_no = @line_order[0] if @line_order.length > 0
    console.log "   LOADED: #{@line_order.length} lines"
    console.log "   line_order = [#{@line_order}]"
    console.log "   lines ="
    for line in @lines
      console.log " "
      console.log "      #{k} : #{v}" for k,v of line


  run_next_line: ->
    console.log " "
    console.log "run_next_line():"
    console.log "   next_line_no = #{@next_line_no}"
    line_object = @lines[@next_line_no.toString()]
    @line_result = @commands.run_command(line_object)
    @gb_output(@line_result.output) if @line_result.hasOwnProperty("output")
    if @line_result.hasOwnProperty("sub")
      if @line_result.sub == "return"
        @next_line_no = @return_line_no
        @next_line_index = @return_line_index
        @return_line_no = 0
        @return_line_index = 0
      else
        if @line_result.sub == "yes"
          @update_next_line()
          @return_line_no = @next_line_no
          @return_line_index = @next_line_index
        @reset_line_no(@line_result.jump)
    else
      @update_next_line()


  update_next_line: -> #TODO rename as increment_line_number() or goto_next_line()
    @next_line_index += 1
    if @next_line_index < @line_order.length
      @next_line_no = @line_order[@next_line_index]
    else
      @next_line_no = 0


  reset_line_no: (dest) ->
    @next_line_index = @line_order.indexOf(dest)
    if @next_line_index < @line_order.length
      @next_line_no = @line_order[@next_line_index]
    else
      @next_line_no = 0


  # TODO This method should be renamed.
  gb_output: (string) ->
    if string != ""
      @output = string
      @bconsole.println(string)


  sort_lines: (lines) ->
    unsorted = []
    unsorted.push(line.line_no) for key,line of lines
    return unsorted.sort (a,b) -> a-b



class ProgramRunner
  # The class responsible for interpreting program line objects and executing
  # them when the program is run.

  constructor: ->
    @helpers = new InterpreterHelpers
    @num_vars = @helpers.num_vars
    @str_vars = @helpers.str_vars
    @num_eval = @helpers.num_eval
    @str_eval = @helpers.str_eval
    @bx_eval = @helpers.bx_eval


  run_command: (line_object) ->
    switch line_object.command
      when "<remark>"
        @line_result = {}
      when "<numeric_assignment>"
        @line_result = @run_num_assign(line_object)
      when "<string_assignment>"
        @line_result = @run_str_assign(line_object)
      when "<goto>"
        @line_result = @run_goto(line_object)
      when "<gosub>"
        @line_result = @run_gosub(line_object)
      when "<return>"
        @line_result = @run_return(line_object)
      when "<if>"
        @line_result = @run_if(line_object)
      when "<print>"
        @line_result = @run_print(line_object)
      when "<end>"
        @line_result = @run_end(line_object)
      else
        @line_result = {}


  run_num_assign: (line_object) ->
    @num_vars.set( line_object.operand, @num_eval.val(line_object.expression) )
    return {}


  run_str_assign: (line_object) ->
    @str_vars.set( line_object.operand, @str_eval.val(line_object.expression) )
    return {}


  run_goto: (line_object) ->
    dest = line_object.dest
    return {jump: dest, sub: "no"}


  run_if: (line_object) ->
    dest = line_object.dest
    if @bx_eval.val(line_object.cond)
      return {jump: dest, sub: "no"}
    else
      return {}


  run_gosub: (line_object) ->
    dest = line_object.dest
    return {jump: dest, sub: "yes"}


  run_return: (line_object) ->
    return {sub: "return"}


  run_print: (line_object) ->
    string = @str_eval.val(line_object.expression)
    return {output: string}


  run_end: (line_object) ->
    return {jump: 0, sub: "no"}



class SyntaxRules
  # Constants to describe the syntax and format for valid program lines and
  # console commands.

  constructor: ->

    @keywords = [
      "CLEAR"
      "RUN"
      "INFO"
      "LIST"
      "REM"
      "GOTO"
      "GOSUB"
      "RETURN"
      "IF"
      "THEN"
      "INPUT"
      "PRINT"
      "PRINTLN"
      "CLEARSCRN"
      "TAB"
      "END"]

    @keyword_tokens = [
      "<clear_command>"
      "<run_command>"
      "<info_command>"
      "<list_command>"
      "<remark>"
      "<goto>"
      "<gosub>"
      "<return>"
      "<if>"
      "<then>"
      "<input>"
      "<print>"
      "<print_line>"
      "<clear_screen>"
      "<tab>"
      "<end>"]

    @char_tokens = [
      "<sp>"
      "<equals>"
      "<semicolon>"
      "<comma>"]

    @chars = " =;,"

    @action_tokens = [
      "<line_number>"
      "<line_number_statement>"
      "<input_statement>"
      "<number_variable>"
      "<string_variable>"
      "<numeric_expression>"
      "<string_expression>"
      "<boolean_expression>"
      "<string>"
      "<characters>"
      "<integer>"]

    @rules = [
      ["CLEAR"]
      ["RUN"]
      ["INFO"]
      ["LIST"]
      ["<line_number>","<sp>","<line_number_statement>"]
    ]

    # @line_number_rules[] and @input_statement_rules[] are written this
    # way to emulate multi-line nested arrays. (Coffeescript multi-line
    # array syntax seems to only work for one level of nesting.)
    @line_number_rules = [
        ["REM","<sp>","<characters>"]
        ["REM"]
        ["<number_variable>","<equals>","<numeric_expression>"]
        ["<string_variable>","<equals>","<string_expression>"]
        ["GOTO","<sp>","<line_number>"]
        ["GOSUB","<sp>","<line_number>"]
        ["RETURN"]
        ["IF","<sp>","<boolean_expression>","<sp>","THEN","<sp>","<line_number>"]
        ["INPUT","<sp>","<input_statement>"]
        ["PRINT","<sp>","<string_expression>"]
        ["PRINTLN","<sp>","<string_expression>"]
        ["PRINTLN"]
        ["CLEARSCRN"]
        ["TAB","<sp>","<integer>","<comma>","<integer>"]
        ["TAB","<sp>","<integer>"]
        ["END"]
    ]

    @input_statement_rules = [
      ["<number_variable>"]
      ["<string_variable>"]
      ["<string>","<semicolon>","<number_variable>"]
      ["<string>","<semicolon>","<string_variable>"]
    ]



class LineParser
  # Attempts to parse a line of input into an array of valid parse tokens.

  constructor: ->
    @helpers = new ParseHelpers
    @syntax = @helpers.syntax
    @rules = @syntax.rules
    @ln_rules = @syntax.line_number_rules
    @input_rules = @syntax.input_statement_rules


  parse: (string) ->
    match = "no"
    for rule in @rules
      if match == "no"
        result = @look_for(string,rule)
        match = result.match
    if match == "yes"
      result.parse_object = "<parse_error>" if result.remainder.length > 0
      return result.parse_object
    else
      return "<parse_error>"


  # Check the string against a specific syntax rule
  look_for: (string,rule) ->
    parse_object = []
    rule_match = "unknown"
    for token in rule
      if rule_match != "no"
        cat = "none"
        cat = "keyword" if token in @syntax.keywords
        cat = "char" if token in @syntax.char_tokens
        cat = "action" if token in @syntax.action_tokens
        switch cat
          when "keyword"
            token_result = @look_for_keyword(token,string)
          when "char"
            token_result = @look_for_char(token,string)
          when "action"
            token_result = @look_for_action(token,string)
          else
            token_result = {match: "no"}
        if token_result.match == "yes"
          parse_object.push(tk) for tk in token_result.parse_object
          if string
            string = token_result.remainder
          else
            string = ""
        else
          rule_match = "no"
    if rule_match == "no"
      result = {match: "no", remainder: "" }
    else
      result = {
        match: "yes"
        parse_object: parse_object }
      if string
        result.remainder = string
      else
        result.remainder = ""
    return result


  # Check for a specific literal keyword
  look_for_keyword: (token,string) ->
    find = string.indexOf(token)
    if find == 0
      i = @syntax.keywords.indexOf(token)
      result = {
        match: "yes"
        parse_object: [@syntax.keyword_tokens[i]]
        remainder: string.slice(token.length) }
    else
      result = {match: "no"}
    return result


  # Check for the one specific character that matches the token
  look_for_char: (token,string) ->
    i = @syntax.char_tokens.indexOf(token)
    ch = string[0]
    if ch == @syntax.chars[i]
      result = {
        match: "yes"
        parse_object: [ token ]
        remainder: string.slice(1) }
    else
      result = {match: "no"}
    return result



  # Delegate to the 'look_for' method associated with a specific 'action' token
  look_for_action: (token,string) ->
    switch token
      when  "<line_number>"
        result = @helpers.look_for_line_number(string)
      when  "<line_number_statement>"
        result = @look_for_line_number_statement(string)
      when  "<input_statement>"
        result = @look_for_input_parameters(string)
      when  "<number_variable>"
        result = @helpers.look_for_numeric_identifier(string)
      when  "<string_variable>"
        result = @helpers.look_for_string_identifier(string)
      when  "<numeric_expression>"
        result = @helpers.num_exp_parser.numeric_parse(string)
      when  "<string_expression>"
        result = @helpers.str_exp_parser.string_value_parse(string)
      when  "<boolean_expression>"
        result = @helpers.bool_exp_parser.boolean_parse(string)
      when  "<string>"
        result = @helpers.look_for_string(string)
      when  "<characters>"
        result = @helpers.look_for_characters(string)
      when  "<integer>"
        result = @helpers.look_for_integer(string)
      else
        result = {match: "no"}
    return result


  # Cycle through the list of line-numbered statements
  look_for_line_number_statement: (string) ->
    match = "no"
    for rule in @ln_rules
      if match == "no"
        result = @look_for(string,rule)
        match = result.match
    if match == "yes"
      return result
    else
      return {match: "no" }


  # Cycle through the list of variants for input statements
  look_for_input_parameters: (string) ->
    match = "no"
    for rule in @input_rules
      if match == "no"
        result = @look_for(string,rule)
        match = result.match
    if match == "yes"
      return result
    else
      return {match: "no" }



class ParseHelpers
  # Container class for parse helper methods and classes.

  constructor: ->
    @syntax = new SyntaxRules
    @rules = @syntax.rules
    @num_exp_parser = new NumericExpressionParser
    @str_exp_parser = new StringExpressionParser
    @bool_exp_parser = new BooleanExpressionParser(this)


  look_for_line_number: (string) ->
    result = {}
    n = parseInt(string)
    if n>0
      result.match = "yes"
      result.parse_object = ["<line_number>", n]
      result.remainder = string.slice(String(n).length)
    else
      result = {match: "no"}
    return result


  look_for_numeric_identifier: (string) ->
    result = {}
    if string[0] in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      if string[1] in "0123456789"
        len = 2
      else
        len = 1
      if ( len == string.length ) or ( string[len] in "=+-*/^)" )
        result.match = "yes"
        id = string.slice(0,len)
        result.parse_object = ["<number_variable>", id]
        result.remainder = string.slice(len)
      else
        result = {match: "no"}
    else
      result = {match: "no"}
    return result


  look_for_string_identifier: (string) ->
    result = {}
    if string[0] == "$"
      if string[1] in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        if string[2] in "0123456789"
          len = 2
        else
          len = 1
      if ( len == string.length-1 ) or ( string[len+1] in "=+" )
        result.match = "yes"
        id = string.slice(1,len+1)
        result.parse_object = ["<string_variable>", id]
        result.remainder = string.slice(len+1)
      else
        result = {match: "no"}
    else
      result = {match: "no"}
    return result


  # All we need to pass here is any string of zero or more characters.
  look_for_characters: (string) ->
    result = {
      match: "yes"
      parse_object: [ "<characters>", string ]
      remainder: "" }
    return result


  # This method passes if the string contains one or more characters enclosed with
  # double quotation marks <">. Characters after the second double quote mark are
  # returned in the remainder string.
  look_for_string: (string) ->
    quote_check = (ch for ch in string when ch == '"')
    if quote_check.length >= 2 and string[0] == '"' and string.length > 2
      cut = string.indexOf('"',1)
      contents = string.slice(1,cut)
      remdr = string.slice(cut+1)
      result = {
        match: "yes"
        parse_object: [ "<string>", contents ]
        remainder: remdr }
    else
      result = {match: "no" }
    return result


  # If the first or first and second characters in string are digits, return the integer value
  look_for_integer: (string) ->
    if string[0] in "0123456789"
      if string[1] in "0123456789"
        int = Number(string[0..1])
        end = string.slice(2)
      else
        int = Number(string[0])
        end = string.slice(1)
      result = {
        match: "yes"
        parse_object: [ "<integer>", int ]
        remainder: end }
    else
      result = {match: "no"}
    return result



class NumericExpressionParser
  # Parses a numeric expression such as 'X' (a variable name), '3.1416' ( a
  # numeric literal value) or 'Z+100' ( a compound expression).

  constructor: ->
    @num_exp_chars = ["0","1","2","3","4","5","6","7","8","9",".","(",")","+","-","*","/","^"]
    @delimiters = ["(", ")", "+", "-", "*", "/", "^"]
    @symbols = ["<left>",
               "<right>",
               "<plus>",
               "<minus>",
               "<times>",
               "<divide>",
               "<power>"]


  numeric_parse: (string) ->
    bad_chars = string.search(/[^A-Z0-9\.+\-*/\^()]/)
    if bad_chars == -1
      po = ["<numeric_expression>"]
      ok = "yes"
      tokens = @tokenize(string)
      for tk in tokens
        if tk in @symbols
          po.push(tk)
        else
          val = @numeric_value(tk)
          if val[0] == "bad"
            ok = "no"
          else
            po.push(val[0])
            po.push(val[1])
      po.push("<num_exp_end>")
    else
      ok = "no"
    if ok == "yes"
      result = {
        match: "yes"
        parse_object: po }
    else
      result = {match: "no"}
    return result


  tokenize: (string) ->
    tokens = []
    buffer = ""
    for ch in string
      if ch in @delimiters
        if buffer != ""
          tokens.push(buffer)
          buffer = ""
        tokens.push(@symbols[@delimiters.indexOf(ch)])
      else
        buffer = buffer + ch
    tokens.push(buffer) if buffer != ""
    return tokens


  numeric_value: (string) ->
    val = []
    if string[0] in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      if (string.length == 1) or (string.length == 2 and string[1] in "0123456789")
        val[0] = "<number_variable>"
        val[1] = string
      else
        val = ["bad", "bad"]
    else
      non_numerics = "none"
      for ch in string
        if not (ch in "0123456789")
          if ch == "."
            non_numerics = "bad" if non_numerics == "one_period"
            non_numerics = "one_period" if non_numerics == "none"
          else
            non_numerics = "bad"
      if non_numerics != "bad"
        val[0] = "<numeric_literal>"
        val[1] = Number(string)
      else
        val = ["bad", "bad"]
    return val



class StringExpressionParser
  # Parses a string expression such as '$M' (a variable name), "HELLO" ( a
  # string literal value) or "$A+' IS A '+$B" ( a string expression).

  string_value_parse: (string) ->
    po = ["<string_expression>"]
    ok = "yes"
    tokens = @tokenize(string)
    for tk in tokens
      if tk == "<plus>"
        po.push("<plus>")
      else
        val = @string_value(tk)
        if val[0] == "bad"
          ok = "no"
        else
          po.push(val[0])
          po.push(val[1])
    po.push("<str_exp_end>")
    if ok == "yes"
      result = {
        match: "yes"
        parse_object: po }
    else
      result = {match: "no"}
    return result


  tokenize: (string) ->
    tokens = []
    buffer = ""
    for ch in string
      if ch == "+"
        if buffer != ""
          tokens.push(buffer)
          buffer = ""
        tokens.push("<plus>")
      else
        buffer = buffer + ch
    tokens.push(buffer) if buffer != ""
    return tokens


  string_value: (string) ->
    val = ["bad", "bad"]
    quote_check = (ch for ch in string when ch == '"')
    if quote_check.length == 2 and string[0] == '"' and string[string.length-1] == '"'
      val[0] = "<string_literal>"
      val[1] = string.slice(1,-1)
    else
      str_var = "no"
      if string.length in [2..3] and string[0] == "$"
        if string[1] in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          if string.length == 2
            str_var = "yes"
          else
            if string[2] in "0123456789" then str_var = "yes"
      if str_var == "yes"
        val[0] = "<string_variable>"
        val[1] = string.slice(1)
    return val



class BooleanExpressionParser
  # Parses a boolean expression such as 'N>0'.

  constructor: (parse_helpers) ->
    @helpers = parse_helpers


  boolean_parse: (string) ->
    prep = @strip_remainder(string)
    string = prep.string
    remainder = prep.remainder
    po = ["<boolean_expression>"]
    tokens = @split(string)
    if tokens != "<not_a_boolean_expression>"
      match = "yes"
      num_id = @helpers.look_for_numeric_identifier(tokens[0])
      if num_id.match == "yes"
        num_exp = @helpers.num_exp_parser.numeric_parse(tokens[2])
        if num_exp.match == "yes"
          po = po.concat(num_id.parse_object)
          po.push(tokens[1])
          po.push tk for tk in num_exp.parse_object
      else
        str_id = @helpers.look_for_string_identifier(tokens[0])
        if str_id.match == "yes"
          str_val = @helpers.str_exp_parser.string_value_parse(tokens[2])
          if str_val.match != "bad"
            po.push tk for tk in str_id.parse_object
            po.push("<equals>")
            po = po.concat(str_val.parse_object)
          else match = "no"
        else match = "no"
    else
      match = "no"
    if match == "yes"
      po.push("<bool_exp_end>")
      result = {
        match: "yes"
        parse_object: po
        remainder: remainder }
    else
      result = {match: "no"}
    return result


  # Cut off at second quote mark (string comparision) or first space
  strip_remainder: (string) ->
    cut = 0
    q1 = string.indexOf('"')
    q2 = string.lastIndexOf('"')
    if (q1 > 0) && (q1 != q2)
      cut = q2+1
    else
      sp = string.indexOf(" ")
      if sp>0
        cut = sp
      else
        cut = 0
    if cut > 0
      result = {
        string: string.slice(0,cut)
        remainder: string.slice(cut) }
    else
      result = {
        string: string
        remainder: "" }
    return result


  split: (string) ->
    po = []
    token = ""
    find = string.indexOf("<")
    if find > 0
      if string[find+1] == ">"
        token = "<not_equal>"
      else
        if string[find+1] == "="
          token = "<lesser_equal>"
        else
          token = "<lesser_than>"
    if token == ""
      find = string.indexOf(">")
      if find > 0
        if string[find+1] == "="
          token = "<greater_equal>"
        else
          token = "<greater_than>"
    if token == ""
      find = string.indexOf("=")
      token = "<equals>" if find > 0
    if token.length > 0
      po[0] = string.slice(0,find)
      po[1] = token
      if token in ["<not_equal>", "<lesser_equal>", "<greater_equal>"]
        cut = find+2
      else
        cut = find+1
      po[2] = string.slice(cut)
    else
      po = "<not_a_boolean_expression>"
    return po



class ProgramLineBuilder
  # Builds a program line object from an array of valid parse tokens. Each
  # line object has a "command" property which identifies which type of program
  # line statement or console command it represents, plus additional properties
  # specific to that type. The test specs are a good resource for describing the
  # exact format for each type of program line object.

  constructor: ->
    @num_exp = new NumExpBuilder
    @str_exp = new StrExpBuilder
    @bool_exp = new BoolExpBuilder(this)

  format: (parse_object, line_text) ->
    if parse_object[0] == "<line_number>"
      cmd = parse_object[3]
      switch cmd
        when "<remark>"
          line = @build_remark(parse_object)
        when "<number_variable>"
          line = @build_numeric_assignment(parse_object)
        when "<string_variable>"
          line = @build_string_assignment(parse_object)
        when "<goto>", "<gosub>"
          line = @build_cmd_with_dest(parse_object)
        when "<return>", "<clear_screen>", "<end>"
          line = @build_simple_cmd(parse_object)
        when "<if>"
          line = @build_if_cmd(parse_object)
        when "<input>"
          line = @build_input_cmd(parse_object)
        when "<print>", "<print_line>"
          line = @build_print_cmd(parse_object)
        when "<tab>"
          line = @build_tab_cmd(parse_object)
        else
          error = true
      if error
        line = {command: "<formatting_error>" }
      else
        line.line_no = parse_object[1]
        line.text = line_text
    else
      line = @build_console_command(parse_object)
    return line


  build_console_command: (parse_object) ->
    if parse_object.length == 1
      cmd = parse_object[0]
      switch cmd
        when "<clear_command>"
          return {command: "<clear_command>" }
        when "<run_command>"
          return {command: "<run_command>" }
        when "<info_command>"
          return {command: "<info_command>" }
        when "<list_command>"
          return {command: "<list_command>" }
        else
          return {command: "<formatting_error>" }
    else
      return {command: "<formatting_error>" }


  build_remark: (parse_object) ->
    return {command: "<remark>" }


  build_numeric_assignment: (parse_object) ->
    stack = parse_object[6..parse_object.length-1]
    nmx = @num_exp.build_nxp(stack)
    if nmx.malformed == "yes"
      line = {command: "<formatting_error>" }
    else
      line = {
        command: "<numeric_assignment>"
        operand: parse_object[4]
        expression: nmx }
    return line


  build_string_assignment: (parse_object) ->
    stack = parse_object[6..parse_object.length-1]
    str_exp = @str_exp.build_str_exp(stack)
    line = {
      command: "<string_assignment>"
      operand: parse_object[4]
      expression: str_exp }
    return line


  build_cmd_with_dest: (parse_object) ->
    return {
      command: parse_object[3]
      dest: parse_object[6] }


  build_simple_cmd: (parse_object) ->
    return {
      command: parse_object[3] }


  build_if_cmd: (parse_object) ->
    stack = parse_object[5..parse_object.length-6]

    bool_exp = @bool_exp.build_bool_exp(stack)
    line = {
      command: "<if>"
      dest: parse_object.pop()
      cond: bool_exp }
    return line


  build_input_cmd: (parse_object) ->
    if parse_object.length == 10
      op = parse_object[9]
      prompt = parse_object[6]
      if parse_object[8] == "<number_variable>"
        cmd = "<input_numeric_prompt>"
      else
        cmd = "<input_string_prompt>"
    else
      op = parse_object[6]
      prompt = "<no_prompt>"
      if parse_object[5] == "<number_variable>"
        cmd = "<input_numeric>"
      else
        cmd = "<input_string>"
    line = {
      command: cmd
      operand: op }
    line.prompt = prompt if prompt != "<no_prompt>"
    return line


  build_print_cmd: (parse_object) ->
    if parse_object.length == 4
      str_exp = [ ["<str>", ""] ]
    else
      stack = parse_object[5..parse_object.length-1]
      str_exp = @str_exp.build_str_exp(stack)
    line = {
      command: parse_object[3]
      expression: str_exp }
    return line


  build_tab_cmd: (parse_object) ->
    line = {}
    if parse_object.length == 10
      line.command = "<tab_line_col>"
      line.line = parse_object[6]
      line.col = parse_object[9]
    else
      line.command = "<tab_col>"
      line.col = parse_object[6]
    return line



class NumExpBuilder
  # Builds a numeric expression object from an array of parse tokens.
  #
  # The object for the simple variable name X will be:
  #   {exp: "<var>", name: "X"}.
  #
  # The object for a simple numeric literal such as 3.1416 will be:
  #   {exp: "<num>", value: 3.1416}.
  #
  # Compound numeric expressions are built into binary numeric expression
  # objects with three properties: The "exp" property will be a symbol denoting
  # the operator within the expression with the highest precedence. The values
  # of the "op1" and "op2" properties will be nested numeric expression objects.
  # So, for example, in the expression 3*A+2*B-5*C the "exp" property will be
  # "<plus>", the value of "op1" will be an object representing 3*A, and the
  # value of "op2" will be an object representing 2*B-5*C.

  constructor: ->

    @search_terms = [
      ["<plus>", "<minus>" ]
      ["<times>", "<divide>" ]
      ["<power>"]
      ["<numeric_literal>", "<number_variable>" ] ]


  build_nxp: (stack) ->
    first = stack.shift()
    last = stack.pop()
    if first == "<numeric_expression>" && last == "<num_exp_end>"
      nxp = @build_num_exp(stack)
    else
      nxp = { malformed: "yes" }
    this[kk] = vv for kk, vv of nxp
    return nxp

  # TODO Combine these two methods, then look for refactoring.

  build_num_exp: (stack) ->
    split_stack = @split(stack)
    if split_stack.malformed == "yes"
      nxp = { malformed: "yes" }
    else
      switch split_stack.exp
        when "<plus>", "<minus>", "<times>", "<divide>", "<power>"
          nxp = @build_binary_expression(split_stack)
        when "<numeric_literal>"
          nxp = @build_numeric_literal(split_stack)
        when "<number_variable>"
          nxp = @build_number_variable(split_stack)
        else
          nxp = { malformed: "yes" }
    return nxp


  build_binary_expression: (split_stack) ->
    result = {}
    left = @build_nxp(split_stack.left)
    right = @build_nxp(split_stack.right)
    if right.malformed == "yes" or left.malformed == "yes"
      result = { malformed: "yes" }
    else
      result = {
        exp: split_stack.exp
        op1: left
        op2: right }
    return result


  build_numeric_literal: (split_stack) ->
    result = {}
    if split_stack.right.length == 1
      result = {
        exp: "<num>"
        value: split_stack.right[0] }
    else result = { malformed: "yes" }
    return result


  build_number_variable: (split_stack) ->
    result = {}
    if split_stack.right.length == 1
      result = {
        exp: "<var>"
        name: split_stack.right[0] }
    else result = { malformed: "yes" }
    return result


  split: (stack) ->
    stack = @deparenthesize(stack)
    index = 999
    for level in @search_terms
      if index == 999
        for tt in level
          find = stack.indexOf(tt)
          index = find if find >= 0 && find < index
        if index < 999
          if index == 0
            exp = stack[0]
            left = []
            right = stack.slice(1)
          else
            exp = stack[index]
            left = stack[0..index-1]
            right = stack.slice(index+1)
            left = left[0] if Array.isArray(left[0])
            right = right[0] if Array.isArray(right[0])
            left.unshift("<numeric_expression>")
            left.push("<num_exp_end>")
            right.unshift("<numeric_expression>")
            right.push("<num_exp_end>")
          result = {
            exp: exp
            left: left
            right: right }
        else
          result = { malformed: "yes" }
    return result


  # Strip parentheses (<left> and <right> tokens) in an expression and replace
  # them with nested arrays of tokens.
  deparenthesize: (stack) ->
    ok = "yes"
    nesting = 0
    i = -1
    while stack.indexOf("<left>") >= 0 && ok == "yes"
      i = i+1
      if stack[i] == "<left>"
        left = i
        nesting = nesting + 1
      if stack[i] == "<right>"
        if nesting == 0
          ok = "no"
        else
          right = i
          new_stack = []
          new_stack.push(tk) for tk in stack[0..left-1] if left > 0
          nested_array = stack[left+1..right-1]
          new_stack.push(nested_array)
          new_stack.push(tk) for tk in stack[right+1..stack.length-1]
          stack = new_stack
          nesting = 0
          i = -1
    stack = stack[0] if stack.length == 1
    if ok == "bad"
      return { malformed: "yes" }
    else
      return stack



class StrExpBuilder
  # Building a string expression object is much simpler than numeric
  # expressions, since the only operation in a string expression is
  # concatenation. Therefore,  a string expression object is composed of an
  # array of one or more subarrays, where each subarray has two elements. The
  # first element is a symbol, either "<str>" for a string literal or "<var>"
  # for a string variable. The second element for a string literal is the
  # string itself. For a string variable, the second element is the variable
  # name.
  #
  # Please note that the value for a string variable is recorded WITHOUT the
  # dollar sign character ($). In BASIC syntax, string variable names are always
  # preceeded with the '$' character to differentiate them from numeric variable
  # names. However, there was no need to include them in the data objects for
  # this app.
  #
  # For example, to represent:
  #   "MY NAME IS "+$N
  # we would use:
  #   [ ["<str", "MY NAME IS "],
  #      "var>", "N"] ].

  build_str_exp: (stack) ->
    parts = []
    for t in [1..stack.length-3] by 3
      if stack[t] == "<string_variable>" then tk = "<var>" else tk = "<str>"
      parts.push( [tk, stack[t+1] ] )
    return parts



class BoolExpBuilder
  # The only allowable construct in the earliest forms of BASIC which could be
  # construed as "boolean expressions" were the comparator statements in IF
  # statements such as 'IF A>B THEN 200'. There were no such things as boolean
  # variables or expressions which could be given a value of 'true' or false'.
  #
  # In the earliest forms of BASIC, there were no such things as boolean
  # variables or expressions which could be given a value of 'true' or false'.
  # The only allowable construct  which could be construed as "boolean
  # expressions" were the comparator statements in IF statements such as:
  #   'IF A>B THEN 200'.
  #
  # A "boolean expression" of this type consists of three parts, represented by
  # the properties of the boolean expression object. These are a variable name,
  # followed by a comparator, followed by a numeric or string expression. The
  # object property names used for these entities are "var" for the variable,
  # "exp" for the comparator, and either "num_exp" or "str_exp" for the
  # expression the variable is being compared to.
  #
  # The only allowable comparators for a string expression are '=' for 'equals'
  # (not '==' as is more common in modern programming languages) and '<>' for
  # 'not equal'. Comparators allowed in a numeric boolean expression are '='
  # (equals), '<>' (not equal), '>' (greater than), '>=' (greater or equal to),
  # '<' (less than), and '<=' (lesser or equal to).
  #
  # The object for the boolean expression
  #   W>100
  # would be represented as:
  #   {exp: "<num_greater_than>",
  #    var: "W",
  #    num_exp: {exp: "<num>", value: 100} }.
  # Further examples can be found in the test specs.

  constructor: (line_builder) ->
    @line_builder = line_builder
    @num_exp = @line_builder.num_exp
    @str_exp = @line_builder.str_exp


  build_bool_exp: (stack) ->
    if stack[1] == "<number_variable>" then type = "num" else type = "str"
    tag_end = stack[3].slice(1)
    tag = "<"+type+"_"+tag_end
    bool = {
      exp: tag
      var: stack[2] }
    bx_stack = stack[4..stack.length-2]
    if type == "num"
      bool.num_exp = @num_exp.build_nxp(bx_stack)
    else
      bool.str_exp = @str_exp.build_str_exp(bx_stack)
    return bool



class InterpreterHelpers
  # Container class for subclasses that help evaluate expressions.

  constructor: ->
    @num_vars = new NumericVariableRegister
    @str_vars = new StringVariableRegister
    @num_eval = new NumericExpressionEvaluator(this)
    @str_eval = new StringExpressionConcatenator(this)
    @bx_eval = new BooleanExpressionEvaluator(this)



class VariableRegister
  # Store values for variables.

  constructor: ->
    @vars = {}


  add_var: (name) ->
    @vars[name] = null


  defined: (name) ->
    if @vars.hasOwnProperty(name)
      return "yes"
    else
      return "no"


  set: (name,value) ->
    @add_var(name) if @defined(name) == "no"
    @vars[name] = value


  get: (name) ->
    @add_var(name) if @defined(name) == "no"
    return @vars[name]



class NumericVariableRegister extends VariableRegister

  # Most, if not all, of the early versions of BASIC initialized any unset
  # numeric variables to 0.
  add_var: (name) ->
    @vars[name] = 0


class StringVariableRegister extends VariableRegister

  # Most early versions of BASIC initialized unset string variables to an
  # empty string.
  add_var: (name) ->
    @vars[name] = ""



class NumericExpressionEvaluator
  # Applies the current values of any variables involved against the numeric
  # expression object and returns the result.

  constructor: (helpers) ->
    @vars = helpers.num_vars


  val: (num_exp) ->
    switch num_exp.exp
      when "<num>"
        value = @num_lit_eval(num_exp)
      when "<var>"
        value = @num_var_eval(num_exp)
      when "<plus>", "<minus>", "<times>", "<divide>", "<power>"
        value = @binary_op_eval(num_exp)
      else
        value = "error"
    return value


  num_lit_eval: (num_exp) ->
    return num_exp.value


  num_var_eval: (num_exp) ->
    return @vars.get(num_exp.name)


  binary_op_eval: (num_exp) ->
    a = @val(num_exp.op1)
    b = @val(num_exp.op2)
    exp = num_exp.exp
    switch exp
      when "<plus>"
        value = a + b
      when "<minus>"
        value = a - b
      when "<times>"
        value = a * b
      when "<divide>"
        value = a / b
      when "<power>"
        value = a**b
      else
        value = "error"



class StringExpressionConcatenator
  # Concatenates the string variables and literals in a string expression into
  # one value.

  constructor: (helpers) ->
    @vars = helpers.str_vars


  val: (str_exp) ->
    string = ""
    for term in str_exp
      string = string.concat(term[1]) if term[0] == "<str>"
      string = string.concat(@vars.get(term[1])) if term[0] == "<var>"
    return string


  str_var_eval: (term) ->
    return @vars.get(term[0])



class BooleanExpressionEvaluator
  # Evaluates the numeric or string expression and applies it against the
  # given variable using the designated comparator.

  constructor: (helpers) ->
    @str_vars = helpers.str_vars
    @num_vars = helpers.num_vars
    @str_eval = helpers.str_eval
    @num_eval = helpers.num_eval

    @truth_table = {
      "<num_equals>": [false,true,false]
      "<num_not_equal>": [true,false,true]
      "<num_lesser_than>": [true,false,false]
      "<num_lesser_equal>": [true,true,false]
      "<num_greater_than>": [false,false,true]
      "<num_greater_equal>": [false,true,true]
      "<str_equals>": [false,true]
      "<str_not_equal>": [true,false] }


  val: (bx) ->
    if bx.exp in [ "<str_equals>", "<str_not_equal>" ]
      comp = @str_compare( @str_vars.get(bx.var), @str_eval.val(bx.str_exp) )
    else
      comp = @num_compare( @num_vars.get(bx.var), @num_eval.val(bx.num_exp) )
    return @truth_table[bx.exp][comp]


  num_compare: (x1,x2) ->
    return 0 if x1 < x2
    return 1 if x1 == x2
    return 2 if x1 > x2


  str_compare: (s1,s2) ->
    if s1 == s2 then return 1 else return 0



  # TODO This class and its associated classes are prime candidates for refactoring.
  #      (Also look at ProgramController#gb_output() - at least rename it??)

class BasicConsole
  # A representation of the 'BASIC console' emulated on an HTML5 canvas element,
  # with the characters printed upon it.

  constructor: ->
    @console_height = 23
    @console_width = 80
    @buffer = new ConsoleLineBuffer(this)
    @output = new ConsoleOutput(this)
    @keys = new KeyHelper
    @sprites = document.getElementById("chars")
    @canvas = document.getElementById('gb80-console')
    @context = @canvas.getContext('2d')
    @scroll = []
    @line = 0
    @column = 0


  enter_line: () ->
    line = @buffer.chars
    if line.length > 0
      @scroll_line(line)
      @buffer.clear()
    return line


  scroll_line: (string) ->
    @column = 0
    @scroll.push(string)
    @line = @line + 1 if @line < @console_height
    if @scroll.length >= @console_height
      @scroll.shift()
      @redraw_lines()
      @column = 0


  redraw_lines: ->
    @clear_screen()
    for ln_no in [0..@scroll.length-1]
      @column = 0
      @println_ln(ln_no, @scroll[ln_no])
    @line = @scroll.length


  print: (string) ->
    @ch(ch) for ch in string
    @line_text = string
    @buffer.clear()


  println: (string) ->
    @print(string)
    @scroll_line(string)


  println_ln: (line_no, string) ->
    @line = line_no
    @print(string)


  ch: (ch) ->
    @column = @column + 1
    @buffer.add(ch)
    @ch_ln_col(ch, @line, @column) if @column <= @console_width


  ch_ln_col: (ch, line, col) ->
    @line_text = "#{ch} [#{line},#{col}]"
    if ch != " "
      sprite = @keys.sprite_xy(ch)
      @context.drawImage(
        @sprites,
        sprite[0],
        sprite[1],
        11,
        18,
        3 + col*11,
        16 + line*18,
        11,
        18 )


  backspace: ->
    console.log "BACKSPACE called"


  clear_screen: ->
    @context.clearRect(0,0,910,440)


  clear_all: ->
    @clear_screen()
    @scroll = []
    @line_text = ""



class ConsoleOutput
  # Controls output written to the HTML5 canvas 'console' element.

  constructor: (bconsole) ->
    @bconsole = bconsole


  print_line: (string) ->
    @bconsole.println(string)



class ConsoleLineBuffer
  # Holds the characters typed into the console until <enter> is pressed.

  constructor: (bconsole) ->
    @bconsole = bconsole
    @chars = ""


  add: (ch) ->
    @chars = @chars + ch


  clear: ->
    @chars = ""


  print: ->
    @bconsole.println(@chars)
    @chars = ""



class ProgramLineListing
  # A container for the program line objects with methods to add, change or
  # remove them.

  constructor: ->
    @lines = {}


  clear: ->
    @lines = {}


  get_line: (line_no) ->
    return @lines[line_no.toString()]


  get_program_objects: ->
    return @lines


  add_or_change: (line_object) ->
    ln = line_object.line_no
    @lines[ln.toString()] = line_object


  remove: (line_no) ->
    delete @lines[line_no.toString()]


  list: ->
    list = []
    line_numbers = @lines_sort()
    list.push(@lines[ln]) for ln in line_numbers
    return list


  lines_sort: ->
    line_numbers = []
    line_numbers.push(line.line_no) for ln_key,line of @lines
    line_numbers.sort (a,b) -> a-b
    return line_numbers



class KeyHelper
  # A class to interpret the parameters of key press events and print the proper
  # character sprite to the correct location.

  constructor: ->
    @code = [33,34,35,36,37,38,39,
             40,41,42,43,44,45,46,47,48,49,
             50,51,52,53,54,55,56,57,58,59,
             60,61,62,63,64,
             94,95,96,97,98,99,
             100,101,102,103,104,105,106,107,108,109,
             110,111,112,113,114,115,116,117,118,119,
             120,121,122,123,124,125,126]

    # TODO Why are '[' and ']' not implemented?
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



# GLOBAL SCOPE ITEMS #

keyevent = (e) ->
  e.preventDefault() if @disable_key_defaults
  ch_num = e.charCode
  ch_key = e.keyCode
  @app.handle(ch_num, ch_key)


start = ->
  @canvas = document.getElementById("gb80-console")
  @canvas.setAttribute('tabindex','0')
  @canvas.focus()
  @disable_key_defaults = true
  @app = new KeyTalker


window.onload = start
