
GB80 = require('../gb80');
LineParserHelpers = GB80.LineParserHelpers;

describe('Line parser helpers', function() {

  beforeEach(function() {
    lph = new LineParserHelpers;
    this.helpers = lph.helpers;
    this.helpers.match = 'no';
    this.helpers.stack = [];
    this.helpers.remainder = '';
  });

  it('should correctly parse a line number', function() {

    string = '440';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 440] );
    expect(this.helpers.remainder).toEqual('');

    // result = this.parser.parse('2280');
    //
    // result = this.parser.parse('100 REM');
    //
    // result = this.parser.parse('110 REM WELCOME TO GRANDPA BASIC 1980');
    //
    // result = this.parser.parse('200 X=200');
    //
    // result = this.parser.parse('220 Z=X/M3');
    //
    // result = this.parser.parse('630 GOTO 1200');
    //
    // result = this.parser.parse('1280 INPUT $D');

  });


});
