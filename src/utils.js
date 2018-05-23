let algTypes = ["integer", "boolean", "program"];
let usableTypes = ["integer", "boolean"];
let displayTypes = ["integer", "boolean", "string"];
let scopeCreate = ["do", "for", "while", "if"];
let scopeDelete = ["done", "until"];
let funcSing = ["var", "while", "if", "elseif", "return", "until"];
let operandMarks = ["integer", "variable", "boolean", "func"];
let literals = ["integer", "boolean"];
let intIntArr = ["*", "+", "-", "/", "%"];
let intBoolArr = ["<", ">", "=", "!=", "<=", ">="];
let boolBoolArr = ["and", "or", "xor"];
let opensSubExpr = ["do", "for", "while", "if"];
let permutesSubExpr = ["elseif", "else"];
let closesSubExpr = ["done", "until"];

function pSubExpr(x)
{
  return permutesSubExpr.indexOf(x.type) !== -1
}
function oSubExpr(x)
{
  return opensSubExpr.indexOf(x.type) !== -1;
}
function dSubExpr(x)
{
  return closesSubExpr.indexOf(x.type) !== -1;
}

function isLiteral(x)
{
  return literals.indexOf(x) !== -1;
}

function operand(o)
{
  return operandMarks.indexOf(o.type) !== -1;
}

function unary(o)
{
  return o.type === '-' || o.type === '+';
}

function operator(x)
{
  if ( x.value === undefined )
    return x.type;

  return x.value;
}

function precedence(o)
{
  switch(operator(o))
  {
    case '*':
    case '/':
    case '%':
      return 9;
    case '+':
    case '-':
      return 8;
    case '<=':
    case '>=':
    case '!=':
    case '<':
    case '>':
    case '=':
      return 7;
    case 'not':
      return 6;
    case 'and':
    case 'or':
    case 'xor':
      return 5;
  }
}

function defined(t){ return t.mainOp !== undefined && t.secnOp !== undefined; }
function intInt(t){ return intIntArr.indexOf(t) !== -1; }
function intBool(t){ return intBoolArr.indexOf(t) !== -1; }
function boolBool(t){ return boolBoolArr.indexOf(t) !== -1; }
function isIntInt(t){ return defined(t) && t.mainOp.sign === 'integer' && t.secnOp.sign === 'integer'; }
function isBoolBool(t){ return defined(t) && t.mainOp.sign === 'boolean' && t.secnOp.sign === 'boolean'; }

function matchTypes(tree, id)
{
  if ( tree.head === 'not' )
  {
    if ( tree.mainOp.sign !== 'boolean' )
      throw exc(5, id, "Not requires a boolean.");
    else
      tree.sign = 'boolean';
  }
  else if ( intInt(tree.head) )
  {
    if ( isIntInt(tree) )
      tree.sign = 'integer';
    else
      throw exc(5, id, "Instruction " + tree.head + " requires two integers.");
  }
  else if ( intBool(tree.head) )
  {
    if ( isIntInt(tree) )
      tree.sign = 'boolean';
    else
      throw exc(5, id, "Instructions " + tree.head + " requires two integers.");
  }
  else if ( boolBool(tree.head) )
  {
    if ( isBoolBool(tree) )
      tree.sign = 'boolean';
    else
      throw exc(5, id, "Instructions " + tree.head + " requires two booleans.");
  }
}

function func(name, args)
{
  return {type:"func", name:name, args:args};
}

function createScope(i)
{
  return scopeCreate.indexOf(i) !== -1;
}
function deleteScope(i)
{
  return scopeDelete.indexOf(i) !== -1;
}

function isFuncSing(i)
{
  return funcSing.indexOf(i) !== -1;
}

function exc(code, line, extra)
{
  return {code:code, line:line, extra:extra};
}

// /////////////////////////////////////////////////////

function isAlgType(x)
{
  return algTypes.indexOf(x) !== -1;
}

function isDisplayType(x)
{
  return displayTypes.indexOf(x) !== -1;
}

function isUsableType(x)
{
  return usableTypes.indexOf(x) !== -1;
}

function log(x)
{
  console.log(JSON.stringify(x, null, 2));
}

