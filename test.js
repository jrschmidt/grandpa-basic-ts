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
var Parser = (function () {
    function Parser() {
        var _this = this;
        this.fn1 = function (str) {
            _this.parsers.set(str);
            return _this.parsers.st;
        };
        this.fn2 = function (str) {
            _this.parsers.set('<eq>').ha('<birds>');
            return _this.parsers.st;
        };
        this.fn3 = function (str) {
            _this.parsers.set('<sum>').hb('SEVENTEEN').ha('<ice_cream>');
            return _this.parsers.st;
        };
        this.parsers = {
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
    return Parser;
}());
var parser = new Parser;
var main = new Main(parser);
main.run();
