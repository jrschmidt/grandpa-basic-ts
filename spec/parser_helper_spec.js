
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

    string = '2280';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 2280] );
    expect(this.helpers.remainder).toEqual('');

    string = '100 REM';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 100] );
    expect(this.helpers.remainder).toEqual(' REM');

    string = '110 REM WELCOME TO GRANDPA BASIC 1980';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 110] );
    expect(this.helpers.remainder).toEqual(' REM WELCOME TO GRANDPA BASIC 1980');

    string = '200 X=200';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 200] );
    expect(this.helpers.remainder).toEqual(' X=200');

    string = '220 Z=X/M3';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 220] );
    expect(this.helpers.remainder).toEqual(' Z=X/M3');

    string = '630 GOTO 1200';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 630] );
    expect(this.helpers.remainder).toEqual(' GOTO 1200');

    string = '1280 INPUT $D';
    this.helpers.set(string).parseLineNumber();
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<line_number>', 1280] );
    expect(this.helpers.remainder).toEqual(' INPUT $D');

  });


  it('should correctly parse a single specific character', function() {

    string = ' ';
    this.helpers.set(string).parseChar('sp');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<sp>'] );
    expect(this.helpers.remainder).toEqual('');

    string = ' REM HELLO';
    this.helpers.set(string).parseChar('sp');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<sp>'] );
    expect(this.helpers.remainder).toEqual('REM HELLO');

    string = ' X=7';
    this.helpers.set(string).parseChar('sp');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<sp>'] );
    expect(this.helpers.remainder).toEqual('X=7');

    string = ' GOTO 1660';
    this.helpers.set(string).parseChar('sp');
    expect(this.helpers.match).toEqual('yes');
    expect(this.helpers.stack).toEqual( ['<sp>'] );
    expect(this.helpers.remainder).toEqual('GOTO 1660');

  });


});
