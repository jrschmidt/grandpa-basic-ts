GB80 = require('../gb80');
NumericVariableRegister = GB80.NumericVariableRegister;

describe('Numeric variable register', function() {

  it('should register a new variable', function() {
    var register;
    register = new NumericVariableRegister;

    register.addVar('X');
    expect(register.defined('X')).toEqual(true);
    register.addVar('A3');
    expect(register.defined('A3')).toEqual(true);
    register.addVar('H');
    expect(register.defined('H')).toEqual(true);
    register.addVar('K0');
    expect(register.defined('K0')).toEqual(true);
    register.addVar('V9');

    expect(register.defined('V9')).toEqual(true);
    expect(register.defined('Y')).toEqual(false);
    expect(register.defined('M2')).toEqual(false);
    expect(register.defined('P3')).toEqual(false);
    expect(register.defined('Q')).toEqual(false);
    expect(register.defined('A4')).toEqual(false);
  });


  it('should set and get the value for a variable', function() {
    var register;
    register = new NumericVariableRegister;

    register.set('J', 17);
    register.set('P0', 918.64428);
    register.set('M', 2);

    expect(register.get('J')).toEqual(17);
    expect(register.get('P0')).toEqual(918.64428);
    expect(register.get('M')).toEqual(2);
    expect(register.get('L')).toEqual(0);
    expect(register.get('Z4')).toEqual(0);
  });

});