function groupAlg(e)
{
  let algorithms = [];
  let current = []
  let depth = 0;

  for ( let i = 0; i < e.length; i++ )
  {
    current.push(e[i]);
    let it = e[i].type;
    if ( it === 'algorithm' )
      if ( depth > 0 )
        throw exc(1, e[i].id, "Cannot declare an algorithm inside another.");
      else
        depth = 1;
    else if ( deleteScope(it) )
    {
      if ( depth === 0 )
        throw exc(1, e[i].id, "Did not expect closing block.");

      depth--;
      if ( depth === 0 )
      {
        algorithms.push(current);
        current = [];
      }
    }
    else if ( createScope(it) )
      depth++;
  }

  if ( depth !== 0 )
    throw exc(1, e[e.length - 1].id, "Expected done block.");

  return algorithms;
}

function splitComma(x, id)
{
  let l = x.length;
  if ( l === 0 )
    return [];
  if ( x[0].type === ',' || x[l-1].type === ',' )
    throw exc(2, id, "Unexpected comma at beginning/end.");

  let result = [];
  let counter = 0;
  let start = 0;
  for ( let i = 0; i < l; i++ )
  {
    if ( x[i].type === '(' )
      counter++;
    else if ( x[i].type === ')' )
    {
      if ( counter === 0 )
        throw exc(2, id, "Did not expect closing parenthesys.");
      counter--;
    }
    else if ( x[i].type === ',' && counter === 0 )
    {
      if ( x[start].type === ',' )
        throw exc(2, id, "Empty expression between commas found.");
      result.push(x.slice(start, i));
      i++;
      start = i;
    }
  }
  if ( counter !== 0 )
    throw exc(2, id, "Open parenthesys unterminated.");

  result.push(x.slice(start, l));
  return result;
}

function expandCommaExpr(algs)
{
  for ( let i = 0; i < algs.length; i++ )
    if ( algs[i].type === 'for' || algs[i].type === 'show' )
      algs[i].context.expression = splitComma(algs[i].context.expression, algs[i].id);
}

function algoSigs(x)
{
  let sigs = [];
  let main = false;

  for ( let i = 0; i < x.length; i++ )
  {
    let a  = x[i][0];
    let ac = a.context;

    if ( ac.type === 'program' )
      if ( main )
        throw exc(3, a.id, "Duplicate 'program' algorithms, cannot decide what to run.");
      else
        main = true;

    let args = [];
    for ( let j = 0; j < ac.args.length; j++ )
      args.push(ac.args[j].type);

    let current = {name:ac.target, type:ac.type, args:args};
    for ( let k = 0; k < sigs.length; k++ )
      if ( sigs[k].name === current.name )
        throw exc(3, a.id, "Duplicate algorithms. " + current.name + ".");

    sigs.push(current);
  }

  if ( !main )
    throw exc(3, x[x.length-1][0].id, "Could not find any 'program' algorithm to run.");

  for ( let k = 0; k < sigs.length; k++ )
    if ( sigs[k].type === 'program' )
      sigs.splice(k, 1);

  return sigs;
}

function parseFunc(expr, id)
{
  let next = [];
  let l = expr.length;

  let counter = 0;
  for ( var i = 0; i < l; i++ )
  {
    if ( i < l - 1 && expr[i].type === 'variable' && expr[i+1].type === '(' )
    {
      let fname = expr[i].value;
      let j = i + 2;
      counter++;
      while ( counter > 0 && j < l )
      {
        if ( expr[j].type === '(' )
          counter++;
        else if ( expr[j].type === ')' )
          counter--;

        j++;
      }

      if ( counter !== 0 )
        throw exc(6, id, "Could not match opening parenthesys with closing parenthesys.");

      let result = splitComma(expr.slice(i+2, j - 1), id);
      let yes = [];
      for ( let k = 0; k < result.length; k++ )
        yes.push(parseFunc(result[k]));
      
      next.push(func(fname, yes));
      i = j - 1;
    }
    else
      next.push(expr[i]);
  }
  return next;
}

