// Generated by CoffeeScript 1.7.1
var BasicProgram, BasicProgramLine, BooleanExpressionParser, KeyHelper, LineBuffer, LineParser, NumericExpression, NumericExpressionParser, ParseHelpers, ProgramLineFormatter, StringExpressionParser, SyntaxRules,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

BasicProgram = (function() {
  function BasicProgram() {
    this.lines = [];
  }

  BasicProgram.prototype.addline = function(n, text) {
    var existing;
    existing = this.lines.filter(function(ln) {
      return ln.ln_no === n;
    });
    if (existing.length === 0) {
      return this.lines.push({
        "ln_no": n,
        "text": text
      });
    } else {
      return existing[0].text = text;
    }
  };

  BasicProgram.prototype.fetch = function(line_no) {
    var existing;
    existing = this.lines.filter(function(ln) {
      return ln.ln_no === line_no;
    });
    if (existing.length === 0) {
      return {};
    } else {
      return existing[0];
    }
  };

  BasicProgram.prototype.remove = function(line_no) {
    var line;
    line = this.fetch(line_no);
    if (line !== {}) {
      line.ln_no = null;
      return line.text = null;
    }
  };

  return BasicProgram;

})();

SyntaxRules = (function() {
  function SyntaxRules() {
    this.keywords = ["CLEAR", "RUN", "INFO", "LIST", "REM", "GOTO", "GOSUB", "RETURN", "IF", "THEN", "INPUT", "PRINT", "PRINTLN", "CLEARSCRN", "TAB", "END"];
    this.keyword_tokens = ["<clear_command>", "<run_command>", "<info_command>", "<list_command>", "<remark>", "<goto>", "<gosub>", "<return>", "<if>", "<then>", "<input>", "<print>", "<print_line>", "<clear_screen>", "<tab>", "<end>"];
    this.char_tokens = ["<sp>", "<equals>", "<semicolon>", "<comma>"];
    this.chars = " =;,";
    this.action_tokens = ["<line_number>", "<line_number_statement>", "<input_statement>", "<number_variable>", "<string_variable>", "<numeric_expression>", "<string_expression>", "<boolean_expression>", "<string>", "<characters>", "<integer>"];
    this.rules = [["CLEAR"], ["RUN"], ["INFO"], ["LIST"], ["<line_number>", "<sp>", "<line_number_statement>"]];
    this.line_number_rules = [["REM", "<sp>", "<characters>"], ["REM"], ["<number_variable>", "<equals>", "<numeric_expression>"], ["<string_variable>", "<equals>", "<string_expression>"], ["GOTO", "<sp>", "<line_number>"], ["GOSUB", "<sp>", "<line_number>"], ["RETURN"], ["IF", "<sp>", "<boolean_expression>", "<sp>", "THEN", "<sp>", "<line_number>"], ["INPUT", "<sp>", "<input_statement>"], ["PRINT", "<sp>", "<string_expression>"], ["PRINTLN", "<sp>", "<string_expression>"], ["PRINTLN"], ["CLEARSCRN"], ["TAB", "<sp>", "<integer>", "<comma>", "<integer>"], ["TAB", "<sp>", "<integer>"], ["END"]];
    this.input_statement_rules = [["<number_variable>"], ["<string_variable>"], ["<string>", "<semicolon>", "<number_variable>"], ["<string>", "<semicolon>", "<string_variable>"]];
  }

  return SyntaxRules;

})();

BasicProgramLine = (function() {
  function BasicProgramLine() {}

  return BasicProgramLine;

})();

ProgramLineFormatter = (function() {
  function ProgramLineFormatter() {}

  ProgramLineFormatter.prototype.format = function(parse_object, line_text) {};

  return ProgramLineFormatter;

})();

