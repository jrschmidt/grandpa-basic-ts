class Main {
  parsers;
  constructor (parsers) {
    this.parsers = parsers;
  }

  run () {
    let z1 = this.parsers.fn1('Z1');
    console.log(`z1 = ${z1}`);
    console.log(' ');
    let z2 = this.parsers.fn2('Z2');
    console.log(`z2 = ${z2}`);
    console.log(' ');
    let z3 = this.parsers.fn3('Z3');
    console.log(`z3 = ${z3}`);
  }

}


class Parser {
  parsers;

  constructor () {

    this.parsers = {
      st: [],


      set : function (s) {
        this.st = [s];
        return this;
      },


      ha: function (s) {
        this.st = this.st.concat(
          [
            '<ha>',
            '<start_ha>',
            s,
            '<end_ha>'
          ]
        );
        return this;
      },


      hb: function (s) {
        this.st = this.st.concat([
          '<hb>',
          '<HB>',
          '<startHB>',
          '<<< '+ s +' >>>',
          '<endHB>'
        ]);
        return this;
      }


    };

}


  fn1 = (str) => {
    this.parsers.set(str);
    return this.parsers.st;
  };

  fn2 = (str) => {
    this.parsers.set('<eq>').ha('<birds>');
    return this.parsers.st;
  };

  fn3 = (str) => {
    this.parsers.set('<sum>').hb('SEVENTEEN').ha('<ice_cream>');
    return this.parsers.st;
  };

}



const parser = new Parser;
const main = new Main(parser);

main.run();
