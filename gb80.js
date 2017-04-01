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
var StringExpressionBuilder = (function () {
    function StringExpressionBuilder() {
    }
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
var KeyHelper = (function () {
    function KeyHelper() {
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
            return [xx, yy];
        }
        else {
            return this.blankSpriteXY;
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
        switch (expression.exp) {
            case '<num>':
                result = this.evaluateNumericLiteral(expression);
                break;
            case '<var>':
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
        switch (expression.exp) {
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
