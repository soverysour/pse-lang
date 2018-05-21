const utils = require("./utils.js");

function unarify(t, c)
{
  if ( t === undefined || t.type === '+' )
    return c;

  if ( t.type === '-' )
    return -c;
}

class Program
{
  currentInstr()
  {
    return this.executionStack[this.executionStack.length-1].subexpr[this.currentInstrStack[this.currentInstrStack.length-1]];
  }
  cContext()
  {
    return this.context[this.context.length - 1];
  }
  runFunc(func)
  {
    if ( this.stackLevel === 2500 )
      throw "Stack limit exceeded, stopping everything.";

    let newContext = {};
    let algoToRun = this.algorithms[func.name];
    for ( let i = 0; i < func.args.length; i++ )
      newContext[algoToRun.context.args[i].value] = this.eval(func.args[i]);

    this.context.push(newContext);
    this.executionStack.push(algoToRun);
    this.currentInstrStack.push(0);

    let currentStack = this.stackLevel++;
    while ( currentStack < this.stackLevel )
    {
      this.performStep();
    }

    this.context.pop();

    while ( this.executionStack[this.executionStack.length - 1].type !== 'algorithm' )
    {
      this.executionStack.pop();
      this.currentInstrStack.pop();
    }
    this.executionStack.pop();
    this.currentInstrStack.pop();
  }
  eval(t)
  {
    if ( t.head === 'unit' )
    {
      if ( t.mainOp.type === 'variable' )
        return unarify(t.mainOp.unary, this.cContext()[t.mainOp.value]);

      else if ( t.mainOp.type === 'func' )
      {
        this.runFunc(t.mainOp);
        return unarify(t.mainOp.unary, this.returnVals.pop());
      }

      return unarify(t.mainOp.unary, t.mainOp.value);
    }

    let left  = unarify(t.mainOp.unary, this.eval(t.mainOp));
    let right = t.secnOp !== undefined ? unarify(t.secnOp.unary, this.eval(t.secnOp)) : undefined;
    switch(t.head)
    {
      case '*':
        return left * right;
      case '/':
        if ( right === 0 )
          throw "Cannot use div operand on zero.";
        return (left / right) >> 0;
      case '%':
        if ( right === 0 )
          throw "Cannot use mod operand on zero.";
        return left % right;
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '<=':
        return left <= right;
      case '>=':
        return left >= right;
      case '!=':
        return left != right;
      case '<':
        return left < right;
      case '>':
        return left > right;
      case '=':
        return left == right;
      case 'not':
        return !left;
      case 'and':
        return left && right;
      case 'or':
        return left || right;
      case 'xor':
        return !left === right;
    }
  }
  jumpOrNext()
  {
    let ci = this.currentInstrStack[this.currentInstrStack.length - 1];
    let li = this.executionStack[this.executionStack.length - 1];

    if ( ci >= li.subexpr.length - 1)
    {
      if ( this.executionStack.length === 1 ) // Particular case, for when the main algorithm has reached its end.
      {
        this.stackLevel--;
        this.context.pop();
        this.executionStack.pop();
        this.currentInstrStack.pop();
      }
      else
      {
        switch(li.type)
        {
          case 'while':
            let ccnd = this.eval(li.context.expression);
            if ( ccnd )
              this.currentInstrStack[this.currentInstrStack.length - 1] = 0;
            else
            {
              this.currentInstrStack.pop();
              this.executionStack.pop();
              this.jumpOrNext();
            }
            break;
          case 'until':
            let cond = this.eval(li.context.expression);
            if ( !cond )
              this.currentInstrStack[this.currentInstrStack.length - 1] = 0;
            else
            {
              this.currentInstrStack.pop();
              this.executionStack.pop();
              this.jumpOrNext();
            }
            break;
          case 'for':
            let step = this.eval(li.context.step);
            let limit = this.eval(li.context.limit);

            this.cContext()[li.context.begin.target] = this.cContext()[li.context.begin.target] + step;
            let value = this.cContext()[li.context.begin.target];

            if ( step >= 0 )
            {
              if ( value <= limit )
                this.currentInstrStack[this.currentInstrStack.length - 1] = 0;
              else
              {
                this.executionStack.pop();
                this.currentInstrStack.pop();
                this.jumpOrNext();
              }
            }
            else
            {
              if ( value >= limit )
                this.currentInstrStack[this.currentInstrStack.length - 1] = 0;
              else
              {
                this.executionStack.pop();
                this.currentInstrStack.pop();
                this.jumpOrNext();
              }
            }
            break;
          case 'if':
          case 'elseif':
          case 'else':
            this.currentInstrStack.pop();
            this.executionStack.pop();
            this.jumpOrNext();
            break;
        }
      }

      return;
    }
    
    this.currentInstrStack[this.currentInstrStack.length - 1]++;
  }
  performStep()
  {
    let step = this.currentInstr();

    if ( step === undefined )
    {
      this.jumpOrNext();
      return;
    }
    switch(step.type)
    {
      case 'show':
        let buff = [];
        for ( let i = 0; i < step.context.expression.length; i++ )
        {
          if ( step.context.expression[i].type === 'string' )
            buff.push(step.context.expression[i].value);
          else
            buff.push(this.eval(step.context.expression[i]));
        }
        this.jumpOrNext();
        return buff.join('');
        break;
      case 'read':
        for ( let i = 0; i < step.context.args.length; i++ )
        {
          if ( this.input.length === 0 )
            throw "Not enough input data was given! Attempting to read beyond what was given.";

          this.cContext()[step.context.args[i]] = this.input[0];
          this.input.shift(1);
        }
        this.jumpOrNext();
        break;
      case 'var':
        this.cContext()[step.context.target] = this.eval(step.context.expression);
        this.jumpOrNext();
        break;
      case 'return':
        this.returnVals.push(this.eval(step.context.expression));
        this.stackLevel--;
        break;
      case 'elseif':
      case 'else':
        this.jumpOrNext();
        break;
      case 'if':
        let cond = this.eval(step.context.expression);

        if ( cond )
        {
          this.executionStack.push(step);
          this.currentInstrStack.push(0);
        }
        else
        {
          let last = step.subexpr[step.subexpr.length - 1];
          while ( last.type ==='elseif' && !this.eval(last.context.expression) )
          {
            last = last.subexpr[last.subexpr.length - 1];
          }

          if ( last.type === 'elseif' || last.type === 'else' )
          {
            this.executionStack.push(last);
            this.currentInstrStack.push(0);
          }
          else
            this.jumpOrNext();
        }
        break;
      case 'while':
        if ( this.eval(step.context.expression) )
        {
          this.executionStack.push(step);
          this.currentInstrStack.push(0);
        }
        else
          this.jumpOrNext();
        break;
      case 'for':
        let initial = this.eval(step.context.begin.expr);
        let limit = this.eval(step.context.limit);
        let incr = this.eval(step.context.step);
        this.cContext()[step.context.begin.target] = initial;

        if ( incr >= 0 ){
          if ( initial <= limit )
          {
            this.executionStack.push(step);
            this.currentInstrStack.push(0);
          }
          else
            this.jumpOrNext();
        }
        else
        {
          if ( initial >= limit )
          {
            this.executionStack.push(step);
            this.currentInstrStack.push(0);
          }
          else
            this.jumpOrNext();
        }
        break;
      case 'until':
        this.executionStack.push(step);
        this.currentInstrStack.push(0);
        break;
    }
  }
  constructor(parsedState, input)
  {
    this.input = input.split(' ').filter( x => x !== '' );
    this.algorithms = {};
    this.context = [{}];
    this.returnVals = [];
    this.stackLevel = 1;

    for ( let i = 0; i < parsedState.length; i++ )
      if ( parsedState[i].context.type !== 'program' )
        this.algorithms[parsedState[i].context.target] = parsedState[i];
      else
        this.main = parsedState[i];
        
    for ( let i = 0; i < this.input.length; i++ )
      if ( this.input[i].match(/^[+-]?[0-9]+$/))
        this.input[i] = parseInt(this.input[i]);
      else
        throw "Part of given input is improper, not actually a number: "+this.input[i]+".";

    this.executionStack = [this.main];
    this.currentInstrStack = [0];
  }

  step()
  {
    if ( this.stackLevel === 0 )
      throw "Cannot execute step in a finished program.";

    if ( this.error )
      throw "Cannot execute step in a program that encountered an exception.";

    try
    {
      let res = this.performStep();
      if ( res )
        return {err:false, msg: res};
    }
    catch(err)
    {
      this.error = true;
      return {err:true, msg: err};
    }
  }
  currentLine()
  {
    if ( this.stackLevel === 0 )
      throw "The current program has finished executing.";

    return this.currentInstr().id; 
  }
  isDone(){ return this.stackLevel === 0 || this.error ? true : false; }
  getState(){ return this.context[0]; }
  generateCpp(){ return 'TODO'; }
}

module.exports = Program;
