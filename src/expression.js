const utils = require("./utils.js");

class Expression {
  constructor(line, id)
  {
    this.id = id;
    if ( line.length === 0 )
    {
      this.valid = false;
      this.err = false;
      return;
    }

    try {
      let first = line[0];
      if ( first.type === 'keyword' )
      {
        if ( first.value === 'algorithm' )
          this.parseAlg(line);
        else if ( first.value === 'while' )
          this.parseWhile(line);
        else if ( first.value === 'if' )
          this.parseIf(line);
        else if ( first.value === 'else' )
          this.parseElse(line);
        else if ( first.value === 'for' )
          this.parseFor(line);
        else if ( first.value === 'do' )
          this.parseDo(line);
        else if ( first.value === 'done' )
          this.parseDone(line);
        else if ( first.value === 'read' )
          this.parseRead(line);
        else if ( first.value === 'show' )
          this.parseShow(line);
        else if ( first.value === 'return' )
          this.parseReturn(line);
        else if ( first.value === 'until' )
          this.parseUntil(line);
      }
      else if ( first.type === 'variable' )
        this.parseVar(line);
      else
      {
        this.error(line);
      }
    }
    catch(err) {
      this.error(err, line);
    }
  }
  // Computational.
  parseWhile(line)
  {
    if ( line.length < 3 )
      throw "Improper while loop.";

    this.context = {expression:line.slice(1, line.length - 1)};
    this.type = 'while';
  }
  // Computational.
  parseUntil(line)
  {
    if ( line.length < 2 )
      throw "Improper until loop.";

    this.context = {expression:line.slice(1, line.length)};
    this.type = 'until';
  }
  // Computational.
  parseIf(line)
  {
    if ( line.length < 3 || line[line.length-1].value !== 'do' )
      throw "Improper if statement.";

    this.context = {expression:line.slice(1, line.length - 1)};
    this.type = 'if';
  }
  // Computational.
  parseElse(line)
  {
    if ( line.length !== 1 )
    {
      if ( line.length < 4 || line[1].value !== 'if' || line[line.length - 1].value !== 'do')
        throw "Improper else / else-if statement.";

      this.context = {expression:line.slice(2, line.length - 1)};
      this.type = 'elseif';
    }
    else
    {
      this.context = {};
      this.type = 'else';
    }
  }
  // Computational.
  parseFor(line)
  {
    if ( line.length <  7 || line[1].type !== 'variable' || line[2].type !== '<-' )
      throw "Improper for loop.";

    this.context = {expression:line.slice(1, line.length - 1)};
    this.type = 'for';
  }
  // Computational.
  parseVar(line)
  {
    if ( line.length < 3 || line[1].type !== '<-' || line[0].type !== 'variable' )
      throw "Improper assignment.";

    this.context = {expression:line.slice(2, line.length)};
    this.context.target = line[0].value;
    this.type = 'var';
  }
  // Computational.
  parseReturn(line)
  {
    if ( line.length < 2 )
      throw "Improper return statement.";

    this.context = {expression:line.slice(1, line.length)};
    this.type = 'return';
  }
  // Computational.
  parseShow(line)
  {
    let len = line.length;
    if ( len < 2 )
      throw "Improper show statement.";

    this.context = {expression:line.slice(1, line.length)};
    this.type = 'show';
  }
  // Declarative.
  parseDo(line)
  {
    if ( line.length !== 1 )
      throw "Improper do statement.";

    this.context = {};
    this.type = 'do';
  }
  // Declarative.
  parseDone(line)
  {
    if ( line.length !== 1 )
      throw "Improper done statement.";

    this.context = {};
    this.type = 'done';
  }
  // Is done.
  // Declarative.
  parseRead(line)
  {
    let len = line.length;
    if ( len < 2 )
      throw "Improper read statement.";

    var args = [];
    for ( var i = 1; i < len; i += 2 )
    {
      if ( i !== len - 1 && line[i+1].type !== ',' )
          throw 0;

      let name = line[i];
      args.push(name.value);
    }

    this.context = {};
    this.context.args = args;
    this.type = 'read';
  }
  // Is done.
  // Declarative.
  parseAlg(line)
  {
    let name = line[1];
    let parO = line[2];
    let parC = line[line.length - 4];
    let algAs = line[line.length - 3];
    let algType = line[line.length - 2];
    let colm = line[line.length - 1];

    if ( name.type !== 'variable' || parO.type !== '(' || parC.type !== ')' || colm.type !== ':' || !utils.isAlgType(algType.value) || algAs.value !== 'as' )
      throw "Improper algorithm definition.";

    let args = [];
    for ( var i = 3; i < line.length - 4; i += 4 )
    {
      let v = line[i];
      let as = line[i+1];
      let type = line[i+2];
      let c = line[i+3];

      if ( i !== line.length - 7 && c.type !== ',' )
          throw "Comma separated arguments are required";

      if ( v.type !== 'variable' || as.value !== "as" || !utils.isUsableType(type.value) )
        throw "Bad argument type definition.";

      args.push({value: v.value, type:type.value});
    }

    this.context = {};
    this.context.target = name.value;
    this.context.args = args;
    this.context.type = algType.value;
    this.type = 'algorithm';
  }
  // Error signaling function.
  error(err, line)
  {
    this.err = err;
    this.valid = false;
  }
}

module.exports = Expression;