function expandFuncs(_e)
{
  for ( let i = 0; i < _e.length; i++ )
  {
    let e = _e[i];
    let ex = e.context.expression;
    if ( ex !== undefined )
    {
      if ( e.type === 'show' )
      {
        let next = [];
        for ( var j = 0; j < ex.length; j++ )
        {
          next.push(parseFunc(ex[j], e.id));
        }
        e.context.expression = next;
      }
      else if ( e.type === 'for' )
      {
        if ( ex.length !== 3 || ex[0][0].type !== 'variable' || ex[0][1].type !== '<-' || ex[0].length < 3 )
          throw exc(2, e.id, "Improper for loop.");

        e.context.begin = {target:ex[0][0].value, expr:parseFunc(ex[0].slice(2, ex[0].length), e.id)};
        e.context.limit = parseFunc(ex[1]);
        e.context.step  = parseFunc(ex[2]);
        e.context.expression = undefined;
      }
      else if ( isFuncSing(e.type) )
      {
        e.context.expression = parseFunc(e.context.expression, e.id);
      }
    }
  }
}

function constructContext(alg, algoSigs)
{
  let typeContext = {};

  for ( let i = 0; i < algoSigs.length; i++ )
    typeContext[algoSigs[i].name] = {sign:algoSigs[i].type, type:"func", args:algoSigs[i].args};

  for ( let i = 0; i < alg[0].context.args.length; i++ )
  {
    if ( typeContext[alg[0].context.args[i].value] !== undefined )
      throw exc(5, alg[0].id, "Cannot have algorithm arguments named as other algorithms.");

    typeContext[alg[0].context.args[i].value] = {sign:alg[0].context.args[i].type, type:"var"};
  }

  typeContext["_self"] = alg[0].context.type;

  return typeContext;
}

function formTree(e, id)
{
  if ( e.length === 0 )
    throw exc(5, id, "Empty expression found, probably between parenthesys.");

  let lowest = -1;
  let depth = 0;

  for ( let i = 0; i < e.length; i++ )
  {
    if ( e[i].type === '(' )
      depth++;
    else if ( e[i].type === ')' )
      depth--;
    else if ( !operand(e[i]) && depth === 0 )
    {
      if ( lowest === -1 || precedence(e[i]) < precedence(e[lowest]) )
        lowest = i;
    }
  }

  if ( depth !== 0 )
    throw exc(5, id, "Bad pairs of parenthesys, cannot close them.");

  if ( lowest === e.length )
    throw exc(5, id, "Cannot have operand on last position: "+ operation(e[lowest]) +".");
  
  if ( lowest === -1 )
  {
    if ( e.length === 1 )
      return {head:'unit', mainOp:e[0]};
    else
    {
      e.pop();
      e.shift(1);
      return formTree(e, id);
    }
  }
  else if ( lowest === 0 )
  {
    if ( unary(e[lowest]) )
    {
      let t = formTree(e.slice(1, e.length), id);
      let op = e[0];
      if ( op.type === '-' )
      {
        if ( t.unary === undefined )
          t.unary = op;
        else if ( t.unary.type === '-' )
          t.unary.type = '+';
        else
          t.unary.type = '-';
      }

      return t;
    }
    return {head:operator(e[0]), mainOp:formTree(e.slice(1, e.length), id)};
  }

  return {head:operator(e[lowest]), mainOp:formTree(e.slice(0, lowest), id), secnOp:formTree(e.slice(lowest + 1, e.length), id)};
}

function validateFunction(mainOp, context, buildup, id)
{
  if ( mainOp.args.length !== context[mainOp.name].args.length )
    throw exc(5, id, "Bad number of arguments - gave "+mainOp.args.length+". Expected "+context[mainOp.name].args.length+".");

  for ( let i = 0; i < mainOp.args.length; i++ )
  {
    mainOp.args[i] = parseExpr(mainOp.args[i], context, buildup, id);
    if ( mainOp.args[i].sign !== context[mainOp.name].args[i] )
    {
      let t = mainOp.args[i].sign !== undefined ? mainOp.args[i].sign : 'inexistent variable';
      throw exc(5, id,"Mismatched argument types - gave "+t+". Expected "+context[mainOp.name].args[i]+".");
    }
  }
}

