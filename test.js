"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Main = (function () {
    function Main(parsers) {
        this.parsers = parsers;
    }
    Main.prototype.run = function () {
        var z1 = this.parsers.fn1('Z1');
        console.log("z1 = " + z1);
        console.log(' ');
        var z2 = this.parsers.fn2('Z2');
        console.log("z2 = " + z2);
        console.log(' ');
        var z3 = this.parsers.fn3('Z3');
        console.log("z3 = " + z3);
    };
    return Main;
}());
exports.Main = Main;
var Parsers = (function () {
    function Parsers(parserHelpers) {
        var _this = this;
        this.fn1 = function (str) {
            _this.helpers
                .set(str);
            return _this.helpers.st;
        };
        this.fn2 = function (str) {
            _this.helpers
                .set('<eq>')
                .ha('<birds>');
            return _this.helpers.st;
        };
        this.fn3 = function (str) {
            _this.helpers
                .set('<sum>')
                .hb('caves')
                .ha('<ice_cream>');
            return _this.helpers.st;
        };
        this.helpers = parserHelpers.helpers;
    }
    return Parsers;
}());
exports.Parsers = Parsers;
var ParserHelpers = (function () {
    function ParserHelpers() {
        this.helpers = {
            st: [],
            set: function (s) {
                this.st = [s];
                return this;
            },
            ha: function (s) {
                this.st = this.st.concat([
                    '<ha>',
                    '<start_ha>',
                    s,
                    '<end_ha>'
                ]);
                return this;
            },
            hb: function (s) {
                this.st = this.st.concat([
                    '<hb>',
                    '<HB>',
                    '<startHB>',
                    '<<< ' + s + ' >>>',
                    '<endHB>'
                ]);
                return this;
            }
        };
    }
    return ParserHelpers;
}());
exports.ParserHelpers = ParserHelpers;
var helpers = new ParserHelpers;
var parsers = new Parsers(helpers);
var main = new Main(parsers);
main.run();
