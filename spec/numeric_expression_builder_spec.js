GB80 = require('../gb80');
NumericExpressionBuilder = GB80.NumericExpressionBuilder;

describe("Numeric expression builder", function() {

  beforeEach(function() {
    this.builder = new NumericExpressionBuilder;
  });


  it("should strip parentheses in an expression and replace them with nested arrays of tokens", function() {
    var result, stack;

    // TEST  (J+K)
    stack = [
      "<left>",
      "<number_variable>",
      "J",
      "<plus>",
      "<number_variable>",
      "K",
      "<right>"
    ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(jasmine.any(Array));
    expect(result[0].length).toEqual(5);
    expect(result[0][0]).toEqual("<number_variable>");
    expect(result[0][1]).toEqual("J");
    expect(result[0][2]).toEqual("<plus>");
    expect(result[0][3]).toEqual("<number_variable>");
    expect(result[0][4]).toEqual("K");


    // TEST  1+(4*A*C)/B
    stack = [
      "<numeric_literal>",
      1,
      "<plus>",
      "<left>",
      "<numeric_literal>",
      4,
      "<times>",
       "<number_variable>",
       "A",
       "<times>",
       "<number_variable>",
       "C",
       "<right>",
       "<divide>",
       "<number_variable>",
       "B"
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(7);
    expect(result[0]).toEqual("<numeric_literal>");
    expect(result[1]).toEqual(1);
    expect(result[2]).toEqual("<plus>");
    expect(result[3]).toEqual(jasmine.any(Array));
    expect(result[3].length).toEqual(8);
    expect(result[3][0]).toEqual("<numeric_literal>");
    expect(result[3][1]).toEqual(4);
    expect(result[3][2]).toEqual("<times>");
    expect(result[3][3]).toEqual("<number_variable>");
    expect(result[3][4]).toEqual("A");
    expect(result[3][5]).toEqual("<times>");
    expect(result[3][6]).toEqual("<number_variable>");
    expect(result[3][7]).toEqual("C");
    expect(result[4]).toEqual("<divide>");
    expect(result[5]).toEqual("<number_variable>");
    expect(result[6]).toEqual("B");


    // TEST  INT(W)
    stack = [
      "<integer>",
      "<left>",
      "<number_variable>",
      "W",
      "<right>"
    ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual("<integer>");
    expect(result[1]).toEqual(jasmine.any(Array));
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("<number_variable>");
    expect(result[1][1]).toEqual("W");


    // TEST  (200+INT(S7))*44
    stack = [
      "<left>",
      "<numeric_literal>",
      200,
      "<plus>",
      "<integer>",
       "<left>",
       "<number_variable>",
       "S7",
       "<right>",
       "<right>",
       "<times>",
       "<numeric_literal>",
       44
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual(jasmine.any(Array));
    expect(result[0].length).toEqual(5);
    expect(result[0][0]).toEqual("<numeric_literal>");
    expect(result[0][1]).toEqual(200);
    expect(result[0][2]).toEqual("<plus>");
    expect(result[0][3]).toEqual("<integer>");
    expect(result[0][4]).toEqual(jasmine.any(Array));
    expect(result[0][4].length).toEqual(2);
    expect(result[0][4][0]).toEqual("<number_variable>");
    expect(result[0][4][1]).toEqual("S7");
    expect(result[1]).toEqual("<times>");
    expect(result[2]).toEqual("<numeric_literal>");
    expect(result[3]).toEqual(44);


    // TEST  (S2+7)/(E4^2-7)
    stack = [
      "<left>",
      "<number_variable>",
      "S2",
      "<plus>",
      "<numeric_literal>",
      7,
      "<right>",
      "<divide>",
      "<left>",
      "<number_variable>",
      "E4",
      "<power>",
      "<numeric_literal>",
       2,
       "<minus>",
       "<numeric_literal>",
       7,
       "<right>"
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual(jasmine.any(Array));
    expect(result[0].length).toEqual(5);
    expect(result[0][0]).toEqual("<number_variable>");
    expect(result[0][1]).toEqual("S2");
    expect(result[0][2]).toEqual("<plus>");
    expect(result[0][3]).toEqual("<numeric_literal>");
    expect(result[0][4]).toEqual(7);
    expect(result[1]).toEqual("<divide>");
    expect(result[2]).toEqual(jasmine.any(Array));
    expect(result[2].length).toEqual(8);
    expect(result[2][0]).toEqual("<number_variable>");
    expect(result[2][1]).toEqual("E4");
    expect(result[2][2]).toEqual("<power>");
    expect(result[2][3]).toEqual("<numeric_literal>");
    expect(result[2][4]).toEqual(2);
    expect(result[2][5]).toEqual("<minus>");
    expect(result[2][6]).toEqual("<numeric_literal>");
    expect(result[2][7]).toEqual(7);


    // TEST  6+(A/(400+X2))*11
    stack = [
      "<numeric_literal>",
      6,
      "<plus>",
      "<left>",
      "<number_variable>",
       "A",
       "<divide>",
       "<left>",
       "<numeric_literal>",
       400,
       "<plus>",
       "<number_variable>",
       "X2",
       "<right>",
       "<right>",
       "<times>",
       "<numeric_literal>",
       11
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(7);
    expect(result[0]).toEqual("<numeric_literal>");
    expect(result[1]).toEqual(6);
    expect(result[2]).toEqual(("<plus>"));
    expect(result[3]).toEqual(jasmine.any(Array));
    expect(result[3].length).toEqual(4);
    expect(result[3][0]).toEqual("<number_variable>");
    expect(result[3][1]).toEqual('A');
    expect(result[3][2]).toEqual('<divide>');
    expect(result[3][3]).toEqual(jasmine.any(Array));
    expect(result[3][3].length).toEqual(5);
    expect(result[3][3][0]).toEqual("<numeric_literal>");
    expect(result[3][3][1]).toEqual(400);
    expect(result[3][3][2]).toEqual('<plus>');
    expect(result[3][3][3]).toEqual("<number_variable>");
    expect(result[3][3][4]).toEqual('X2');
    expect(result[4]).toEqual('<times>');
    expect(result[5]).toEqual("<numeric_literal>");
    expect(result[6]).toEqual(11);


    // TEST  (6*A-(400+X2))*11
    stack = [
      "<left>",
      "<numeric_literal>",
      6,
      "<times>",
      "<number_variable>",
       "A",
       "<minus>",
       "<left>",
       "<numeric_literal>",
       400,
       "<plus>",
       "<number_variable>",
       "X2",
       "<right>",
       "<right>",
       "<times>",
       "<numeric_literal>",
       11
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual(jasmine.any(Array));
    expect(result[0].length).toEqual(7);
    expect(result[0][0]).toEqual("<numeric_literal>");
    expect(result[0][1]).toEqual(6);
    expect(result[0][2]).toEqual("<times>");
    expect(result[0][3]).toEqual("<number_variable>");
    expect(result[0][4]).toEqual("A");
    expect(result[0][5]).toEqual("<minus>");
    expect(result[0][6]).toEqual(jasmine.any(Array));
    expect(result[0][6].length).toEqual(5);
    expect(result[0][6][0]).toEqual("<numeric_literal>");
    expect(result[0][6][1]).toEqual(400);
    expect(result[0][6][2]).toEqual("<plus>");
    expect(result[0][6][3]).toEqual("<number_variable>");
    expect(result[0][6][4]).toEqual("X2");


    // TEST  2*(A-0.3333)*(B+1.7)
    stack = [
      "<numeric_literal>",
      2,
      "<times>",
      "<left>",
      "<number_variable>",
      "A",
      "<minus>",
      "<numeric_literal>",
      0.3333,
      "<right>",
      "<times>",
      "<left>",
      "<number_variable>",
       "B",
       "<plus>",
       "<numeric_literal>",
       1.7,
       "<right>"
     ];

    result = this.builder.deparenthesize(stack);
    expect(result.length).toEqual(6);
    expect(result[0]).toEqual("<numeric_literal>");
    expect(result[1]).toEqual(2);
    expect(result[2]).toEqual("<times>");
    expect(result[3]).toEqual(jasmine.any(Array));
    expect(result[3].length).toEqual(5);
    expect(result[3][0]).toEqual("<number_variable>");
    expect(result[3][1]).toEqual("A");
    expect(result[3][2]).toEqual("<minus>");
    expect(result[3][3]).toEqual("<numeric_literal>");
    expect(result[3][4]).toEqual(0.3333);
    expect(result[4]).toEqual("<times>");
    expect(result[5]).toEqual(jasmine.any(Array));
    expect(result[5].length).toEqual(5);
    expect(result[5][0]).toEqual("<number_variable>");
    expect(result[5][1]).toEqual("B");
    expect(result[5][2]).toEqual("<plus>");
    expect(result[5][3]).toEqual("<numeric_literal>");
    expect(result[5][4]).toEqual(1.7);

  });



  xit("should find the designated splitter token in an expression", function() {
    var i, left, result, right, stack, test_data, _aa, _ab, _ac, _ad, _ae, _af, _ag, _ah, _ai, _aj, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _s, _t, _u, _v, _w, _x, _y, _z;

    stack = ["<number_variable>", "A", "<plus>", "<number_variable>", "B"];
    left = ["<numeric_expression>", "<number_variable>", "A", "<num_exp_end>"];
    right = ["<numeric_expression>", "<number_variable>", "B", "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<plus>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _i = 0, _ref = test_data.left.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _j = 0, _ref1 = test_data.right.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<number_variable>", "X", "<minus>", "<numeric_literal>", 200];
    left = ["<numeric_expression>", "<number_variable>", "X", "<num_exp_end>"];
    right = ["<numeric_expression>", "<numeric_literal>", 200, "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<minus>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _k = 0, _ref2 = test_data.left.length - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _l = 0, _ref3 = test_data.right.length - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; i = 0 <= _ref3 ? ++_l : --_l) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<number_variable>", "P", "<plus>", "<number_variable>", "Q", "<plus>", "<number_variable>", "R", "<plus>", "<number_variable>", "S"];
    left = ["<numeric_expression>", "<number_variable>", "P", "<num_exp_end>"];
    right = ["<numeric_expression>", "<number_variable>", "Q", "<plus>", "<number_variable>", "R", "<plus>", "<number_variable>", "S", "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<plus>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _m = 0, _ref4 = test_data.left.length - 1; 0 <= _ref4 ? _m <= _ref4 : _m >= _ref4; i = 0 <= _ref4 ? ++_m : --_m) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _n = 0, _ref5 = test_data.right.length - 1; 0 <= _ref5 ? _n <= _ref5 : _n >= _ref5; i = 0 <= _ref5 ? ++_n : --_n) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<number_variable>", "J", "<times>", "<number_variable>", "Z1", "<minus>", "<number_variable>", "K", "<times>", "<number_variable>", "Z2"];
    left = ["<numeric_expression>", "<number_variable>", "J", "<times>", "<number_variable>", "Z1", "<num_exp_end>"];
    right = ["<numeric_expression>", "<number_variable>", "K", "<times>", "<number_variable>", "Z2", "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<minus>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _o = 0, _ref6 = test_data.left.length - 1; 0 <= _ref6 ? _o <= _ref6 : _o >= _ref6; i = 0 <= _ref6 ? ++_o : --_o) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _p = 0, _ref7 = test_data.right.length - 1; 0 <= _ref7 ? _p <= _ref7 : _p >= _ref7; i = 0 <= _ref7 ? ++_p : --_p) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<numeric_literal>", 21, "<times>", "<number_variable>", "T"];
    left = ["<numeric_expression>", "<numeric_literal>", 21, "<num_exp_end>"];
    right = ["<numeric_expression>", "<number_variable>", "T", "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<times>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _q = 0, _ref8 = test_data.left.length - 1; 0 <= _ref8 ? _q <= _ref8 : _q >= _ref8; i = 0 <= _ref8 ? ++_q : --_q) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _r = 0, _ref9 = test_data.right.length - 1; 0 <= _ref9 ? _r <= _ref9 : _r >= _ref9; i = 0 <= _ref9 ? ++_r : --_r) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<numeric_literal>", 3.1416, "<divide>", "<numeric_literal>", 2];
    left = ["<numeric_expression>", "<numeric_literal>", 3.1416, "<num_exp_end>"];
    right = ["<numeric_expression>", "<numeric_literal>", 2, "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<divide>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _s = 0, _ref10 = test_data.left.length - 1; 0 <= _ref10 ? _s <= _ref10 : _s >= _ref10; i = 0 <= _ref10 ? ++_s : --_s) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _t = 0, _ref11 = test_data.right.length - 1; 0 <= _ref11 ? _t <= _ref11 : _t >= _ref11; i = 0 <= _ref11 ? ++_t : --_t) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<numeric_literal>", 3.3333, "<times>", "<number_variable>", "Z", "<times>", "<number_variable>", "A", "<divide>", "<number_variable>", "M"];
    left = ["<numeric_expression>", "<numeric_literal>", 3.3333, "<num_exp_end>"];
    right = ["<numeric_expression>", "<number_variable>", "Z", "<times>", "<number_variable>", "A", "<divide>", "<number_variable>", "M", "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<times>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _u = 0, _ref12 = test_data.left.length - 1; 0 <= _ref12 ? _u <= _ref12 : _u >= _ref12; i = 0 <= _ref12 ? ++_u : --_u) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _v = 0, _ref13 = test_data.right.length - 1; 0 <= _ref13 ? _v <= _ref13 : _v >= _ref13; i = 0 <= _ref13 ? ++_v : --_v) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<number_variable>", "M", "<power>", "<numeric_literal>", 3];
    left = ["<numeric_expression>", "<number_variable>", "M", "<num_exp_end>"];
    right = ["<numeric_expression>", "<numeric_literal>", 3, "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<power>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _w = 0, _ref14 = test_data.left.length - 1; 0 <= _ref14 ? _w <= _ref14 : _w >= _ref14; i = 0 <= _ref14 ? ++_w : --_w) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _x = 0, _ref15 = test_data.right.length - 1; 0 <= _ref15 ? _x <= _ref15 : _x >= _ref15; i = 0 <= _ref15 ? ++_x : --_x) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<numeric_literal>", 3.1416];
    left = [];
    right = [3.1416];
    test_data = {
      stack: stack,
      expected_expression: "<numeric_literal>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _y = 0, _ref16 = test_data.left.length - 1; 0 <= _ref16 ? _y <= _ref16 : _y >= _ref16; i = 0 <= _ref16 ? ++_y : --_y) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _z = 0, _ref17 = test_data.right.length - 1; 0 <= _ref17 ? _z <= _ref17 : _z >= _ref17; i = 0 <= _ref17 ? ++_z : --_z) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<number_variable>", "X"];
    left = [];
    right = ["X"];
    test_data = {
      stack: stack,
      expected_expression: "<number_variable>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _aa = 0, _ref18 = test_data.left.length - 1; 0 <= _ref18 ? _aa <= _ref18 : _aa >= _ref18; i = 0 <= _ref18 ? ++_aa : --_aa) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _ab = 0, _ref19 = test_data.right.length - 1; 0 <= _ref19 ? _ab <= _ref19 : _ab >= _ref19; i = 0 <= _ref19 ? ++_ab : --_ab) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<left>", "<numeric_literal>", 1, "<plus>", "<number_variable>", "W", "<right>", "<divide>", "<left>", "<number_variable>", "Z1", "<plus>", "<number_variable>", "Z2", "plus", "<number_variable>", "Z3", "<right>"];
    left = ["<numeric_expression>", "<numeric_literal>", 1, "<plus>", "<number_variable>", "W", "<num_exp_end>"];
    right = ["<numeric_expression>", "<number_variable>", "Z1", "<plus>", "<number_variable>", "Z2", "plus", "<number_variable>", "Z3", "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<divide>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _ac = 0, _ref20 = test_data.left.length - 1; 0 <= _ref20 ? _ac <= _ref20 : _ac >= _ref20; i = 0 <= _ref20 ? ++_ac : --_ac) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _ad = 0, _ref21 = test_data.right.length - 1; 0 <= _ref21 ? _ad <= _ref21 : _ad >= _ref21; i = 0 <= _ref21 ? ++_ad : --_ad) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<left>", "<numeric_literal>", 6, "<times>", "<number_variable>", "A", "<minus>", "<left>", "<numeric_literal>", 400, "<plus>", "<number_variable>", "X2", "<right>", "<right>", "<times>", "<numeric_literal>", 11];
    left = ["<numeric_expression>", "<numeric_literal>", 6, "<times>", "<number_variable>", "A", "<minus>", ["<numeric_literal>", 400, "<plus>", "<number_variable>", "X2"], "<num_exp_end>"];
    right = ["<numeric_expression>", "<numeric_literal>", 11, "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<times>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _ae = 0, _ref22 = test_data.left.length - 1; 0 <= _ref22 ? _ae <= _ref22 : _ae >= _ref22; i = 0 <= _ref22 ? ++_ae : --_ae) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _af = 0, _ref23 = test_data.right.length - 1; 0 <= _ref23 ? _af <= _ref23 : _af >= _ref23; i = 0 <= _ref23 ? ++_af : --_af) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<random>"];
    left = [];
    right = [];
    test_data = {
      stack: stack,
      expected_expression: "<random>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _ag = 0, _ref24 = test_data.left.length - 1; 0 <= _ref24 ? _ag <= _ref24 : _ag >= _ref24; i = 0 <= _ref24 ? ++_ag : --_ag) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    for (i = _ah = 0, _ref25 = test_data.right.length - 1; 0 <= _ref25 ? _ah <= _ref25 : _ah >= _ref25; i = 0 <= _ref25 ? ++_ah : --_ah) {
      expect(result.right[i]).toEqual(test_data.right[i]);
    }

    stack = ["<integer>", "<left>", "<number_variable>", "Z6", "<right>"];
    left = [];
    right = ["<numeric_expression>", "<number_variable>", "Z6", "<num_exp_end>"];
    test_data = {
      stack: stack,
      expected_expression: "<integer>",
      left: left,
      right: right
    };
    result = this.builder.split(test_data.stack);
    expect(result.left.length).toEqual(test_data.left.length);
    expect(result.right.length).toEqual(test_data.right.length);
    expect(result.exp).toEqual(test_data.expected_expression);
    for (i = _ai = 0, _ref26 = test_data.left.length - 1; 0 <= _ref26 ? _ai <= _ref26 : _ai >= _ref26; i = 0 <= _ref26 ? ++_ai : --_ai) {
      expect(result.left[i]).toEqual(test_data.left[i]);
    }
    _results = [];
    for (i = _aj = 0, _ref27 = test_data.right.length - 1; 0 <= _ref27 ? _aj <= _ref27 : _aj >= _ref27; i = 0 <= _ref27 ? ++_aj : --_aj) {
      _results.push(expect(result.right[i]).toEqual(test_data.right[i]));
    }
  });



  xit("should build a usable key-value object from a numeric expression 'parse object' array", function() {
    var expected, nmx, op1, op2, op2_2, op2_2_1, op2_2_2, op2_2_2_1, op2_2_2_2, op2_2_op, op2_2_op_1, op2_2_op_2, stack;

    stack = ["<numeric_expression>", "<number_variable>", "X", "<num_exp_end>"];
    expected = {
      exp: "<var>",
      name: "X"
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.name).toEqual(expected.name);

    stack = ["<numeric_expression>", "<numeric_literal>", 42, "<num_exp_end>"];
    expected = {
      exp: "<num>",
      value: 42
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.value).toEqual(expected.value);

    stack = ["<numeric_expression>", "<numeric_literal>", 13.477, "<num_exp_end>"];
    expected = {
      exp: "<num>",
      value: 13.477
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.value).toEqual(expected.value);

    stack = ["<numeric_expression>", "<numeric_literal>", 7, "<divide>", "<numeric_literal>", 12, "<num_exp_end>"];
    expected = {
      exp: "<divide>",
      op1: {
        exp: "<num>",
        value: 7
      },
      op2: {
        exp: "<num>",
        value: 12
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.value).toEqual(expected.op1.value);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.value).toEqual(expected.op2.value);

    stack = ["<numeric_expression>", "<numeric_literal>", 477, "<plus>", "<number_variable>", "B", "<num_exp_end>"];
    expected = {
      exp: "<plus>",
      op1: {
        exp: "<num>",
        value: 477
      },
      op2: {
        exp: "<var>",
        name: "B"
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.value).toEqual(expected.op1.value);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.name).toEqual(expected.op2.name);

    stack = ["<numeric_expression>", "<number_variable>", "C", "<power>", "<numeric_literal>", 2, "<num_exp_end>"];
    expected = {
      exp: "<power>",
      op1: {
        exp: "<var>",
        name: "C"
      },
      op2: {
        exp: "<num>",
        value: 2
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.name).toEqual(expected.op1.name);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);
    expect(nmx.op2.value).toEqual(expected.op2.value);

    stack = ["<numeric_expression>", "<numeric_literal>", 8, "<times>", "<random>", "<num_exp_end>"];
    expected = {
      exp: "<times>",
      op1: {
        exp: "<num>",
        value: 8
      },
      op2: {
        exp: "<random>"
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op1.exp).toEqual(expected.op1.exp);
    expect(nmx.op1.value).toEqual(expected.op1.value);
    expect(nmx.op2.exp).toEqual(expected.op2.exp);

    stack = ["<numeric_expression>", "<integer>", "<left>", "<numeric_expression>", "<number_variable>", "A", "<num_exp_end>", "<right>", "<num_exp_end>"];
    expected = {
      exp: "<integer>",
      op: {
        exp: "<var>",
        name: "A"
      }
    };
    nmx = this.builder.buildNumericExpression(stack);
    expect(nmx.exp).toEqual(expected.exp);
    expect(nmx.op.exp).toEqual(expected.op.exp);
    expect(nmx.op.name).toEqual(expected.op.name);

    stack = ["<numeric_expression>", "<number_variable>", "X", "<times>", "<number_variable>", "Y", "<times>", "<number_variable>", "Z", "<num_exp_end>"];
    op2 = {
      exp: "<times>",
      op1: {
        exp: "<var>",
        name: "Y"
      },
      op2: {
        exp: "<var>",
        name: "Z"
      }
    };
    expected = {
      exp: "<times>",
      op1: {
        exp: "<var>",
        name: "X"
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

    stack = ["<numeric_expression>", "<numeric_literal>", 28, "<times>", "<left>", "<number_variable>", "J", "<plus>", "<numeric_literal>", 2, "<right>", "<num_exp_end>"];
    op2 = {
      exp: "<plus>",
      op1: {
        exp: "<var>",
        name: "J"
      },
      op2: {
        exp: "<num>",
        value: 2
      }
    };
    expected = {
      exp: "<times>",
      op1: {
        exp: "<num>",
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

    stack = ["<numeric_expression>", "<numeric_literal>", 66000, "<plus>", "<numeric_literal>", 18, "<times>", "<integer>", "<left>", "<numeric_expression>", "<numeric_literal>", 42, "<times>", "<random>", "<num_exp_end>", "<right>", "<num_exp_end>"];
    op2_2_op_1 = {
      exp: "<num>",
      value: 42
    };
    op2_2_op_2 = {
      exp: "<random>"
    };
    op2_2_op = {
      exp: "<times>",
      op1: op2_2_op_1,
      op2: op2_2_op_2
    };
    op2_2 = {
      exp: "<integer>",
      op: op2_2_op
    };
    op2 = {
      exp: "<times>",
      op1: {
        exp: "<num>",
        value: 18
      },
      op2: op2_2
    };
    op1 = {
      exp: "<num>",
      value: 66000
    };
    expected = {
      exp: "<plus>",
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

    stack = ["<numeric_expression>", "<number_variable>", "W5", "<plus>", "<number_variable>", "W7", "<minus>", "<numeric_literal>", 4, "<times>", "<left>", "<number_variable>", "J", "<power>", "<numeric_literal>", 2, "<plus>", "<number_variable>", "K", "<power>", "<numeric_literal>", 3, "<right>", "<num_exp_end>"];
    op2_2_2_1 = {
      exp: "<power>",
      op1: {
        exp: "<var>",
        name: "J"
      },
      op2: {
        exp: "<num>",
        value: 2
      }
    };
    op2_2_2_2 = {
      exp: "<power>",
      op1: {
        exp: "<var>",
        name: "K"
      },
      op2: {
        exp: "<num>",
        value: 3
      }
    };
    op2_2_2 = {
      exp: "<plus>",
      op1: op2_2_2_1,
      op2: op2_2_2_2
    };
    op2_2 = {
      exp: "<times>",
      op1: {
        exp: "<num>",
        value: 4
      },
      op2: op2_2_2
    };
    op2 = {
      exp: "<minus>",
      op1: {
        exp: "<var>",
        name: "W7"
      },
      op2: op2_2
    };
    expected = {
      exp: "<plus>",
      op1: {
        exp: "<var>",
        name: "W5"
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

    stack = ["<numeric_expression>", "<left>", "<numeric_literal>", 18, "<minus>", "<number_variable>", "Q7", "<right>", "<divide>", "<left>", "<numeric_literal>", 2.108, "<times>", "<left>", "<numeric_literal>", 14, "<times>", "<number_variable>", "M", "<plus>", "<numeric_literal>", 17, "<times>", "<number_variable>", "X", "<right>", "<right>", "<num_exp_end>"];
    op1 = {
      exp: "<minus>",
      op1: {
        exp: "<num>",
        value: 18
      },
      op2: {
        exp: "<var>",
        name: "Q7"
      }
    };
    op2_2_1 = {
      exp: "<times>",
      op1: {
        exp: "<num>",
        value: 14
      },
      op2: {
        exp: "<var>",
        name: "M"
      }
    };
    op2_2_2 = {
      exp: "<times>",
      op1: {
        exp: "<num>",
        value: 17
      },
      op2: {
        exp: "<var>",
        name: "X"
      }
    };
    op2_2 = {
      exp: "<plus>",
      op1: op2_2_1,
      op2: op2_2_2
    };
    op2 = {
      exp: "<times>",
      op1: {
        exp: "<num>",
        value: 2.108
      },
      op2: op2_2
    };
    expected = {
      exp: "<divide>",
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