function typeIt(tree, context, buildup, id)
{
  if ( tree.head === 'unit' )
  {
    if ( isLiteral(tree.mainOp.type) )
      tree.mainOp.sign = tree.mainOp.type;
    else if ( tree.mainOp.type === 'func' )
    {
      if ( context[tree.mainOp.name] !== undefined )
      {
        tree.mainOp.sign = context[tree.mainOp.name].sign;
        validateFunction(tree.mainOp, context, buildup, id);
      }
      else
        throw exc(5, id, "Trying to use inexistent algorithm: " + tree.mainOp.name + ".");
    }
    else if ( tree.mainOp.type === 'variable' )
    {
      if ( context[tree.mainOp.value] !== undefined )
      {
        if ( context[tree.mainOp.value].type === 'func' )
          throw exc(5, id, "Trying to use algorithm as variable: " + tree.mainOp.value + ".");

        tree.mainOp.sign = context[tree.mainOp.value].sign;
      }
      else
      {
        for ( let i = 0; i < buildup.length; i++ )
        {
          if ( buildup[i][tree.mainOp.value] !== undefined )
          {
            tree.mainOp.sign = buildup[i][tree.mainOp.value];
            break;
          }
        }
      }
    }
    else
    {
      throw exc(5, id, "Cannot match unit type: " + tree.mainOp + ".");
    }

    tree.sign = tree.mainOp.sign;
  }
  else
  {
    typeIt(tree.mainOp, context, buildup, id);
    if ( tree.secnOp !== undefined )
      typeIt(tree.secnOp, context, buildup, id);

    matchTypes(tree, id);
  }
}

function parseExpr(expr, context, buildup, id)
{
  let exprTree = formTree(expr, id);
  typeIt(exprTree, context, buildup, id);
  return exprTree;
}

function validTarget(name, type, context, buildup, id)
{
  if ( context[name] !== undefined )
    throw exc(5, id, "Bad variable name, cannot name it like an algorithm or parameter.");

  for ( let i = 0; i < buildup.length; i++ )
  {
    let x = buildup[i][name];
    if ( x !== undefined )
    {
      if ( x !== type )
        throw exc(5, id, "Cannot change type of variable on the fly.");
      else
        return;
    }
  }
}

function expandExpr(alg, context)
{
  let buildup = [{}];
  for ( let i = 1; i < alg.length; i++ )
  {
    let x = alg[i];
    switch(x.type)
    {
      case 'while':
      case 'if':
      case 'elseif':
        var parsedExpr = parseExpr(x.context.expression, context, buildup, x.id);
        
        if ( parsedExpr.sign !== 'boolean' )
          throw exc(5, x.id, "Mismatched expression type, expected boolean.");
        
        x.context.expression = parsedExpr;
        buildup.push({});
        break;
      case 'until':
        var parsedExpr = parseExpr(x.context.expression, context, buildup, x.id);

        if ( parsedExpr.sign !== 'boolean' )
          throw exc(5, x.id, "Mismatched expression type, expected boolean.");
        
        x.context.expression = parsedExpr;
        buildup.pop();
        break;
      case 'for':
        let begin = parseExpr(x.context.begin.expr, context, buildup, x.id);
        let limit = parseExpr(x.context.limit, context, buildup, x.id);
        let step  = parseExpr(x.context.step,  context, buildup, x.id);

        if ( begin.sign !== 'integer' || limit.sign !== 'integer' || step.sign !== 'integer' )
          throw exc(5, x.id, "Mismatched types, the begin, limit and step must all be integers.");

        x.context.begin.expr = begin;
        x.context.limit = limit;
        x.context.step = step;
        validTarget(x.context.begin.target, begin.sign, context, buildup, x.id);
        buildup[buildup.length - 1][x.context.begin.target] = 'integer';
        buildup.push({});
        break;
      case 'else':
        buildup.pop();
        buildup.push({});
        break;
      case 'do':
        buildup.push({});
        break;
      case 'done':
        buildup.pop();
        break;
      case 'read':
        if ( context['_self'] !== 'program' )
          throw exc(5, x.id, "Can only have read statement in the program algorithm.");
        for ( let i = 0; i < x.context.args.length; i++ )
          buildup[buildup.length - 1][x.context.args[i]] = 'integer';
        break;
      case 'show':
        if ( context['_self'] !== 'program' )
          throw exc(5, x.id, "Can only have show statement in the program algorithm.");

        let acc = [];
        for ( let i = 0; i < x.context.expression.length; i++ )
        {
          if ( x.context.expression[i].length === 1 && x.context.expression[i][0].type === 'string' )
            acc.push(x.context.expression[i][0]);
          else
          {
            let ex = parseExpr(x.context.expression[i], context, buildup, x.id)

            if ( ex.sign !== undefined )
              acc.push(ex);
            else
              throw exc(5, x.id, "Trying to display content of inexistent variable.");
          }
        }
        x.context.expression = acc;
        break;
      case 'return':
        if ( context['_self'] === 'program' )
          throw exc(5, x.id, "Cannot have return statement in the 'program' algorithm.");

        x.context.expression = parseExpr(x.context.expression, context, buildup, x.id);

        let t = x.context.expression.sign !== undefined ? x.context.expression.sign : 'inexistent variable';
        if ( context['_self'] !== x.context.expression.sign )
          throw exc(5, x.id, "Returning " + t + " in function of type " + context['_self']+".");
        break;
      case 'var':
        let ex = parseExpr(x.context.expression, context, buildup, x.id);
        validTarget(x.context.target, ex.sign, context, buildup, x.id);
        x.context.expression = ex;
        buildup[buildup.length - 1][x.context.target] = ex.sign;
        break;

      default:
        throw exc(-1, x.id, "Couldn't parse expression type " + x.type +".");
    }
  }
}

