console.log('Starting test.js');
console.log('Test of call() method');
console.log(' ');
console.log('A number of functions are put into an array.');
console.log('A forEach() method iterates through the array of functions.');
console.log('For each function in the array, call() is invoked with the function name.');
console.log('(note - I think theres a better way to supply the parameter to the function');
console.log('   when its called, but I didnt have the proper reference materials available - JRS)');
let result: number;

let fn1 = (p: number): number => {
  console.log(' ');
  console.log('** Function fn1 **');
  console.log(`parameter = ${p}`);
  this.result = p;
  console.log(`fn1 sets this.result = ${this.result}`);
  return this.result;
};

let fn2 = (p: number): number => {
  console.log(' ');
  console.log('** Function fn2 **');
  console.log(`parameter = ${p}`);
  this.result = p * 2;
  console.log(`fn2 sets this.result = ${this.result}`);
  return this.result;
};

let fn3 = (p: number): number => {
  console.log(' ');
  console.log('** Function fn3 **');
  console.log(`parameter = ${p}`);
  this.result = p * 3;
  console.log(`fn3 sets this.result = ${this.result}`);
  return this.result;
};

let fn4 = (p: number): number => {
  console.log(' ');
  console.log('** Function fn4 **');
  console.log(`parameter = ${p}`);
  this.result = p * 4;
  console.log(`fn4 sets this.result = ${this.result}`);
  return this.result;
};

let fn5 = (p: number): number => {
  console.log(' ');
  console.log('** Function fn5 **');
  console.log(`parameter = ${p}`);
  this.result = p * 5;
  console.log(`fn5 sets this.result = ${this.result}`);
  return this.result;
};

let coll: Function[];
coll = [fn1, fn2, fn3, fn4, fn5];

coll.forEach( fn => {
  console.log(' ');
  console.log('starting a forEach() loop iteration ...');
  Function.call(fn(101));
  console.log(`after calling function, value of this.result = ${this.result}`);
});
