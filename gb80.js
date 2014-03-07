// Generated by CoffeeScript 1.6.3
var BasicProgram, BasicProgramLine, ConsoleText, LineBuffer;

BasicProgram = (function() {
  function BasicProgram() {}

  return BasicProgram;

})();

ConsoleText = (function() {
  function ConsoleText() {
    this.line_buffer = new LineBuffer;
    this.reset();
  }

  ConsoleText.prototype.reset = function() {
    this.status = "clean";
    return this.lines = [];
  };

  ConsoleText.prototype.addline = function(line) {
    return this.lines.push(line);
  };

  ConsoleText.prototype.fetch = function(n) {
    if (n >= 0 && n < this.lines.length) {
      return this.lines[n];
    } else {
      return {};
    }
  };

  ConsoleText.prototype.load_line_buffer = function(n) {
    var text;
    if (n >= this.lines.length) {
      text = "";
    } else {
      text = this.lines[n];
    }
    return this.line_buffer.set_text(text);
  };

  return ConsoleText;

})();

BasicProgramLine = (function() {
  function BasicProgramLine(n, str) {
    this.ln_no = n;
    this.text = str;
    this.parse_object = {};
  }

  return BasicProgramLine;

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