function evalExpr(alg, algoSigs)
{
  for ( let i = 0; i < alg.length; i++ )
  {
    let typeContext = constructContext(alg[i], algoSigs);
    expandExpr(alg[i], typeContext);
  }
}

function groupExpressions(alg)
{
  for ( let i = 0; i < alg.length; i++ )
  {
    let pass = alg[i];
    let contextStack = [pass[0]];
    pass[0].subexpr = [];

    for ( let j = 1; j < pass.length - 1; j++ )
    {
      if ( pSubExpr(pass[j]) )
      {
        contextStack[contextStack.length - 1] .subexpr.push(pass[j]);
        contextStack.pop();
        contextStack.push(pass[j]);
        pass[j].subexpr = [];
      }
      else if ( oSubExpr(pass[j]) )
      {
        contextStack[contextStack.length - 1].subexpr.push(pass[j]);
        contextStack.push(pass[j]);
        pass[j].subexpr = [];
      }
      else if ( dSubExpr(pass[j]) )
      {
        if ( pass[j].type === 'until' )
        {
          contextStack[contextStack.length - 1].type = "until";
          contextStack[contextStack.length - 1].context.expression = pass[j].context.expression;
        }
        contextStack.pop();
      }
      else
        contextStack[contextStack.length - 1].subexpr.push(pass[j]);
    }

    alg[i] = contextStack[0];
  }
}

function find(expchain, keys)
{
  for ( let i = 0; i < expchain.length; i++ )
  {
    let t = expchain[i].type;

    for ( let j = 0; j < keys.length; j++ )
      if ( keys[j] === t )
        return true;

    if ( expchain[i].subexpr !== undefined )
      if ( find(expchain[i].subexpr, keys) )
        return true;
  }

  return false;
}

function nonEmpty(t)
{
  return t === 'algorithm' || t === 'if' || t === 'elseif' || t === 'else' || t === 'until' || t === 'while';
}
function branchingStatement(t)
{
  return t === 'elseif' || t === 'else';
}

function verifyCtrlStructs(struct)
{
  if ( struct.subexpr.length === 0 || ( struct.subexpr.length === 1 && branchingStatement(struct.subexpr[0].type)) )
    throw exc(7, struct.id, "Control structure cannot have an empty body.");

  for ( let i = 0; i < struct.subexpr.length; i++ )
  {
    if ( nonEmpty(struct.subexpr[i].type) )
      verifyCtrlStructs(struct.subexpr[i]);
  }
}

function lint(algos)
{
  for ( let i = 0; i < algos.length; i++ )
  {
    verifyCtrlStructs(algos[i]);

    if ( algos[i].context.type === 'program' )
    {
      if ( algos[i].context.args.length !== 0 )
        throw exc(7, algos[i].id, "Program algorithm cannot take arguments.");
    }
    else
    {
      if ( algos[i].subexpr[algos[i].subexpr.length - 1].type !== 'return' )
        throw exc(7, algos[i].id, "Last statement in non-program algorithm must be a return statement.");
    }
  }
}

module.exports = {
  isAlgType:isAlgType,
  isDisplayType:isDisplayType,
  isUsableType:isUsableType,
  log:log,
  groupAlg:groupAlg,
  splitComma:splitComma,
  expandCommaExpr:expandCommaExpr,
  algoSigs:algoSigs,
  expandFuncs:expandFuncs,
  evalExpr:evalExpr,
  groupExpressions:groupExpressions,
  lint:lint
};
