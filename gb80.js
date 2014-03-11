// Generated by CoffeeScript 1.7.1
var BasicProgram, BasicProgramLine, KeyHelper, LineBuffer, LineParser,
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

BasicProgramLine = (function() {
  function BasicProgramLine(n, str) {
    this.ln_no = n;
    this.text = str;
    this.tokens = [];
  }

  return BasicProgramLine;

})();

LineParser = (function() {
  function LineParser() {}

  LineParser.prototype.parse = function(string) {
    var line, original_string, x;
    original_string = string;
    line = [];
    x = this.look_for_command(string);
    if (x !== null) {
      line = [x];
    }
    return line;
  };

  LineParser.prototype.look_for_command = function(string) {
    var cmd;
    cmd = null;
    if (string === "CLEAR") {
      cmd = "<clear>";
    }
    if (string === "RUN") {
      cmd = "<run>";
    }
    if (string === "INFO") {
      cmd = "<info>";
    }
    if (string === "LIST") {
      cmd = "<list>";
    }
    return cmd;
  };

  return LineParser;

})();

KeyHelper = (function() {
  function KeyHelper() {
    this.code = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 92, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126];
    this.chars = ["!", "DOUBLE QUOTE", "#", "$", "%", "&", "SINGLE QUOTE", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "BACK SLASH", "^", "_", "`", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "{", "|", "}", "~"];
    this.xy = [[99, 72], [33, 72], [33, 90], [77, 72], [88, 72], [44, 90], [22, 72], [66, 54], [77, 54], [33, 54], [11, 54], [55, 72], [22, 54], [44, 72], [44, 54], [0, 36], [11, 36], [22, 36], [33, 36], [44, 36], [55, 36], [66, 36], [77, 36], [88, 36], [99, 36], [0, 72], [11, 72], [88, 54], [0, 54], [99, 54], [66, 72], [22, 90], [88, 90], [55, 54], [55, 90], [0, 90], [0, 0], [11, 0], [22, 0], [33, 0], [44, 0], [55, 0], [66, 0], [77, 0], [88, 0], [99, 0], [110, 0], [121, 0], [132, 0], [0, 18], [11, 18], [22, 18], [33, 18], [44, 18], [55, 18], [66, 18], [77, 18], [88, 18], [99, 18], [110, 18], [121, 18], [132, 18], [66, 90], [99, 90], [77, 90], [11, 90]];
  }

  KeyHelper.prototype.char = function(n) {
    var i;
    if (__indexOf.call(this.code, n) >= 0) {
      i = this.code.indexOf(n);
      return this.chars[i];
    }
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