LineParser = (function() {
  function LineParser() {
    this.helpers = new ParseHelpers;
    this.syntax = this.helpers.syntax;
    this.rules = this.syntax.rules;
    this.ln_rules = this.syntax.line_number_rules;
    this.input_rules = this.syntax.input_statement_rules;
  }

  LineParser.prototype.look_for = function(string, rule) {
    var cat, parse_object, result, rule_match, tk, token, token_result, _i, _j, _len, _len1, _ref;
    parse_object = [];
    rule_match = "unknown";
    for (_i = 0, _len = rule.length; _i < _len; _i++) {
      token = rule[_i];
      if (rule_match !== "no") {
        cat = "none";
        if (__indexOf.call(this.syntax.keywords, token) >= 0) {
          cat = "keyword";
        }
        if (__indexOf.call(this.syntax.char_tokens, token) >= 0) {
          cat = "char";
        }
        if (__indexOf.call(this.syntax.action_tokens, token) >= 0) {
          cat = "action";
        }
        switch (cat) {
          case "keyword":
            token_result = this.look_for_keyword(token, string);
            break;
          case "char":
            token_result = this.look_for_char(token, string);
            break;
          case "action":
            token_result = this.look_for_action(token, string);
            break;
          default:
            token_result = {
              match: "no"
            };
        }
        if (token_result.match === "yes") {
          _ref = token_result.parse_object;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            tk = _ref[_j];
            parse_object.push(tk);
          }
          string = token_result.remainder;
        } else {
          rule_match = "no";
        }
      }
    }
    if (rule_match === "no") {
      result = {
        match: "no"
      };
    } else {
      result = {
        match: "yes",
        parse_object: parse_object
      };
    }
    return result;
  };

  LineParser.prototype.look_for_keyword = function(token, string) {
    var find, i, result;
    find = string.indexOf(token);
    if (find === 0) {
      i = this.syntax.keywords.indexOf(token);
      result = {
        match: "yes",
        parse_object: [this.syntax.keyword_tokens[i]],
        remainder: string.slice(token.length)
      };
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  LineParser.prototype.look_for_char = function(token, string) {
    var ch, i, result;
    i = this.syntax.char_tokens.indexOf(token);
    ch = string[0];
    if (ch === this.syntax.chars[i]) {
      result = {
        match: "yes",
        parse_object: [token],
        remainder: string.slice(1)
      };
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  LineParser.prototype.look_for_action = function(token, string) {
    var result;
    switch (token) {
      case "<line_number>":
        result = this.helpers.look_for_line_number(string);
        break;
      case "<line_number_statement>":
        result = this.look_for_line_number_statement(string);
        break;
      case "<input_statement>":
        result = this.look_for_input_parameters(string);
        break;
      case "<number_variable>":
        result = this.helpers.look_for_numeric_identifier(string);
        break;
      case "<string_variable>":
        result = this.helpers.look_for_string_identifier(string);
        break;
      case "<numeric_expression>":
        result = this.helpers.num_exp_parser.numeric_parse(string);
        break;
      case "<string_expression>":
        result = this.helpers.str_exp_parser.string_value_parse(string);
        break;
      case "<boolean_expression>":
        result = this.helpers.bool_exp_parser.boolean_parse(string);
        break;
      case "<string>":
        result = this.helpers.look_for_string(string);
        break;
      case "<characters>":
        result = this.helpers.look_for_characters(string);
        break;
      case "<integer>":
        result = this.helpers.look_for_integer(string);
        break;
      default:
        result = {
          match: "no"
        };
    }
    return result;
  };

  LineParser.prototype.look_for_line_number_statement = function(string) {
    var match, result, rule, _i, _len, _ref;
    match = "no";
    _ref = this.ln_rules;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rule = _ref[_i];
      if (match === "no") {
        result = this.look_for(string, rule);
        match = result.match;
      }
    }
    if (match === "yes") {
      return result;
    } else {
      return {
        match: "no"
      };
    }
  };

  LineParser.prototype.look_for_input_parameters = function(string) {
    var match, result, rule, _i, _len, _ref;
    match = "no";
    _ref = this.input_rules;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rule = _ref[_i];
      if (match === "no") {
        result = this.look_for(string, rule);
        match = result.match;
      }
    }
    if (match === "yes") {
      return result;
    } else {
      return {
        match: "no"
      };
    }
  };

  return LineParser;

})();

ParseHelpers = (function() {
  function ParseHelpers() {
    this.syntax = new SyntaxRules;
    this.rules = this.syntax.rules;
    this.num_exp_parser = new NumericExpressionParser;
    this.str_exp_parser = new StringExpressionParser;
    this.bool_exp_parser = new BooleanExpressionParser(this);
  }

  ParseHelpers.prototype.look_for_line_number = function(string) {
    var n, result;
    result = {};
    n = parseInt(string);
    if (n > 0) {
      result.match = "yes";
      result.parse_object = ["<line_number>", n];
      result.remainder = string.slice(String(n).length);
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  ParseHelpers.prototype.look_for_numeric_identifier = function(string) {
    var id, len, result, _ref, _ref1, _ref2;
    result = {};
    if (_ref = string[0], __indexOf.call("ABCDEFGHIJKLMNOPQRSTUVWXYZ", _ref) >= 0) {
      if (_ref1 = string[1], __indexOf.call("0123456789", _ref1) >= 0) {
        len = 2;
      } else {
        len = 1;
      }
      if ((len === string.length) || (_ref2 = string[len], __indexOf.call("=+-*/^)", _ref2) >= 0)) {
        result.match = "yes";
        id = string.slice(0, len);
        result.parse_object = ["<number_variable>", id];
        result.remainder = string.slice(len);
      } else {
        result = {
          match: "no"
        };
      }
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  ParseHelpers.prototype.look_for_string_identifier = function(string) {
    var id, len, result, _ref, _ref1, _ref2;
    result = {};
    if (string[0] === "$") {
      if (_ref = string[1], __indexOf.call("ABCDEFGHIJKLMNOPQRSTUVWXYZ", _ref) >= 0) {
        if (_ref1 = string[2], __indexOf.call("0123456789", _ref1) >= 0) {
          len = 2;
        } else {
          len = 1;
        }
      }
      if ((len === string.length - 1) || (_ref2 = string[len + 1], __indexOf.call("=+", _ref2) >= 0)) {
        result.match = "yes";
        id = string.slice(1, len + 1);
        result.parse_object = ["<string_variable>", id];
        result.remainder = string.slice(len + 1);
      } else {
        result = {
          match: "no"
        };
      }
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  ParseHelpers.prototype.look_for_characters = function(string) {
    var result;
    result = {
      match: "yes",
      parse_object: ["<characters>", string],
      remainder: ""
    };
    return result;
  };

  ParseHelpers.prototype.look_for_string = function(string) {
    var ch, contents, cut, quote_check, remdr, result;
    quote_check = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = string.length; _i < _len; _i++) {
        ch = string[_i];
        if (ch === '"') {
          _results.push(ch);
        }
      }
      return _results;
    })();
    if (quote_check.length >= 2 && string[0] === '"' && string.length > 2) {
      cut = string.indexOf('"', 1);
      contents = string.slice(1, cut);
      remdr = string.slice(cut + 1);
      result = {
        match: "yes",
        parse_object: ["<string>", contents],
        remainder: remdr
      };
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  ParseHelpers.prototype.look_for_integer = function(string) {
    var end, int, result, _ref, _ref1;
    if (_ref = string[0], __indexOf.call("0123456789", _ref) >= 0) {
      if (_ref1 = string[1], __indexOf.call("0123456789", _ref1) >= 0) {
        int = Number(string.slice(0, 2));
        end = string.slice(2);
      } else {
        int = Number(string[0]);
        end = string.slice(1);
      }
      result = {
        match: "yes",
        parse_object: ["<integer>", int],
        remainder: end
      };
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  return ParseHelpers;

})();

NumericExpressionParser = (function() {
  function NumericExpressionParser() {
    this.num_exp_chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "(", ")", "+", "-", "*", "/", "^"];
    this.delimiters = ["(", ")", "+", "-", "*", "/", "^"];
    this.symbols = ["<left>", "<right>", "<plus>", "<minus>", "<times>", "<divide>", "<power>"];
  }

  NumericExpressionParser.prototype.numeric_parse = function(string) {
    var bad_chars, ok, po, result, tk, tokens, val, _i, _len;
    bad_chars = string.search(/[^A-Z0-9\.+\-*/\^()]/);
    if (bad_chars === -1) {
      po = ["<numeric_expression>"];
      ok = "yes";
      tokens = this.tokenize(string);
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        tk = tokens[_i];
        if (__indexOf.call(this.symbols, tk) >= 0) {
          po.push(tk);
        } else {
          val = this.numeric_value(tk);
          if (val[0] === "bad") {
            ok = "no";
          } else {
            po.push(val[0]);
            po.push(val[1]);
          }
        }
      }
      po.push("<num_exp_end>");
    } else {
      ok = "no";
    }
    if (ok === "yes") {
      result = {
        match: "yes",
        parse_object: po
      };
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  NumericExpressionParser.prototype.tokenize = function(string) {
    var buffer, ch, tokens, _i, _len;
    tokens = [];
    buffer = "";
    for (_i = 0, _len = string.length; _i < _len; _i++) {
      ch = string[_i];
      if (__indexOf.call(this.delimiters, ch) >= 0) {
        if (buffer !== "") {
          tokens.push(buffer);
          buffer = "";
        }
        tokens.push(this.symbols[this.delimiters.indexOf(ch)]);
      } else {
        buffer = buffer + ch;
      }
    }
    if (buffer !== "") {
      tokens.push(buffer);
    }
    return tokens;
  };

  NumericExpressionParser.prototype.numeric_value = function(string) {
    var ch, non_numerics, val, _i, _len, _ref, _ref1;
    val = [];
    if (_ref = string[0], __indexOf.call("ABCDEFGHIJKLMNOPQRSTUVWXYZ", _ref) >= 0) {
      if ((string.length === 1) || (string.length === 2 && (_ref1 = string[1], __indexOf.call("0123456789", _ref1) >= 0))) {
        val[0] = "<number_variable>";
        val[1] = string;
      } else {
        val = ["bad", "bad"];
      }
    } else {
      non_numerics = "none";
      for (_i = 0, _len = string.length; _i < _len; _i++) {
        ch = string[_i];
        if (!(__indexOf.call("0123456789", ch) >= 0)) {
          if (ch === ".") {
            if (non_numerics === "one_period") {
              non_numerics = "bad";
            }
            if (non_numerics === "none") {
              non_numerics = "one_period";
            }
          } else {
            non_numerics = "bad";
          }
        }
      }
      if (non_numerics !== "bad") {
        val[0] = "<numeric_literal>";
        val[1] = Number(string);
      } else {
        val = ["bad", "bad"];
      }
    }
    return val;
  };

  return NumericExpressionParser;

})();

StringExpressionParser = (function() {
  function StringExpressionParser() {}

  StringExpressionParser.prototype.string_value_parse = function(string) {
    var ok, po, result, tk, tokens, val, _i, _len;
    po = ["<string_expression>"];
    ok = "yes";
    tokens = this.tokenize(string);
    for (_i = 0, _len = tokens.length; _i < _len; _i++) {
      tk = tokens[_i];
      if (tk === "<plus>") {
        po.push("<plus>");
      } else {
        val = this.string_value(tk);
        if (val[0] === "bad") {
          ok = "no";
        } else {
          po.push(val[0]);
          po.push(val[1]);
        }
      }
    }
    po.push("<str_exp_end>");
    if (ok === "yes") {
      result = {
        match: "yes",
        parse_object: po
      };
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  StringExpressionParser.prototype.tokenize = function(string) {
    var buffer, ch, tokens, _i, _len;
    tokens = [];
    buffer = "";
    for (_i = 0, _len = string.length; _i < _len; _i++) {
      ch = string[_i];
      if (ch === "+") {
        if (buffer !== "") {
          tokens.push(buffer);
          buffer = "";
        }
        tokens.push("<plus>");
      } else {
        buffer = buffer + ch;
      }
    }
    if (buffer !== "") {
      tokens.push(buffer);
    }
    return tokens;
  };

  StringExpressionParser.prototype.string_value = function(string) {
    var ch, quote_check, str_var, val, _ref, _ref1, _ref2;
    val = ["bad", "bad"];
    quote_check = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = string.length; _i < _len; _i++) {
        ch = string[_i];
        if (ch === '"') {
          _results.push(ch);
        }
      }
      return _results;
    })();
    if (quote_check.length === 2 && string[0] === '"' && string[string.length - 1] === '"') {
      val[0] = "<string_literal>";
      val[1] = string.slice(1, -1);
    } else {
      str_var = "no";
      if ((_ref = string.length, __indexOf.call([2, 3], _ref) >= 0) && string[0] === "$") {
        if (_ref1 = string[1], __indexOf.call("ABCDEFGHIJKLMNOPQRSTUVWXYZ", _ref1) >= 0) {
          if (string.length === 2) {
            str_var = "yes";
          } else {
            if (_ref2 = string[2], __indexOf.call("0123456789", _ref2) >= 0) {
              str_var = "yes";
            }
          }
        }
      }
      if (str_var === "yes") {
        val[0] = "<string_variable>";
        val[1] = string.slice(1);
      }
    }
    return val;
  };

  return StringExpressionParser;

})();

BooleanExpressionParser = (function() {
  function BooleanExpressionParser(parse_helpers) {
    this.helpers = parse_helpers;
  }

  BooleanExpressionParser.prototype.boolean_parse = function(string) {
    var match, num_exp, num_id, po, prep, remainder, result, str_id, str_val, tk, tokens, _i, _j, _len, _len1, _ref, _ref1;
    prep = this.strip_remainder(string);
    string = prep.string;
    remainder = prep.remainder;
    po = ["<boolean_expression>"];
    tokens = this.split(string);
    if (tokens !== "<not_a_boolean_expression>") {
      match = "yes";
      num_id = this.helpers.look_for_numeric_identifier(tokens[0]);
      if (num_id.match === "yes") {
        num_exp = this.helpers.num_exp_parser.numeric_parse(tokens[2]);
        if (num_exp.match === "yes") {
          po = po.concat(num_id.parse_object);
          po.push(tokens[1]);
          _ref = num_exp.parse_object;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            tk = _ref[_i];
            po.push(tk);
          }
        }
      } else {
        str_id = this.helpers.look_for_string_identifier(tokens[0]);
        if (str_id.match === "yes") {
          str_val = this.helpers.str_exp_parser.string_value_parse(tokens[2]);
          if (str_val.match !== "bad") {
            _ref1 = str_id.parse_object;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              tk = _ref1[_j];
              po.push(tk);
            }
            po.push("<equals>");
            po = po.concat(str_val.parse_object);
          } else {
            match = "no";
          }
        } else {
          match = "no";
        }
      }
    } else {
      match = "no";
    }
    if (match === "yes") {
      po.push("<bool_exp_end>");
      result = {
        match: "yes",
        parse_object: po,
        remainder: remainder
      };
    } else {
      result = {
        match: "no"
      };
    }
    return result;
  };

  BooleanExpressionParser.prototype.strip_remainder = function(string) {
    var cut, q1, q2, result, sp;
    cut = 0;
    q1 = string.indexOf('"');
    q2 = string.lastIndexOf('"');
    if ((q1 > 0) && (q1 !== q2)) {
      cut = q2 + 1;
    } else {
      sp = string.indexOf(" ");
      if (sp > 0) {
        cut = sp;
      } else {
        cut = 0;
      }
    }
    if (cut > 0) {
      result = {
        string: string.slice(0, cut),
        remainder: string.slice(cut)
      };
    } else {
      result = {
        string: string,
        remainder: ""
      };
    }
    return result;
  };

  BooleanExpressionParser.prototype.split = function(string) {
    var cut, find, po, token;
    po = [];
    token = "";
    find = string.indexOf("<");
    if (find > 0) {
      if (string[find + 1] === ">") {
        token = "<not_equal>";
      } else {
        if (string[find + 1] === "=") {
          token = "<lesser_equal>";
        } else {
          token = "<lesser_than>";
        }
      }
    }
    if (token === "") {
      find = string.indexOf(">");
      if (find > 0) {
        if (string[find + 1] === "=") {
          token = "<greater_equal>";
        } else {
          token = "<greater_than>";
        }
      }
    }
    if (token === "") {
      find = string.indexOf("=");
      if (find > 0) {
        token = "<equals>";
      }
    }
    if (token.length > 0) {
      po[0] = string.slice(0, find);
      po[1] = token;
      if (token === "<not_equal>" || token === "<lesser_equal>" || token === "<greater_equal>") {
        cut = find + 2;
      } else {
        cut = find + 1;
      }
      po[2] = string.slice(cut);
    } else {
      po = "<not_a_boolean_expression>";
    }
    return po;
  };

  return BooleanExpressionParser;

})();

NumericExpression = (function() {
  function NumericExpression() {}

  return NumericExpression;

})();

KeyHelper = (function() {
  function KeyHelper() {
    this.code = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 92, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126];
    this.chars = ["!", "DOUBLE QUOTE", "#", "$", "%", "&", "SINGLE QUOTE", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "BACK SLASH", "^", "_", "`", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "{", "|", "}", "~"];
    this.xy = [[99, 72], [33, 72], [33, 90], [77, 72], [88, 72], [44, 90], [22, 72], [66, 54], [77, 54], [33, 54], [11, 54], [55, 72], [22, 54], [44, 72], [44, 54], [0, 36], [11, 36], [22, 36], [33, 36], [44, 36], [55, 36], [66, 36], [77, 36], [88, 36], [99, 36], [0, 72], [11, 72], [88, 54], [0, 54], [99, 54], [66, 72], [22, 90], [88, 90], [55, 54], [55, 90], [0, 90], [0, 0], [11, 0], [22, 0], [33, 0], [44, 0], [55, 0], [66, 0], [77, 0], [88, 0], [99, 0], [110, 0], [121, 0], [132, 0], [0, 18], [11, 18], [22, 18], [33, 18], [44, 18], [55, 18], [66, 18], [77, 18], [88, 18], [99, 18], [110, 18], [121, 18], [132, 18], [66, 90], [99, 90], [77, 90], [11, 90]];
  }

  KeyHelper.prototype.char = function(n) {
    var ch, i;
    if (__indexOf.call(this.code, n) >= 0) {
      i = this.code.indexOf(n);
      ch = this.chars[i];
    } else {
      ch = null;
    }
    return ch;
  };

  KeyHelper.prototype.sprite_xy = function(n) {
    var i;
    if (__indexOf.call(this.code, n) >= 0) {
      i = this.code.indexOf(n);
      return this.xy[i];
    }
  };

  return KeyHelper;

})();

LineBuffer = (function() {
  function LineBuffer() {
    this.text = "";
  }

  LineBuffer.prototype.set_text = function(string) {
    return this.text = string;
  };

  LineBuffer.prototype.get_text = function() {
    return this.text;
  };

  return LineBuffer;

})();
