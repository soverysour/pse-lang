const utils = require("./utils.js");

module.exports = function (x)
{
  // -1 - for errors that should never happen.
  try {
    if ( x.length < 3 )
      throw {code:8, line:0, extra:"No expression was given."};
    // Extra processing of AST.
    utils.expandCommaExpr(x); // 2
    utils.expandFuncs(x); // 6

    // Expression processing and semantic analysis.
    let algorithms = utils.groupAlg(x); // 1
    let algoSigs   = utils.algoSigs(algorithms); // 3
    utils.evalExpr(algorithms, algoSigs); // 4 - bad expr, 5 - bad types.
    utils.groupExpressions(algorithms);
    utils.lint(algorithms); // 7

    return algorithms;
  }
  catch(a)
  {
    let e = a.code;
    let x = a.extra;
    let l = a.line;
    let msg = '\n' + "> At line " + l + ". " + x;

    if ( e === -1 )
      throw "Error. " + msg;
    else if ( e === 1 )
      throw "Could not identify the algorithms. Are you sure the layout is proper?" + msg;
    else if ( e === 2 )
      throw "Could not identify comma-separated blocks properly." + msg;
    else if ( e === 3 )
      throw "Could not identify algorithms." + msg;
    else if ( e === 4 )
      throw "Could not understand expressions." + msg;
    else if ( e === 5 )
      throw "The expression didn't respect the specified types." + msg;
    else if ( e === 6 )
      throw "Could not parse functions from expressions." + msg;
    else if ( e == 7 )
      throw "Improper use of expressions." + msg;
    else if ( e === 8 )
      throw "There is nothing to run." + msg;
    else
      throw "Didn't understand the error code " + e + ". " + msg;
  }
}
