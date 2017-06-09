

parse = (string: string): ParseStack => {

  this.helpers.set(string).parseLineNumber().parseChar('space').;

  if ( ( this.helpers.match === 'yes' ) && ( this.helpers.remainder.length === 0 ) ) {
    return this.helpers.stack;
  }

  else {
    return [];
  }

};
