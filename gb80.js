////  Parser type definitions  ////
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
var LineParser = (function () {
    function LineParser(lineParserFunctions) {
        this.lineParsers = lineParserFunctions.lineParsers;
    }
    LineParser.prototype.parse = function (string) {
        var result = [];
        this.lineParsers.forEach(function (parser) {
            if (result.length === 0) {
                result = parser(string);
            }
        });
        return result;
    };
    return LineParser;
}());
exports.LineParser = LineParser;
var LineParserFunctions = (function () {
    function LineParserFunctions(parserHelpers) {
        var _this = this;
        this.parseBareLineNumber = function (string) {
            // This function parses a valid line number with nothing following it. In
            // BASIC, entering a line number with nothing following it deletes that
            // line from the program.
            _this.helpers.set(string).parseLineNumber();
            if ((_this.helpers.match === 'yes') && (_this.helpers.remainder.length === 0)) {
                return _this.helpers.stack;
            }
            else {
                return [];
            }
        };
        this.parseBareRemStatement = function (string) {
            console.log(' ');
            console.log("parseBareRemStatement() string = " + string);
            _this.helpers.set(string).parseLineNumber().parseKeyword('REM');
            console.log("   match = " + _this.helpers.match);
            console.log("   stack = " + _this.helpers.stack);
            console.log("   remainder = " + _this.helpers.remainder);
            if ((_this.helpers.match === 'yes') && (_this.helpers.remainder.length === 0)) {
                return _this.helpers.stack;
            }
            else {
                return [];
            }
        };
        // FOR NOW, THIS ONE IS DIFFERENT THAN THE OTHER PARSERS, AND DOES NOT USE
        // THE CHAINABLE HELPER FUNCTIONS.
        this.parseConsoleKeyword = function (string) {
            // This function parses single keyword commands (RUN, LIST, etc).
            var result = [];
            var consoleKeywords = [
                { keyword: 'CLEAR', token: '<clear>' },
                { keyword: 'RUN', token: '<run>' },
                { keyword: 'LIST', token: '<list>' },
                { keyword: 'INFO', token: '<info>' }
            ];
            consoleKeywords.forEach(function (pair) {
                if ((result.length === 0) && (string === pair.keyword)) {
                    result = [
                        '<console_command>',
                        pair.token
                    ];
                }
            });
            return result;
        };
        this.helpers = parserHelpers.helpers;
        this.lineParsers = [
            this.parseConsoleKeyword,
            this.parseBareLineNumber,
            this.parseBareRemStatement
        ];
    }
    return LineParserFunctions;
}());
exports.LineParserFunctions = LineParserFunctions;
var LineParserHelpers = (function () {
    function LineParserHelpers() {
        this.helpers = {
            match: 'no',
            stack: [],
            remainder: '',
            set: function (string) {
                this.match = 'no';
                this.stack = [];
                this.remainder = string;
                return this;
            },
            parseLineNumber: function () {
                if (this.match != 'error') {
                    var n = parseInt(this.remainder);
                    if (n) {
                        this.match = 'yes';
                        this.stack = this.stack.concat(['<line_number>', n]);
                        this.remainder = this.remainder.slice(String(n).length);
                    }
                    else {
                        this.match = 'error';
                    }
                }
                return this;
            },
            parseKeyword: function (keyword) {
                if (this.match != 'error') {
                    if (this.remainder.indexOf(keyword) === 0) {
                        this.match = 'yes';
                        this.stack = this.stack.push('<' + keyword.toLowerCase() + '>');
                        this.remainder = this.remainder.slice(keyword.length);
                    }
                    else {
                        this.match = 'error';
                    }
                }
                return this;
            },
        };
    }
    return LineParserHelpers;
}());
exports.LineParserHelpers = LineParserHelpers;
var NumericExpressionParser = (function () {
    function NumericExpressionParser() {
        this.delimiters = ['(', ')', '+', '-', '*', '/', '^'];
        this.symbols = [
            '<left>',
            '<right>',
            '<plus>',
            '<minus>',
            '<times>',
            '<divide>',
            '<power>'
        ];
    }
    NumericExpressionParser.prototype.parseNumericExpression = function (string) {
        var _this = this;
        var result = [];
        if (string.search(/[^A-Z0-9\.+\-*/\^()]/) < 0) {
            result = ['<numeric_expression>'];
            var tokens = this.tokenize(string);
            tokens.forEach(function (tkn) {
                var tk = tkn;
                if (_this.symbols.indexOf(tk) >= 0) {
                    result.push(tk);
                }
                else {
                    var numericValueParseStack = _this.parseNumericValue(tk);
                    if (numericValueParseStack.length > 0) {
                        result = result.concat(numericValueParseStack);
                    }
                    else {
                        result = [];
                    }
                }
            });
            if (result.length > 0) {
                result.push('<num_exp_end>');
            }
        }
        return result;
    };
    NumericExpressionParser.prototype.tokenize = function (string) {
        var result = [];
        var buffer = '';
        for (var i = 0; i < string.length; i++) {
            var ch = string[i];
            var index = this.delimiters.indexOf(ch);
            if (index >= 0) {
                if (buffer != '') {
                    result.push(buffer);
                    buffer = '';
                }
                result.push(this.symbols[index]);
            }
            else {
                buffer = buffer + ch;
            }
        }
        if (buffer != '') {
            result.push(buffer);
        }
        return result;
    };
    NumericExpressionParser.prototype.parseNumericValue = function (string) {
        var result = [];
        if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(string[0]) >= 0) {
            if ((string.length === 1) || ((string.length === 2) && ('0123456789'.indexOf(string[1]) >= 0))) {
                result = [
                    '<numeric_variable>',
                    string
                ];
            }
        }
        else {
            var nonNumerics = 'none';
            for (var i = 0; i < string.length; i++) {
                var ch = string[i];
                if ('0123456789'.indexOf(ch) < 0) {
                    if ((ch === '.') && (nonNumerics === 'none')) {
                        nonNumerics = 'decimal_point';
                    }
                    else {
                        nonNumerics = 'bad';
                    }
                }
            }
            if (nonNumerics != 'bad') {
                result = [
                    '<numeric_literal>',
                    Number(string)
                ];
            }
        }
        return result;
    };
    return NumericExpressionParser;
}());
exports.NumericExpressionParser = NumericExpressionParser;
var StringExpressionParser = (function () {
    function StringExpressionParser() {
    }
    StringExpressionParser.prototype.parseStringExpression = function (string) {
        var _this = this;
        var resultTokens;
        var result = [];
        var tokens = this.tokenize(string);
        tokens.forEach(function (tk) {
            if (tk === '<plus>') {
                result.push('<plus>');
            }
            else {
                resultTokens = _this.parseStringVariableName(tk);
                if (resultTokens.length === 0) {
                    resultTokens = _this.parseStringLiteral(tk);
                }
                if (resultTokens.length > 0) {
                    result = result.concat(resultTokens);
                }
            }
        });
        if (result.length > 0) {
            result.unshift('<string_expression>');
            result.push('<str_exp_end>');
        }
        return result;
    };
    StringExpressionParser.prototype.tokenize = function (string) {
        var result = [];
        var buffer = '';
        for (var i = 0; i < string.length; i++) {
            if (string[i] === '+') {
                if (buffer.length > 0) {
                    result.push(buffer);
                    buffer = '';
                }
                result.push('<plus>');
            }
            else {
                buffer = buffer + string[i];
            }
        }
        if (buffer.length > 0) {
            result.push(buffer);
        }
        return result;
    };
    StringExpressionParser.prototype.parseStringVariableName = function (string) {
        var result = [];
        if (string[0] === '$') {
            if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(string[1]) >= 0) {
                if ((string.length === 2) || ((string.length === 3) && ('0123456789'.indexOf(string[2]) >= 0))) {
                    result = [
                        '<string_variable>',
                        string.substr(1, 2)
                    ];
                }
            }
        }
        return result;
    };
    StringExpressionParser.prototype.parseStringLiteral = function (string) {
        var result = [];
        if ((string.indexOf('"') === 0) || (string.lastIndexOf('"') === string.length - 1)) {
            var newString = string.slice(1, string.length - 1);
            if (newString.indexOf('"') < 0) {
                result = [
                    '<string_literal>',
                    newString
                ];
            }
        }
        return result;
    };
    return StringExpressionParser;
}());
exports.StringExpressionParser = StringExpressionParser;
var NumericExpressionBuilder = (function () {
    function NumericExpressionBuilder() {
    }
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
    // buildNumericRandomFunctionExpression(stack: NumericParseStackSplit): NumericExpressionObject {}
    // buildNumericIntegerFunctionExpression(stack: NumericParseStackSplit): NumericExpressionObject {}
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
        stack.forEach(function (tag) {
            if (tag === '<left>') {
                mainStacks.push([]);
            }
            if (tag === '<right>') {
                middleStack = mainStacks.pop();
                mainStacks[mainStacks.length - 1].push(middleStack);
                mainStacks[mainStacks.length - 1] = mainStacks[mainStacks.length - 1].concat(tailStack);
                tailStack = [];
            }
            if ((tag != '<left>') && (tag != '<right>')) {
                mainStacks[mainStacks.length - 1].push(tag);
            }
        });
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
    StringExpressionBuilder.prototype.buildStringExpression = function (stack) {
        var expressionArray = [];
        var expression;
        for (var t = 1; t <= stack.length - 3; t = t + 3) {
            if (stack[t] === '<string_variable>') {
                var name_1 = stack[t + 1];
                expression = {
                    tag: '<string_variable>',
                    name: name_1
                };
            }
            else {
                var value = stack[t + 1];
                expression = {
                    tag: '<string_literal>',
                    value: value
                };
            }
            expressionArray.push(expression);
        }
        return expressionArray;
    };
    return StringExpressionBuilder;
}());
exports.StringExpressionBuilder = StringExpressionBuilder;
var BooleanExpressionBuilder = (function () {
    function BooleanExpressionBuilder(numericBuilder, stringBuilder) {
        this.numericBuilder = numericBuilder;
        this.stringBuilder = stringBuilder;
    }
    BooleanExpressionBuilder.prototype.buildBooleanExpression = function (stack) {
        var comparator = stack[3];
        var bxVar = stack[2];
        var subStack = stack.slice(4, stack.length - 1);
        var expression;
        if (stack[1] === '<numeric_variable>') {
            expression = this.numericBuilder.buildNumericExpression(subStack);
        }
        if (stack[1] === '<string_variable>') {
            expression = this.stringBuilder.buildStringExpression(subStack);
        }
        var result = {
            comparator: comparator,
            variable: bxVar,
            expression: expression
        };
        return result;
    };
    return BooleanExpressionBuilder;
}());
exports.BooleanExpressionBuilder = BooleanExpressionBuilder;
var VariableRegister = (function () {
    function VariableRegister() {
        this.vars = {};
    }
    VariableRegister.prototype.addVar = function (name) {
        this.vars[name] = null;
    };
    VariableRegister.prototype.defined = function (name) {
        if (this.vars.hasOwnProperty(name)) {
            return true;
        }
        else {
            return false;
        }
    };
    VariableRegister.prototype.set = function (name, value) {
        if (!this.defined(name)) {
            this.addVar(name);
        }
        this.vars[name] = value;
    };
    VariableRegister.prototype.get = function (name) {
        if (!this.defined(name)) {
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
        this.vars[name] = '';
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
var StringExpressionEvaluator = (function () {
    function StringExpressionEvaluator(register) {
        this.register = register;
    }
    StringExpressionEvaluator.prototype.evaluate = function (expression) {
        var _this = this;
        var result = '';
        var nextString;
        expression.forEach(function (next) {
            if (next.tag === '<string_literal>') {
                nextString = next.value;
                result = result.concat(nextString);
            }
            if (next.tag === '<string_variable>') {
                nextString = _this.register.get(next.name);
                result = result.concat(nextString);
            }
        });
        return result;
    };
    return StringExpressionEvaluator;
}());
exports.StringExpressionEvaluator = StringExpressionEvaluator;
var BooleanExpressionEvaluator = (function () {
    function BooleanExpressionEvaluator(numericRegister, stringRegister, numericEvaluator, stringEvaluator) {
        this.numericRegister = numericRegister;
        this.stringRegister = stringRegister;
        this.numericEvaluator = numericEvaluator;
        this.stringEvaluator = stringEvaluator;
    }
    BooleanExpressionEvaluator.prototype.evaluate = function (expression) {
        var result = false;
        var compareResult;
        var comparator = expression.comparator;
        if ((comparator === '<string_equals>') || (comparator === '<string_not_equal>')) {
            var varValue = this.stringRegister.get(expression.variable);
            var expValue = this.stringEvaluator.evaluate(expression.expression);
            compareResult = this.stringCompare(varValue, expValue);
        }
        else {
            var varValue = this.numericRegister.get(expression.variable);
            var expValue = this.numericEvaluator.evaluate(expression.expression);
            compareResult = this.numericCompare(varValue, expValue);
        }
        switch (comparator) {
            case '<number_equals>':
            case '<string_equals>':
                if (compareResult === '<equal>')
                    result = true;
                break;
            case '<number_not_equal>':
            case '<string_not_equal>':
                if (compareResult != '<equal>')
                    result = true;
                break;
            case '<number_lesser_than>':
                if (compareResult === '<lesser>')
                    result = true;
                break;
            case '<number_lesser_equal>':
                if ((compareResult === '<lesser>') || (compareResult === '<equal>'))
                    result = true;
                break;
            case '<number_greater_than>':
                if (compareResult === '<greater>')
                    result = true;
                break;
            case '<number_greater_equal>':
                if ((compareResult === '<greater>') || (compareResult === '<equal>'))
                    result = true;
                break;
        }
        return result;
    };
    BooleanExpressionEvaluator.prototype.numericCompare = function (x, y) {
        var tag;
        if (x === y)
            tag = '<equal>';
        if (x < y)
            tag = '<lesser>';
        if (x > y)
            tag = '<greater>';
        return tag;
    };
    BooleanExpressionEvaluator.prototype.stringCompare = function (a, b) {
        var tag;
        if (a === b)
            tag = '<equal>';
        else
            tag = '<not_equal>';
        return tag;
    };
    return BooleanExpressionEvaluator;
}());
exports.BooleanExpressionEvaluator = BooleanExpressionEvaluator;
var KeyHelper = (function () {
    function KeyHelper() {
        // Postpone monitor color code until later in the CS - TS conversion.
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
            ['-', '_'], ['=', '+'], [';', ':'], ['-', '_'], ['=', '+'], [';', ':'],
            ['0', ')'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('],
            ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'],
            ['+', '+'], ['-', '-'], ['*', '*'], ['/', '/'], ['.', '.'],
            ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'], ['E', 'E'], ['F', 'F'], ['G', 'G'], ['H', 'H'], ['I', 'I'],
            ['J', 'J'], ['K', 'K'], ['L', 'L'], ['M', 'M'], ['N', 'N'], ['O', 'O'], ['P', 'P'], ['Q', 'Q'], ['R', 'R'],
            ['S', 'S'], ['T', 'T'], ['U', 'U'], ['V', 'V'], ['W', 'W'], ['X', 'X'], ['Y', 'Y'], ['Z', 'Z'],
            [',', '<'], ['.', '>'], ['/', '?'], ['`', '~'], ['[', '{'], [']', '}'], ["'", '"']
        ];
        // TODO Why are '[' and ']' not implemented?
        this.chars = [
            '!', '"', '#', '$', '%', '&', "'",
            '(', ')', '*', '+', ',', '-', '.', '/', '0', '1',
            '2', '3', '4', '5', '6', '7', '8', '9', ':', ';',
            '<', '=', '>', '?', '@',
            '^', '_', '`', 'A', 'B', 'C',
            'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
            'X', 'Y', 'Z', '{', '|', '}', '~'
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
            // if ( this.monitorColor === 'green' ) {xx = xx + 145;}
            return [xx, yy];
        }
        else {
            return this.blankSpriteXY; // (blank sprite)
        }
    };
    return KeyHelper;
}());
exports.KeyHelper = KeyHelper;
