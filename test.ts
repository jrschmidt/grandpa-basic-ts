export class Main {
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


export class Parsers {
  helpers;

  constructor (parserHelpers) {
    this.helpers = parserHelpers.helpers;
  }


  fn1 = (str) => {
    this.helpers
    .set(str);

    return this.helpers.st;
  };


  fn2 = (str) => {
    this.helpers
    .set('<eq>')
    .ha('<birds>');

    return this.helpers.st;
  };


  fn3 = (str) => {
    this.helpers
    .set('<sum>')
    .hb('caves')
    .ha('<ice_cream>');
    return this.helpers.st;
  };


}



export class ParserHelpers {
  helpers;

  constructor () {

    this.helpers = {
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

}



const helpers = new ParserHelpers;
const parsers = new Parsers(helpers);
const main = new Main(parsers);

main.run();
