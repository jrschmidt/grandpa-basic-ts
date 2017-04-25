GB80 = require('../gb80');
StringVariableRegister = GB80.StringVariableRegister;

describe('String variable register', function() {

  it('should register a new variable', function() {
    var register;
    register = new StringVariableRegister;

    register.addVar('Q');
    expect(register.defined('Q')).toEqual(true);
    register.addVar('Z3');
    expect(register.defined('Z3')).toEqual(true);
    register.addVar('F');
    expect(register.defined('F')).toEqual(true);
    register.addVar('T0');
    expect(register.defined('T0')).toEqual(true);
    register.addVar('W9');

    expect(register.defined('W9')).toEqual(true);
    expect(register.defined('Y')).toEqual(false);
    expect(register.defined('M2')).toEqual(false);
    expect(register.defined('P3')).toEqual(false);
    expect(register.defined('S')).toEqual(false);
    expect(register.defined('A4')).toEqual(false);
  });


  it('should set and get the value for a variable', function() {
    var register;
    register = new StringVariableRegister;

    register.set('E', 'ERROR!!');
    register.set('R9', 'PLEASE REPEAT YOUR ANSWER');
    register.set('U4', '315 ELM ST');

    expect(register.get('E')).toEqual('ERROR!!');
    expect(register.get('R9')).toEqual('PLEASE REPEAT YOUR ANSWER');
    expect(register.get('U4')).toEqual('315 ELM ST');
    expect(register.get('L2')).toEqual('');
    expect(register.get('V4')).toEqual('');
  });

});
