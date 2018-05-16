const Tokenizer  = require("./tokenizer.js");
const Expression = require("./expression.js");
const Program    = require("./program.js");
const utils      = require("./utils.js");
const parser     = require("./parser.js");

// The only class that should be visible from the outside.
class Pse {
  // Creates everything, from a given string.
  constructor(str, data)
  {
    this.errors = [];
    let lines = str.split('\n');

    let tokenizer = new Tokenizer(lines);
    for ( var i = 0; i < tokenizer.errors.length; i++ )
    {
      this.errors.push(tokenizer.errors[i]);
      if ( i === tokenizer.errors.length - 1 )
        return;
    }

    let expressions = [];
    for ( var i = 0; i < tokenizer.lines.length; i++ )
      expressions.push(new Expression(tokenizer.lines[i], i+1));

    let leave = false;
    for ( var i = 0; i < expressions.length; i++ )
    {
      if ( expressions[i].valid === false && expressions[i].err === false )
        expressions.splice(i--, 1);

      if ( expressions[i].err )
      {
        this.errors.push(expressions[i].err);
        leave = true;
      }
    }

    if ( leave )
      return;

    try
    {
      let parsedState = parser(expressions);
      this.program = new Program(parsedState, data);
    }
    catch(e)
    {
      this.errors.push(e);
    }
  }

  // Attempts to return the next line id to be executed
  line() { return this.program.currentLine(); }
  // Attempts to perform a step.
  step(){ return this.program.step(); }
  // Attempts to do all the remaining steps in the execution.
  complete(){ while ( !this.program.isDone() ) this.program.step(); }
  // Attempts to get the internal state of all variables.
  getState(){ return this.program.getState(); }
  // Attempts to get all the encountered errors.
  getErrors(){ return this.errors.length > 0 ? this.errors : false; }
  // Attempts to generate an equivallent cpp program.
  getCpp(){ return this.program.generateCpp(); }
}

module.exports = Pse;
