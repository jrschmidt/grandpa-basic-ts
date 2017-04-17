GB80 = require('../gb80');
NumericExpressionBuilder = GB80.NumericExpressionBuilder;

describe('Numeric expression builder', function() {

  beforeEach(function() {
    this.builder = new NumericExpressionBuilder;
  });


  it('should strip parentheses in an expression and replace them with nested arrays of tokens', function() {
    var result, stack;

    // TEST  (J+K)
    stack = [
      '<left>',
      '<numeric_variable>',
      'J',
      '<plus>',
      '<numeric_variable>',
      'K',
      '<right>'
    ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(jasmine.any(Array));
    expect(result[0].length).toEqual(5);
    expect(result[0][0]).toEqual('<numeric_variable>');
    expect(result[0][1]).toEqual('J');
    expect(result[0][2]).toEqual('<plus>');
    expect(result[0][3]).toEqual('<numeric_variable>');
    expect(result[0][4]).toEqual('K');


    // TEST  1+(4*A*C)/B
    stack = [
      '<numeric_literal>',
      1,
      '<plus>',
      '<left>',
      '<numeric_literal>',
      4,
      '<times>',
       '<numeric_variable>',
       'A',
       '<times>',
       '<numeric_variable>',
       'C',
       '<right>',
       '<divide>',
       '<numeric_variable>',
       'B'
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(7);
    expect(result[0]).toEqual('<numeric_literal>');
    expect(result[1]).toEqual(1);
    expect(result[2]).toEqual('<plus>');
    expect(result[3]).toEqual(jasmine.any(Array));
    expect(result[3].length).toEqual(8);
    expect(result[3][0]).toEqual('<numeric_literal>');
    expect(result[3][1]).toEqual(4);
    expect(result[3][2]).toEqual('<times>');
    expect(result[3][3]).toEqual('<numeric_variable>');
    expect(result[3][4]).toEqual('A');
    expect(result[3][5]).toEqual('<times>');
    expect(result[3][6]).toEqual('<numeric_variable>');
    expect(result[3][7]).toEqual('C');
    expect(result[4]).toEqual('<divide>');
    expect(result[5]).toEqual('<numeric_variable>');
    expect(result[6]).toEqual('B');


    // TEST  INT(W)
    stack = [
      '<integer>',
      '<left>',
      '<numeric_variable>',
      'W',
      '<right>'
    ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('<integer>');
    expect(result[1]).toEqual(jasmine.any(Array));
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual('<numeric_variable>');
    expect(result[1][1]).toEqual('W');


    // TEST  (200+INT(S7))*44
    stack = [
      '<left>',
      '<numeric_literal>',
      200,
      '<plus>',
      '<integer>',
       '<left>',
       '<numeric_variable>',
       'S7',
       '<right>',
       '<right>',
       '<times>',
       '<numeric_literal>',
       44
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual(jasmine.any(Array));
    expect(result[0].length).toEqual(5);
    expect(result[0][0]).toEqual('<numeric_literal>');
    expect(result[0][1]).toEqual(200);
    expect(result[0][2]).toEqual('<plus>');
    expect(result[0][3]).toEqual('<integer>');
    expect(result[0][4]).toEqual(jasmine.any(Array));
    expect(result[0][4].length).toEqual(2);
    expect(result[0][4][0]).toEqual('<numeric_variable>');
    expect(result[0][4][1]).toEqual('S7');
    expect(result[1]).toEqual('<times>');
    expect(result[2]).toEqual('<numeric_literal>');
    expect(result[3]).toEqual(44);


    // TEST  (S2+7)/(E4^2-7)
    stack = [
      '<left>',
      '<numeric_variable>',
      'S2',
      '<plus>',
      '<numeric_literal>',
      7,
      '<right>',
      '<divide>',
      '<left>',
      '<numeric_variable>',
      'E4',
      '<power>',
      '<numeric_literal>',
       2,
       '<minus>',
       '<numeric_literal>',
       7,
       '<right>'
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual(jasmine.any(Array));
    expect(result[0].length).toEqual(5);
    expect(result[0][0]).toEqual('<numeric_variable>');
    expect(result[0][1]).toEqual('S2');
    expect(result[0][2]).toEqual('<plus>');
    expect(result[0][3]).toEqual('<numeric_literal>');
    expect(result[0][4]).toEqual(7);
    expect(result[1]).toEqual('<divide>');
    expect(result[2]).toEqual(jasmine.any(Array));
    expect(result[2].length).toEqual(8);
    expect(result[2][0]).toEqual('<numeric_variable>');
    expect(result[2][1]).toEqual('E4');
    expect(result[2][2]).toEqual('<power>');
    expect(result[2][3]).toEqual('<numeric_literal>');
    expect(result[2][4]).toEqual(2);
    expect(result[2][5]).toEqual('<minus>');
    expect(result[2][6]).toEqual('<numeric_literal>');
    expect(result[2][7]).toEqual(7);


    // TEST  6+(A/(400+X2))*11
    stack = [
      '<numeric_literal>',
      6,
      '<plus>',
      '<left>',
      '<numeric_variable>',
       'A',
       '<divide>',
       '<left>',
       '<numeric_literal>',
       400,
       '<plus>',
       '<numeric_variable>',
       'X2',
       '<right>',
       '<right>',
       '<times>',
       '<numeric_literal>',
       11
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(7);
    expect(result[0]).toEqual('<numeric_literal>');
    expect(result[1]).toEqual(6);
    expect(result[2]).toEqual(('<plus>'));
    expect(result[3]).toEqual(jasmine.any(Array));
    expect(result[3].length).toEqual(4);
    expect(result[3][0]).toEqual('<numeric_variable>');
    expect(result[3][1]).toEqual('A');
    expect(result[3][2]).toEqual('<divide>');
    expect(result[3][3]).toEqual(jasmine.any(Array));
    expect(result[3][3].length).toEqual(5);
    expect(result[3][3][0]).toEqual('<numeric_literal>');
    expect(result[3][3][1]).toEqual(400);
    expect(result[3][3][2]).toEqual('<plus>');
    expect(result[3][3][3]).toEqual('<numeric_variable>');
    expect(result[3][3][4]).toEqual('X2');
    expect(result[4]).toEqual('<times>');
    expect(result[5]).toEqual('<numeric_literal>');
    expect(result[6]).toEqual(11);


    // TEST  (6*A-(400+X2))*11
    stack = [
      '<left>',
      '<numeric_literal>',
      6,
      '<times>',
      '<numeric_variable>',
       'A',
       '<minus>',
       '<left>',
       '<numeric_literal>',
       400,
       '<plus>',
       '<numeric_variable>',
       'X2',
       '<right>',
       '<right>',
       '<times>',
       '<numeric_literal>',
       11
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual(jasmine.any(Array));
    expect(result[0].length).toEqual(7);
    expect(result[0][0]).toEqual('<numeric_literal>');
    expect(result[0][1]).toEqual(6);
    expect(result[0][2]).toEqual('<times>');
    expect(result[0][3]).toEqual('<numeric_variable>');
    expect(result[0][4]).toEqual('A');
    expect(result[0][5]).toEqual('<minus>');
    expect(result[0][6]).toEqual(jasmine.any(Array));
    expect(result[0][6].length).toEqual(5);
    expect(result[0][6][0]).toEqual('<numeric_literal>');
    expect(result[0][6][1]).toEqual(400);
    expect(result[0][6][2]).toEqual('<plus>');
    expect(result[0][6][3]).toEqual('<numeric_variable>');
    expect(result[0][6][4]).toEqual('X2');


    // TEST  2*(A-0.3333)*(B+1.7)
    stack = [
      '<numeric_literal>',
      2,
      '<times>',
      '<left>',
      '<numeric_variable>',
      'A',
      '<minus>',
      '<numeric_literal>',
      0.3333,
      '<right>',
      '<times>',
      '<left>',
      '<numeric_variable>',
       'B',
       '<plus>',
       '<numeric_literal>',
       1.7,
       '<right>'
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(6);
    expect(result[0]).toEqual('<numeric_literal>');
    expect(result[1]).toEqual(2);
    expect(result[2]).toEqual('<times>');
    expect(result[3]).toEqual(jasmine.any(Array));
    expect(result[3].length).toEqual(5);
    expect(result[3][0]).toEqual('<numeric_variable>');
    expect(result[3][1]).toEqual('A');
    expect(result[3][2]).toEqual('<minus>');
    expect(result[3][3]).toEqual('<numeric_literal>');
    expect(result[3][4]).toEqual(0.3333);
    expect(result[4]).toEqual('<times>');
    expect(result[5]).toEqual(jasmine.any(Array));
    expect(result[5].length).toEqual(5);
    expect(result[5][0]).toEqual('<numeric_variable>');
    expect(result[5][1]).toEqual('B');
    expect(result[5][2]).toEqual('<plus>');
    expect(result[5][3]).toEqual('<numeric_literal>');
    expect(result[5][4]).toEqual(1.7);

  });



  it('should find the designated splitter token in an expression', function() {
    var stack, left, right, testData, result;
    var testCases = [];


    // SCAN:  A+B
    // RESULT:  'A' <plus> 'B'

    stack = [
      '<numeric_variable>',
      'A',
      '<plus>',
      '<numeric_variable>',
      'B'
    ];

    testData = {
      stack: stack,
      splitter: '<plus>',
      left: ['<numeric_variable>', 'A'],
      right: ['<numeric_variable>', 'B',]
    };

    testCases.push(testData);


    // SCAN:  X-200
    // RESULT:  'X' <minus> '200'

    stack = [
      '<numeric_variable>',
      'X',
      '<minus>',
      '<numeric_literal>',
      200
    ];

    testData = {
      stack: stack,
      splitter: '<minus>',
      left: ['<numeric_variable>', 'X'],
      right:['<numeric_literal>', 200]
    };

    testCases.push(testData);


    // SCAN:  'P+Q+R+S'
    // RESULT:  'P' <plus> 'Q+R+S'

    stack = [
      '<numeric_variable>',
      'P',
      '<plus>',
      '<numeric_variable>',
      'Q',
      '<plus>',
      '<numeric_variable>',
      'R',
      '<plus>',
      '<numeric_variable>',
      'S'
    ];

    left = [
      '<numeric_variable>',
      'P'
    ];

    right = [
      '<numeric_variable>',
      'Q',
      '<plus>',
      '<numeric_variable>',
      'R',
      '<plus>',
      '<numeric_variable>',
      'S'
    ];

    testData = {
      stack: stack,
      splitter: '<plus>',
      left: left,
      right: right
    };

    testCases.push(testData);


    // SCAN:  J*Z1-K*Z2
    // RESULT:  'J*Z1' <minus> 'K*Z2'

    stack = [
      '<numeric_variable>',
      'J',
      '<times>',
      '<numeric_variable>',
      'Z1',
      '<minus>',
      '<numeric_variable>',
      'K',
      '<times>',
      '<numeric_variable>',
      'Z2'
    ];

    left = [
      '<numeric_variable>',
      'J',
      '<times>',
      '<numeric_variable>',
      'Z1'
    ];

    right = [
      '<numeric_variable>',
      'K',
      '<times>',
      '<numeric_variable>',
      'Z2'
    ];

    testData = {
      stack: stack,
      splitter: '<minus>',
      left: left,
      right: right
    };

    testCases.push(testData);


    // SCAN: '21*T'
    // RESULT:  '21' <times> 'T'

    stack = [
      '<numeric_literal>',
      21,
      '<times>',
      '<numeric_variable>',
      'T'
    ];

    testData = {
      stack: stack,
      splitter: '<times>',
      left: ['<numeric_literal>', 21],
      right: ['<numeric_variable>', 'T']
    };

    testCases.push(testData);


    // SCAN:  3.1416/2
    // RESULT:  '3.1416' <divide> '2'

    stack = [
      '<numeric_literal>',
      3.1416,
      '<divide>',
      '<numeric_literal>',
      2
    ];

    testData = {
      stack: stack,
      splitter: '<divide>',
      left: ['<numeric_literal>', 3.1416],
      right: ['<numeric_literal>', 2]
    };

    testCases.push(testData);


    // SCAN:  3.3333*Z*A/M
    // RESULT:  '3.3333' <times> 'Z*A/M'

    stack = [
      '<numeric_literal>',
      3.3333,
      '<times>',
      '<numeric_variable>',
      'Z',
      '<times>',
      '<numeric_variable>',
      'A',
      '<divide>',
      '<numeric_variable>',
      'M'
    ];

    left = [
      '<numeric_literal>',
      3.3333
    ];

    right = [
      '<numeric_variable>',
      'Z',
      '<times>',
      '<numeric_variable>',
      'A',
      '<divide>',
      '<numeric_variable>',
      'M'
    ];

    testData = {
      stack: stack,
      splitter: '<times>',
      left: left,
      right: right
    };

    testCases.push(testData);


    // SCAN:  'M^3'
    // RESULT:  'M' <power> '3'

    stack = [
      '<numeric_variable>',
      'M',
      '<power>',
      '<numeric_literal>',
      3
    ];

    testData = {
      stack: stack,
      splitter: '<power>',
      left: ['<numeric_variable>', 'M'],
      right: ['<numeric_literal>', 3]
    };

    testCases.push(testData);


    // SCAN:  3.1416
    // RESULT:  <numeric_literal> '3.1416'

    stack = [
      '<numeric_literal>',
      3.1416
    ];

    testData = {
      stack: stack,
      splitter: '<numeric_literal>',
      left: [],
      right: [3.1416]
    };

    testCases.push(testData);


    // SCAN:  X
    // RESULT:  <numeric_variable> 'X'

    stack = [
      '<numeric_variable>',
      'X'
    ];

    testData = {
      stack: stack,
      splitter: '<numeric_variable>',
      left: [],
      right: ['X']
    };

    testCases.push(testData);


    // SCAN:  (1+W)/(Z1+Z2+Z3)
    // RESULT:  '1+W' <divide> 'Z1+Z2+Z3'

    stack = [
      '<left>',
      '<numeric_literal>',
      1,
      '<plus>',
      '<numeric_variable>',
      'W',
      '<right>',
      '<divide>',
      '<left>',
      '<numeric_variable>',
      'Z1',
      '<plus>',
      '<numeric_variable>',
      'Z2',
      'plus',
      '<numeric_variable>',
      'Z3',
      '<right>'
    ];

    left = [
      [
        '<numeric_literal>',
        1,
        '<plus>',
        '<numeric_variable>',
        'W'
      ]
    ];

    right = [
      [
        '<numeric_variable>',
        'Z1',
        '<plus>',
        '<numeric_variable>',
        'Z2',
        'plus',
        '<numeric_variable>',
        'Z3'
      ]
    ];

    testData = {
      stack: stack,
      splitter: '<divide>',
      left: left,
      right: right
    };

    testCases.push(testData);


    // SCAN:  (6*A-(400+X2))*11
    // RESULT:  '[6*A-[400+X2]]' <times> '11'

    stack = [
      '<left>',
      '<numeric_literal>',
      6,
      '<times>',
      '<numeric_variable>',
      'A',
      '<minus>',
      '<left>',
      '<numeric_literal>',
      400,
      '<plus>',
      '<numeric_variable>',
      'X2',
      '<right>',
      '<right>',
      '<times>',
      '<numeric_literal>',
      11
    ];

    left = [
      [
        '<numeric_literal>',
        6,
        '<times>',
        '<numeric_variable>',
        'A',
        '<minus>',
        ['<numeric_literal>', 400, '<plus>', '<numeric_variable>', 'X2']
      ]
    ];

    right = [
      '<numeric_literal>',
      11
    ];

    testData = {
      stack: stack,
      splitter: '<times>',
      left: left,
      right: right
    };

    testCases.push(testData);


    // SCAN:  RND
    // RESULT:  '<random>'

    stack = ['<random>'];

    testData = {
      stack: stack,
      splitter: '<random>',
      left: [],
      right: []
    };

    testCases.push(testData);


    // SCAN:  INT(Z6)
    // RESULT:  <integer> 'Z6'

    stack = [
      '<integer>',
      '<left>',
      '<numeric_variable>',
      'Z6',
      '<right>',
    ];

    testData = {
      stack: stack,
      splitter: '<integer>',
      left: [],
      right: [ ['<numeric_variable>', 'Z6'] ]
    };

    testCases.push(testData);


    while (testCases.length > 0) {
      testData = testCases.pop();
      result = this.builder.split(testData.stack);
      expect(result.left.length).toEqual(testData.left.length);
      expect(result.right.length).toEqual(testData.right.length);
      expect(result.splitter).toEqual(testData.splitter);
      for (i=0;i<testData.left.length;i++) {
        expect(result.left[i]).toEqual(testData.left[i]);
      }
      for (i=0;i<testData.right.length;i++) {
        expect(result.right[i]).toEqual(testData.right[i]);
      }
    }


  });



  xit('should build a usable key-value object from a numeric expression parse object array', function() {
    var expected, nmx, op1, op2, op2_2, op2_2_1, op2_2_2, op2_2_2_1, op2_2_2_2, op2_2_op, op2_2_op_1, op2_2_op_2, stack;

    stack = ['<numeric_expression>', '<numeric_variable>', 'X', '<num_exp_end>'];
    expected = {
      exp: '<numeric_variable>',
      name: 'X'
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.name).toEqual(expected.name);

    stack = ['<numeric_expression>', '<numeric_literal>', 42, '<num_exp_end>'];
    expected = {
      exp: '<numeric_variable>',
      value: 42
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.value).toEqual(expected.value);

    stack = ['<numeric_expression>', '<numeric_literal>', 13.477, '<num_exp_end>'];
    expected = {
      exp: '<numeric_variable>',
      value: 13.477
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.value).toEqual(expected.value);

    stack = ['<numeric_expression>', '<numeric_literal>', 7, '<divide>', '<numeric_literal>', 12, '<num_exp_end>'];
    expected = {
      exp: '<divide>',
      op1: {
        exp: '<numeric_variable>',
        value: 7
      },
      op2: {
        exp: '<numeric_variable>',
        value: 12
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.value).toEqual(expected.op1.value);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.value).toEqual(expected.op2.value);

    stack = ['<numeric_expression>', '<numeric_literal>', 477, '<plus>', '<numeric_variable>', 'B', '<num_exp_end>'];
    expected = {
      exp: '<plus>',
      op1: {
        exp: '<numeric_variable>',
        value: 477
      },
      op2: {
        exp: '<numeric_variable>',
        name: 'B'
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.value).toEqual(expected.op1.value);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.name).toEqual(expected.op2.name);

    stack = ['<numeric_expression>', '<numeric_variable>', 'C', '<power>', '<numeric_literal>', 2, '<num_exp_end>'];
    expected = {
      exp: '<power>',
      op1: {
        exp: '<numeric_variable>',
        name: 'C'
      },
      op2: {
        exp: '<numeric_variable>',
        value: 2
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.name).toEqual(expected.op1.name);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.value).toEqual(expected.op2.value);

    stack = ['<numeric_expression>', '<numeric_literal>', 8, '<times>', '<random>', '<num_exp_end>'];
    expected = {
      exp: '<times>',
      op1: {
        exp: '<numeric_variable>',
        value: 8
      },
      op2: {
        exp: '<random>'
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.value).toEqual(expected.op1.value);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);

    stack = ['<numeric_expression>', '<integer>', '<left>', '<numeric_expression>', '<numeric_variable>', 'A', '<num_exp_end>', '<right>', '<num_exp_end>'];
    expected = {
      exp: '<integer>',
      op: {
        exp: '<numeric_variable>',
        name: 'A'
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op.exp).toEqual(expected.op.exp);
    expect(nmx.op.name).toEqual(expected.op.name);

    stack = ['<numeric_expression>', '<numeric_variable>', 'X', '<times>', '<numeric_variable>', 'Y', '<times>', '<numeric_variable>', 'Z', '<num_exp_end>'];
    op2 = {
      exp: '<times>',
      op1: {
        exp: '<numeric_variable>',
        name: 'Y'
      },
      op2: {
        exp: '<numeric_variable>',
        name: 'Z'
      }
    };
    expected = {
      exp: '<times>',
      op1: {
        exp: '<numeric_variable>',
        name: 'X'
      },
      op2: op2
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.name).toEqual(expected.op1.name);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.op1.exp).toEqual(expected.op2.op1.exp);
    expect(nmx.op2.op1.name).toEqual(expected.op2.op1.name);
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp);
    expect(nmx.op2.op2.name).toEqual(expected.op2.op2.name);

    stack = ['<numeric_expression>', '<numeric_literal>', 28, '<times>', '<left>', '<numeric_variable>', 'J', '<plus>', '<numeric_literal>', 2, '<right>', '<num_exp_end>'];
    op2 = {
      exp: '<plus>',
      op1: {
        exp: '<numeric_variable>',
        name: 'J'
      },
      op2: {
        exp: '<numeric_variable>',
        value: 2
      }
    };
    expected = {
      exp: '<times>',
      op1: {
        exp: '<numeric_variable>',
        value: 28
      },
      op2: op2
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.value).toEqual(expected.op1.value);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.op1.exp).toEqual(expected.op2.op1.exp);
    expect(nmx.op2.op1.name).toEqual(expected.op2.op1.name);
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp);
    expect(nmx.op2.op2.value).toEqual(expected.op2.op2.value);

    stack = ['<numeric_expression>', '<numeric_literal>', 66000, '<plus>', '<numeric_literal>', 18, '<times>', '<integer>', '<left>', '<numeric_expression>', '<numeric_literal>', 42, '<times>', '<random>', '<num_exp_end>', '<right>', '<num_exp_end>'];
    op2_2_op_1 = {
      exp: '<numeric_variable>',
      value: 42
    };
    op2_2_op_2 = {
      exp: '<random>'
    };
    op2_2_op = {
      exp: '<times>',
      op1: op2_2_op_1,
      op2: op2_2_op_2
    };
    op2_2 = {
      exp: '<integer>',
      op: op2_2_op
    };
    op2 = {
      exp: '<times>',
      op1: {
        exp: '<numeric_variable>',
        value: 18
      },
      op2: op2_2
    };
    op1 = {
      exp: '<numeric_variable>',
      value: 66000
    };
    expected = {
      exp: '<plus>',
      op1: op1,
      op2: op2
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.value).toEqual(expected.op1.value);
    expect(nmx.op2.op1.exp).toEqual(expected.op2.op1.exp);
    expect(nmx.op2.op1.value).toEqual(expected.op2.op1.value);
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp);
    expect(nmx.op2.op2.op.exp).toEqual(expected.op2.op2.op.exp);
    expect(nmx.op2.op2.op.op1.exp).toEqual(expected.op2.op2.op.op1.exp);
    expect(nmx.op2.op2.op.op1.value).toEqual(expected.op2.op2.op.op1.value);
    expect(nmx.op2.op2.op.op2.exp).toEqual(expected.op2.op2.op.op2.exp);

    stack = ['<numeric_expression>', '<numeric_variable>', 'W5', '<plus>', '<numeric_variable>', 'W7', '<minus>', '<numeric_literal>', 4, '<times>', '<left>', '<numeric_variable>', 'J', '<power>', '<numeric_literal>', 2, '<plus>', '<numeric_variable>', 'K', '<power>', '<numeric_literal>', 3, '<right>', '<num_exp_end>'];
    op2_2_2_1 = {
      exp: '<power>',
      op1: {
        exp: '<numeric_variable>',
        name: 'J'
      },
      op2: {
        exp: '<numeric_variable>',
        value: 2
      }
    };
    op2_2_2_2 = {
      exp: '<power>',
      op1: {
        exp: '<numeric_variable>',
        name: 'K'
      },
      op2: {
        exp: '<numeric_variable>',
        value: 3
      }
    };
    op2_2_2 = {
      exp: '<plus>',
      op1: op2_2_2_1,
      op2: op2_2_2_2
    };
    op2_2 = {
      exp: '<times>',
      op1: {
        exp: '<numeric_variable>',
        value: 4
      },
      op2: op2_2_2
    };
    op2 = {
      exp: '<minus>',
      op1: {
        exp: '<numeric_variable>',
        name: 'W7'
      },
      op2: op2_2
    };
    expected = {
      exp: '<plus>',
      op1: {
        exp: '<numeric_variable>',
        name: 'W5'
      },
      op2: op2
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.name).toEqual(expected.op1.name);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp);
    expect(nmx.op2.op2.op1.exp).toEqual(expected.op2.op2.op1.exp);
    expect(nmx.op2.op2.op1.value).toEqual(expected.op2.op2.op1.value);
    expect(nmx.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.exp);
    expect(nmx.op2.op2.op2.op1.exp).toEqual(expected.op2.op2.op2.op1.exp);
    expect(nmx.op2.op2.op2.op1.op1.exp).toEqual(expected.op2.op2.op2.op1.op1.exp);
    expect(nmx.op2.op2.op2.op1.op1.name).toEqual(expected.op2.op2.op2.op1.op1.name);
    expect(nmx.op2.op2.op2.op1.op2.exp).toEqual(expected.op2.op2.op2.op1.op2.exp);
    expect(nmx.op2.op2.op2.op1.op2.value).toEqual(expected.op2.op2.op2.op1.op2.value);
    expect(nmx.op2.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.op2.exp);
    expect(nmx.op2.op2.op2.op2.op1.exp).toEqual(expected.op2.op2.op2.op2.op1.exp);
    expect(nmx.op2.op2.op2.op2.op1.name).toEqual(expected.op2.op2.op2.op2.op1.name);
    expect(nmx.op2.op2.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.op2.op2.exp);
    expect(nmx.op2.op2.op2.op2.op2.value).toEqual(expected.op2.op2.op2.op2.op2.value);

    stack = ['<numeric_expression>', '<left>', '<numeric_literal>', 18, '<minus>', '<numeric_variable>', 'Q7', '<right>', '<divide>', '<left>', '<numeric_literal>', 2.108, '<times>', '<left>', '<numeric_literal>', 14, '<times>', '<numeric_variable>', 'M', '<plus>', '<numeric_literal>', 17, '<times>', '<numeric_variable>', 'X', '<right>', '<right>', '<num_exp_end>'];
    op1 = {
      exp: '<minus>',
      op1: {
        exp: '<numeric_variable>',
        value: 18
      },
      op2: {
        exp: '<numeric_variable>',
        name: 'Q7'
      }
    };
    op2_2_1 = {
      exp: '<times>',
      op1: {
        exp: '<numeric_variable>',
        value: 14
      },
      op2: {
        exp: '<numeric_variable>',
        name: 'M'
      }
    };
    op2_2_2 = {
      exp: '<times>',
      op1: {
        exp: '<numeric_variable>',
        value: 17
      },
      op2: {
        exp: '<numeric_variable>',
        name: 'X'
      }
    };
    op2_2 = {
      exp: '<plus>',
      op1: op2_2_1,
      op2: op2_2_2
    };
    op2 = {
      exp: '<times>',
      op1: {
        exp: '<numeric_variable>',
        value: 2.108
      },
      op2: op2_2
    };
    expected = {
      exp: '<divide>',
      op1: op1,
      op2: op2
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.op1.exp).toEqual(expected.op1.op1.exp);
    expect(nmx.op1.op1.value).toEqual(expected.op1.op1.value);
    expect(nmx.op1.op2.exp).toEqual(expected.op1.op2.exp);
    expect(nmx.op1.op2.name).toEqual(expected.op1.op2.name);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.op1.exp).toEqual(expected.op2.op1.exp);
    expect(nmx.op2.op1.value).toEqual(expected.op2.op1.value);
    expect(nmx.op2.op2.exp).toEqual(expected.op2.op2.exp);
    expect(nmx.op2.op2.op1.exp).toEqual(expected.op2.op2.op1.exp);
    expect(nmx.op2.op2.op1.op1.exp).toEqual(expected.op2.op2.op1.op1.exp);
    expect(nmx.op2.op2.op1.op1.value).toEqual(expected.op2.op2.op1.op1.value);
    expect(nmx.op2.op2.op1.op2.exp).toEqual(expected.op2.op2.op1.op2.exp);
    expect(nmx.op2.op2.op1.op2.name).toEqual(expected.op2.op2.op1.op2.name);
    expect(nmx.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.exp);
    expect(nmx.op2.op2.op2.op1.exp).toEqual(expected.op2.op2.op2.op1.exp);
    expect(nmx.op2.op2.op2.op1.value).toEqual(expected.op2.op2.op2.op1.value);
    expect(nmx.op2.op2.op2.op2.exp).toEqual(expected.op2.op2.op2.op2.exp);
    expect(nmx.op2.op2.op2.op2.name).toEqual(expected.op2.op2.op2.op2.name);
  });

});
