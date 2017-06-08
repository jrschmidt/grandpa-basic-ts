

parse = (string: string): ParseStack => {

  this.helpers.set(string).;

  if ( ( this.helpers.match === 'yes' ) && ( this.helpers.remainder.length === 0 ) ) {
    return this.helpers.stack;
  }

  else {
    return [];
  }

};
