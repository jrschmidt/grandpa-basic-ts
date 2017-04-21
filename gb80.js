"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NumericExpressionBuilder = (function () {
    function NumericExpressionBuilder() {
    }
    // Builds a numeric expression object from an array of parse tokens.
    //
    // The object for the simple variable name X will be:
    //	 {exp: "<numeric_variable>", name: "X"}.
    //
    // The object for a simple numeric literal such as 3.1416 will be:
    //	 {exp: "<numeric_literal>", value: 3.1416}.
    //
    // Compound numeric expressions are built into binary numeric expression
    // objects with three properties: The "exp" property will be a symbol denoting
    // the operator within the expression with the highest precedence. The values
    // of the "op1" and "op2" properties will be nested numeric expression objects.
    // So, for example, in the expression 3*A+2*B-5*C the "exp" property will be
    // "<plus>", the value of "op1" will be an object representing 3*A, and the
    // value of "op2" will be an object representing 2*B-5*C.
    NumericExpressionBuilder.prototype.buildNumericExpression = function (stack) {
        var expression = {
            tag: '<none>'
        };
        var splitStack = this.split(stack);
        switch (splitStack.splitter) {
            case '<plus>':
            case '<minus>':
            case '<times>':
            case '<divide>':
            case '<power>':
                expression = this.buildBinaryNumericExpression(splitStack);
                break;
            case '<numeric_literal>':
                expression = this.buildNumericLiteralExpression(splitStack);
                break;
            case '<numeric_variable>':
                expression = this.buildNumericVariableExpression(splitStack);
                break;
        }
        return expression;
    };
    NumericExpressionBuilder.prototype.buildBinaryNumericExpression = function (stack) {
        var left = this.buildNumericExpression(stack.left);
        var right = this.buildNumericExpression(stack.right);
        var expression = {
            tag: stack.splitter,
            op1: left,
            op2: right
        };
        return expression;
    };
    NumericExpressionBuilder.prototype.buildNumericLiteralExpression = function (stack) {
        var expression = {
            tag: '<numeric_literal>',
            value: stack.right[0]
        };
        return expression;
    };
    NumericExpressionBuilder.prototype.buildNumericVariableExpression = function (stack) {
        var expression = {
            tag: '<numeric_variable>',
            name: stack.right[0]
        };
        return expression;
    };
    // this.buildNumericVariableExpression(splitStack);
    // this.buildNumericRandomFunctionExpression(splitStack);
    // this.buildNumericIntegerFunctionExpression(splitStack);
    NumericExpressionBuilder.prototype.stripDelimiterTokens = function (stack) {
        var first = stack[0];
        var last = stack[stack.length - 1];
        if (first === '<numeric_expression>' && last === '<num_exp_end>') {
            stack = stack.slice(1, stack.length - 1);
        }
        return stack;
    };
    NumericExpressionBuilder.prototype.split = function (stack) {
        var found = 'no';
        var splitIndex;
        var rankings = [
            ['<plus>', '<minus>'],
            ['<times>', '<divide>'],
            ['<power>'],
            ['<numeric_literal>', '<numeric_variable>'],
            ['<random>', '<integer>']
        ];
        var result = {
            splitter: '<none>',
            left: [],
            right: []
        };
        stack = this.stripDelimiterTokens(stack);
        stack = this.deparenthesize(stack);
        for (var rank = 0; rank < rankings.length; rank++) {
            if (found != 'yes') {
                for (var n = 0; n < stack.length; n++) {
                    if (found != 'yes') {
                        for (var i = 0; i < rankings[rank].length; i++) {
                            if (stack[n] === rankings[rank][i]) {
                                splitIndex = n;
                                found = 'yes';
                            }
                        }
                    }
                }
            }
        }
        var splitter = stack[splitIndex];
        result.splitter = splitter;
        var left = stack.slice(0, splitIndex);
        left = this.extractFromArray(left);
        result.left = left;
        var right = stack.slice(splitIndex + 1);
        if (splitter != '<numeric_variable>') {
            right = this.extractFromArray(right);
        }
        result.right = right;
        return result;
    };
    NumericExpressionBuilder.prototype.extractFromArray = function (stack) {
        if ((stack.length === 1) && stack[0][0]) {
            var stack0 = stack[0];
            stack = stack0;
        }
        return stack;
    };
    NumericExpressionBuilder.prototype.deparenthesize = function (stack) {
        var mainStacks = [[]];
        var tailStack = [];
        var middleStack;
        for (var i = 0; i < stack.length; i++) {
            if (stack[i] === '<left>') {
                mainStacks.push([]);
            }
            if (stack[i] === '<right>') {
                middleStack = mainStacks.pop();
                mainStacks[mainStacks.length - 1].push(middleStack);
                mainStacks[mainStacks.length - 1] = mainStacks[mainStacks.length - 1].concat(tailStack);
                tailStack = [];
            }
            if ((stack[i] != '<left>') && (stack[i] != '<right>')) {
                mainStacks[mainStacks.length - 1].push(stack[i]);
            }
        }
        if (mainStacks.length != 1) {
            return [];
        }
        else {
            mainStacks[0] = mainStacks[0].concat(tailStack);
            return mainStacks[0];
        }
    };
    return NumericExpressionBuilder;
}());
exports.NumericExpressionBuilder = NumericExpressionBuilder;
var StringExpressionBuilder = (function () {
    function StringExpressionBuilder() {
    }
    // Building a string expression object is much simpler than numeric
    // expressions, since the only operation in a string expression is
    // concatenation. Therefore,	a string expression object is composed of an
    // array of one or more subarrays, where each subarray has two elements. The
    // first element is a symbol, either "<str>" for a string literal or "<var>"
    // for a string variable. The second element for a string literal is the
    // string itself. For a string variable, the second element is the variable
    // name.
    //
    // Please note that the name for a string variable is recorded WITHOUT the
    // dollar sign character ($). In BASIC syntax, string variable names are always
    // preceeded with the '$' character to differentiate them from numeric variable
    // names. However, there was no need to include them in the data objects for
    // this app.
    //
    // For example, to represent:
    //	 "MY NAME IS "+$N
    // we would use:
    //	 [ ["<str>", "MY NAME IS "], ["<var>", "N"] ].
    StringExpressionBuilder.prototype.buildStringExpression = function (stack) {
        var parts = [];
        var tk;
        for (var t = 1; t <= stack.length - 3; t = t + 3) {
            if (stack[t] === '<string_variable>') {
                tk = '<var>';
            }
            else {
                tk = '<str>';
            }
            parts.push([tk, stack[t + 1]]);
        }
        return parts;
    };
    return StringExpressionBuilder;
}());
exports.StringExpressionBuilder = StringExpressionBuilder;
var BooleanExpressionBuilder = (function () {
    function BooleanExpressionBuilder() {
    }
    return BooleanExpressionBuilder;
}());
exports.BooleanExpressionBuilder = BooleanExpressionBuilder;
var KeyHelper = (function () {
    function KeyHelper() {
        // Postpone monitor color code until later in the CS - TS conversion
        // this.monitorColor = 'green';
        this.code = [
            173, 61, 59, 189, 187, 186,
            48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
            96, 97, 98, 99, 100, 101, 102, 103, 104, 105,
            107, 109, 106, 111, 110,
            65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
            78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
            188, 190, 191, 192, 219, 221, 222
        ];
        this.keys = [
            ["-", "_"], ["=", "+"], [";", ":"], ["-", "_"], ["=", "+"], [";", ":"],
            ["0", ")"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("],
            ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
            ["+", "+"], ["-", "-"], ["*", "*"], ["/", "/"], [".", "."],
            ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"], ["G", "G"], ["H", "H"], ["I", "I"],
            ["J", "J"], ["K", "K"], ["L", "L"], ["M", "M"], ["N", "N"], ["O", "O"], ["P", "P"], ["Q", "Q"], ["R", "R"],
            ["S", "S"], ["T", "T"], ["U", "U"], ["V", "V"], ["W", "W"], ["X", "X"], ["Y", "Y"], ["Z", "Z"],
            [",", "<"], [".", ">"], ["/", "?"], ["`", "~"], ["[", "{"], ["]", "}"], ["'", '"']
        ];
        // TODO Why are '[' and ']' not implemented?
        this.chars = [
            "!", '"', "#", "$", "%", "&", "'",
            "(", ")", "*", "+", ",", "-", ".", "/", "0", "1",
            "2", "3", "4", "5", "6", "7", "8", "9", ":", ";",
            "<", "=", ">", "?", "@",
            "^", "_", "`", "A", "B", "C",
            "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
            "X", "Y", "Z", "{", "|", "}", "~"
        ];
        this.xy = [
            [99, 72], [33, 72], [33, 90], [77, 72], [88, 72], [44, 90], [22, 72],
            [66, 54], [77, 54], [33, 54], [11, 54], [55, 72], [22, 54], [44, 72], [44, 54], [0, 36], [11, 36],
            [22, 36], [33, 36], [44, 36], [55, 36], [66, 36], [77, 36], [88, 36], [99, 36], [0, 72], [11, 72],
            [88, 54], [0, 54], [99, 54], [66, 72], [22, 90],
            [55, 54], [55, 90], [0, 90], [0, 0], [11, 0], [22, 0],
            [33, 0], [44, 0], [55, 0], [66, 0], [77, 0], [88, 0], [99, 0], [110, 0], [121, 0], [132, 0],
            [0, 18], [11, 18], [22, 18], [33, 18], [44, 18], [55, 18], [66, 18], [77, 18], [88, 18], [99, 18],
            [110, 18], [121, 18], [132, 18], [66, 90], [99, 90], [77, 90], [11, 90]
        ];
        this.blankSpriteXY = [121, 54];
    }
    KeyHelper.prototype.char = function (n, shiftStatus) {
        var ch;
        if (this.code.indexOf(n) >= 0) {
            var i = this.code.indexOf(n);
            if (shiftStatus === '<shift>') {
                ch = this.keys[i][1];
            }
            else {
                ch = this.keys[i][0];
            }
        }
        else {
            if (n === 32) {
                ch = ' ';
            }
            else {
                ch = null;
            }
        }
        return ch;
    };
    KeyHelper.prototype.spriteXY = function (ch) {
        if (this.chars.indexOf(ch) >= 0) {
            var i = this.chars.indexOf(ch);
            var xx = this.xy[i][0];
            var yy = this.xy[i][1];
            // Postpone monitor color code until later in the CS - TS conversion
            // if (this.monitorColor === 'green') {xx = xx + 145;}
            return [xx, yy];
        }
        else {
            return this.blankSpriteXY; // (blank sprite)
        }
    };
    return KeyHelper;
}());
exports.KeyHelper = KeyHelper;
var VariableRegister = (function () {
    function VariableRegister() {
        this.vars = {};
    }
    VariableRegister.prototype.addVar = function (name) {
        this.vars[name] = null;
    };
    VariableRegister.prototype.defined = function (name) {
        if (this.vars.hasOwnProperty(name)) {
            return 'yes';
        }
        else {
            return 'no';
        }
    };
    VariableRegister.prototype.set = function (name, value) {
        if (this.defined(name) === 'no') {
            this.addVar(name);
        }
        this.vars[name] = value;
    };
    VariableRegister.prototype.get = function (name) {
        if (this.defined(name) === 'no') {
            this.addVar(name);
        }
        return this.vars[name];
    };
    return VariableRegister;
}());
var NumericVariableRegister = (function (_super) {
    __extends(NumericVariableRegister, _super);
    function NumericVariableRegister() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 	# Most, if not all, of the early versions of BASIC initialized any unset
    // 	# numeric variables to 0.
    NumericVariableRegister.prototype.addVar = function (name) {
        this.vars[name] = 0;
    };
    return NumericVariableRegister;
}(VariableRegister));
exports.NumericVariableRegister = NumericVariableRegister;
var StringVariableRegister = (function (_super) {
    __extends(StringVariableRegister, _super);
    function StringVariableRegister() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Most early versions of BASIC initialized unset string variables to an
    // empty string.
    StringVariableRegister.prototype.addVar = function (name) {
        this.vars[name] = "";
    };
    return StringVariableRegister;
}(VariableRegister));
exports.StringVariableRegister = StringVariableRegister;
var NumericExpressionEvaluator = (function () {
    function NumericExpressionEvaluator(register) {
        this.register = register;
    }
    NumericExpressionEvaluator.prototype.evaluate = function (expression) {
        var result = NaN;
        switch (expression.tag) {
            case '<numeric_literal>':
                result = this.evaluateNumericLiteral(expression);
                break;
            case '<numeric_variable>':
                result = this.evaluateNumericVariable(expression);
                break;
            case '<random>':
                result = this.evaluateRNDKeyword();
                break;
            case '<plus>':
            case '<minus>':
            case '<times>':
            case '<divide>':
            case '<power>':
                result = this.evaluateBinaryOperation(expression);
                break;
        }
        return result;
    };
    NumericExpressionEvaluator.prototype.evaluateNumericLiteral = function (expression) {
        return expression.value;
    };
    NumericExpressionEvaluator.prototype.evaluateNumericVariable = function (expression) {
        return this.register.get(expression.name);
    };
    NumericExpressionEvaluator.prototype.evaluateRNDKeyword = function () {
        return Math.random();
    };
    NumericExpressionEvaluator.prototype.evaluateBinaryOperation = function (expression) {
        var result = NaN;
        var a = this.evaluate(expression.op1);
        var b = this.evaluate(expression.op2);
        switch (expression.tag) {
            case '<plus>':
                result = a + b;
                break;
            case '<minus>':
                result = a - b;
                break;
            case '<times>':
                result = a * b;
                break;
            case '<divide>':
                result = a / b;
                break;
            case '<power>':
                result = Math.pow(a, b);
                break;
        }
        return result;
    };
    return NumericExpressionEvaluator;
}());
exports.NumericExpressionEvaluator = NumericExpressionEvaluator;
