// Generated by CoffeeScript 1.7.1
describe("Numeric expression evaluator", function() {
  it("should create a NumericExpressionEvaluator object", function() {
    var nmx_eval;
    nmx_eval = new NumericExpressionEvaluator;
    return expect(nmx_eval).toEqual(jasmine.any(NumericExpressionEvaluator));
  });
  beforeEach(function() {
    this.nmx_eval = new NumericExpressionEvaluator;
    return this.num_vars = this.nmx_eval.vars;
  });
  it("should evaluate a numeric literal", function() {
    var nmx, value;
    nmx = {
      exp: "<num>",
      value: 42
    };
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(42);
    nmx = {
      exp: "<num>",
      value: 0
    };
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(0);
    nmx = {
      exp: "<num>",
      value: 6
    };
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(6);
    nmx = {
      exp: "<num>",
      value: 3.1416
    };
    value = this.nmx_eval.val(nmx);
    return expect(value).toEqual(3.1416);
  });
  it("should evaluate a reference to a number variable", function() {
    var nmx, value;
    nmx = {
      exp: "<var>",
      name: "Y"
    };
    this.num_vars.set("Y", 7);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(7);
    nmx = {
      exp: "<var>",
      name: "A8"
    };
    this.num_vars.set("A8", 0);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(0);
    nmx = {
      exp: "<var>",
      name: "E"
    };
    this.num_vars.set("E", 944.67);
    value = this.nmx_eval.val(nmx);
    return expect(value).toEqual(944.67);
  });
  it("should evaluate a simple binary expression", function() {
    var nmx, value;
    nmx = {
      exp: "<plus>",
      op1: {
        exp: "<num>",
        value: 440
      },
      op2: {
        exp: "<num>",
        value: 16
      }
    };
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(456);
    nmx = {
      exp: "<minus>",
      op1: {
        exp: "<num>",
        value: 888
      },
      op2: {
        exp: "<num>",
        value: 555
      }
    };
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(333);
    nmx = {
      exp: "<times>",
      op1: {
        exp: "<num>",
        value: 3
      },
      op2: {
        exp: "<num>",
        value: 17
      }
    };
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(51);
    nmx = {
      exp: "<divide>",
      op1: {
        exp: "<num>",
        value: 1024
      },
      op2: {
        exp: "<num>",
        value: 256
      }
    };
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(4);
    nmx = {
      exp: "<power>",
      op1: {
        exp: "<num>",
        value: 2
      },
      op2: {
        exp: "<num>",
        value: 5
      }
    };
    value = this.nmx_eval.val(nmx);
    return expect(value).toEqual(32);
  });
  it("should evaluate compound binary expressions", function() {
    var nmx, op2, value;
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
    nmx = {
      exp: "<times>",
      op1: {
        exp: "<var>",
        name: "X"
      },
      op2: op2
    };
    this.num_vars.set("X", 2);
    this.num_vars.set("Y", 3);
    this.num_vars.set("Z", 5);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(30);
    this.num_vars.set("X", 11);
    this.num_vars.set("Y", 3);
    this.num_vars.set("Z", 100);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(3300);
    op2 = {
      exp: "<minus>",
      op1: {
        exp: "<num>",
        value: 12
      },
      op2: {
        exp: "<num>",
        value: 4
      }
    };
    nmx = {
      exp: "<plus>",
      op1: {
        exp: "<num>",
        value: 800
      },
      op2: op2
    };
    value = this.nmx_eval.val(nmx);
    return expect(value).toEqual(808);
  });
  return it("should evaluate numeric expressions with parentheses", function() {
    var nmx, op1, op1_2, op1_2_2, op2, value;
    op1 = {
      exp: "<minus>",
      op1: {
        exp: "<var>",
        name: "A"
      },
      op2: {
        exp: "<var>",
        name: "B"
      }
    };
    nmx = {
      exp: "<divide>",
      op1: op1,
      op2: {
        exp: "<num>",
        value: 3
      }
    };
    this.num_vars.set("A", 555);
    this.num_vars.set("B", 222);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(111);
    this.num_vars.set("A", 71);
    this.num_vars.set("B", 20);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(17);
    op2 = {
      exp: "<plus>",
      op1: {
        exp: "<num>",
        value: 40
      },
      op2: {
        exp: "<var>",
        name: "L"
      }
    };
    nmx = {
      exp: "<times>",
      op1: {
        exp: "<var>",
        name: "W"
      },
      op2: op2
    };
    this.num_vars.set("W", 100);
    this.num_vars.set("L", 28);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(6800);
    this.num_vars.set("W", 7);
    this.num_vars.set("L", 30);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(490);
    op1 = {
      exp: "<plus>",
      op1: {
        exp: "<num>",
        value: 14
      },
      op2: {
        exp: "<var>",
        name: "M1"
      }
    };
    op2 = {
      exp: "<plus>",
      op1: {
        exp: "<num>",
        value: 11
      },
      op2: {
        exp: "<var>",
        name: "M2"
      }
    };
    nmx = {
      exp: "<divide>",
      op1: op1,
      op2: op2
    };
    this.num_vars.set("M1", 28);
    this.num_vars.set("M2", 3);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(3);
    this.num_vars.set("M1", 16);
    this.num_vars.set("M2", 9);
    value = this.nmx_eval.val(nmx);
    expect(value).toEqual(1.5);
    op1_2_2 = {
      tag: "op1_2_2",
      exp: "<minus>",
      op1: {
        exp: "<var>",
        name: "L"
      },
      op2: {
        exp: "<num>",
        value: 7
      }
    };
    op1_2 = {
      tag: "op1_2",
      exp: "<times>",
      op1: {
        exp: "<num>",
        value: 3
      },
      op2: op1_2_2
    };
    op1 = {
      tag: "op1",
      exp: "<minus>",
      op1: {
        exp: "<num>",
        value: 201
      },
      op2: op1_2
    };
    nmx = {
      tag: "nmx",
      exp: "<divide>",
      op1: op1,
      op2: {
        exp: "<num>",
        value: 9
      }
    };
    this.num_vars.set("L", 14);
    value = this.nmx_eval.val(nmx);
    return expect(value).toEqual(20);
  });
});
