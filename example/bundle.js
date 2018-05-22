(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require("./utils.js");

var Expression = function () {
  function Expression(line, id) {
    _classCallCheck(this, Expression);

    this.id = id;
    if (line.length === 0) {
      this.valid = false;
      this.err = false;
      return;
    }

    try {
      var first = line[0];
      if (first.type === 'keyword') {
        if (first.value === 'algorithm') this.parseAlg(line);else if (first.value === 'while') this.parseWhile(line);else if (first.value === 'if') this.parseIf(line);else if (first.value === 'else') this.parseElse(line);else if (first.value === 'for') this.parseFor(line);else if (first.value === 'do') this.parseDo(line);else if (first.value === 'done') this.parseDone(line);else if (first.value === 'read') this.parseRead(line);else if (first.value === 'show') this.parseShow(line);else if (first.value === 'return') this.parseReturn(line);else if (first.value === 'until') this.parseUntil(line);
      } else if (first.type === 'variable') this.parseVar(line);else {
        this.error(line);
      }
    } catch (err) {
      this.error(err, line);
    }
  }
  // Computational.


  _createClass(Expression, [{
    key: 'parseWhile',
    value: function parseWhile(line) {
      if (line.length < 3) throw "Improper while loop.";

      this.context = { expression: line.slice(1, line.length - 1) };
      this.type = 'while';
    }
    // Computational.

  }, {
    key: 'parseUntil',
    value: function parseUntil(line) {
      if (line.length < 2) throw "Improper until loop.";

      this.context = { expression: line.slice(1, line.length) };
      this.type = 'until';
    }
    // Computational.

  }, {
    key: 'parseIf',
    value: function parseIf(line) {
      if (line.length < 3 || line[line.length - 1].value !== 'do') throw "Improper if statement.";

      this.context = { expression: line.slice(1, line.length - 1) };
      this.type = 'if';
    }
    // Computational.

  }, {
    key: 'parseElse',
    value: function parseElse(line) {
      if (line.length !== 1) {
        if (line.length < 4 || line[1].value !== 'if' || line[line.length - 1].value !== 'do') throw "Improper else / else-if statement.";

        this.context = { expression: line.slice(2, line.length - 1) };
        this.type = 'elseif';
      } else {
        this.context = {};
        this.type = 'else';
      }
    }
    // Computational.

  }, {
    key: 'parseFor',
    value: function parseFor(line) {
      if (line.length < 7 || line[1].type !== 'variable' || line[2].type !== '<-') throw "Improper for loop.";

      this.context = { expression: line.slice(1, line.length - 1) };
      this.type = 'for';
    }
    // Computational.

  }, {
    key: 'parseVar',
    value: function parseVar(line) {
      if (line.length < 3 || line[1].type !== '<-' || line[0].type !== 'variable') throw "Improper assignment.";

      this.context = { expression: line.slice(2, line.length) };
      this.context.target = line[0].value;
      this.type = 'var';
    }
    // Computational.

  }, {
    key: 'parseReturn',
    value: function parseReturn(line) {
      if (line.length < 2) throw "Improper return statement.";

      this.context = { expression: line.slice(1, line.length) };
      this.type = 'return';
    }
    // Computational.

  }, {
    key: 'parseShow',
    value: function parseShow(line) {
      var len = line.length;
      if (len < 2) throw "Improper show statement.";

      this.context = { expression: line.slice(1, line.length) };
      this.type = 'show';
    }
    // Declarative.

  }, {
    key: 'parseDo',
    value: function parseDo(line) {
      if (line.length !== 1) throw "Improper do statement.";

      this.context = {};
      this.type = 'do';
    }
    // Declarative.

  }, {
    key: 'parseDone',
    value: function parseDone(line) {
      if (line.length !== 1) throw "Improper done statement.";

      this.context = {};
      this.type = 'done';
    }
    // Is done.
    // Declarative.

  }, {
    key: 'parseRead',
    value: function parseRead(line) {
      var len = line.length;
      if (len < 2) throw "Improper read statement.";

      var args = [];
      for (var i = 1; i < len; i += 2) {
        if (i !== len - 1 && line[i + 1].type !== ',') throw 0;

        var name = line[i];
        args.push(name.value);
      }

      this.context = {};
      this.context.args = args;
      this.type = 'read';
    }
    // Is done.
    // Declarative.

  }, {
    key: 'parseAlg',
    value: function parseAlg(line) {
      var name = line[1];
      var parO = line[2];
      var parC = line[line.length - 4];
      var algAs = line[line.length - 3];
      var algType = line[line.length - 2];
      var colm = line[line.length - 1];

      if (name.type !== 'variable' || parO.type !== '(' || parC.type !== ')' || colm.type !== ':' || !utils.isAlgType(algType.value) || algAs.value !== 'as') throw "Improper algorithm definition.";

      var args = [];
      for (var i = 3; i < line.length - 4; i += 4) {
        var v = line[i];
        var as = line[i + 1];
        var type = line[i + 2];
        var c = line[i + 3];

        if (i !== line.length - 7 && c.type !== ',') throw "Comma separated arguments are required";

        if (v.type !== 'variable' || as.value !== "as" || !utils.isUsableType(type.value)) throw "Bad argument type definition.";

        args.push({ value: v.value, type: type.value });
      }

      this.context = {};
      this.context.target = name.value;
      this.context.args = args;
      this.context.type = algType.value;
      this.type = 'algorithm';
    }
    // Error signaling function.

  }, {
    key: 'error',
    value: function error(err, line) {
      this.err = err;
      this.valid = false;
    }
  }]);

  return Expression;
}();

module.exports = Expression;
},{"./utils.js":7}],2:[function(require,module,exports){
"use strict";

var Pse = require('./pse.js');

var p = undefined;
$(document).ready(function () {
  $("#btn_load").click(loadFunc);
  $("#btn_step").click(stepFunc);
  $("#btn_complete").click(completeFunc);
  $("#btn_state").click(stateFunc);
});

function loadFunc() {
  p = undefined;

  var program = $("#program_data").val();
  var input = $("#program_input").val();
  var temp = new Pse(program, input);

  $("#program_log").val('');
  $("#program_info").text('');

  var errors = temp.getErrors();
  if (errors) {
    $("#program_log").val(errors.join('\n'));
    $("#program_info").text('The program couldn\'t be loaded.!');
    return;
  }

  $("#program_log").val('Beginning of execution.');
  $("#program_info").text('The program was loaded successfully!');

  p = temp;
}
function stepFunc() {
  if (p === undefined) {
    $("#program_info").text("Cannot run an inexistent program!");
    return;
  }

  if (p.isDone()) {
    $("#program_info").text("Cannot step in a finished algorithm!");
    return;
  }

  var output = p.step();
  if (p.isDone()) $("#program_info").text("The program has finished executing.");else $("#program_info").text("Currently at line " + p.line() + ".");

  if (output) {
    $("#program_log").val($("#program_log").val() + '\n' + output.msg);

    if (output.err) $("#program_info").text("Died at line " + p.line() + ".");
  }
}
function completeFunc() {
  if (p === undefined) {
    $("#program_info").text("Cannot complete an inexistent algorithm!");
    return;
  }

  while (!p.isDone()) {
    stepFunc();
  }
}
function stateFunc() {
  if (p === undefined) {
    $("#program_info").text("Cannot get the state of an inexistent algorithm!");
    return;
  }

  $("#program_log").val($("#program_log").val() + '\n' + JSON.stringify(p.getState(), null, 2));
}
},{"./pse.js":5}],3:[function(require,module,exports){
"use strict";

var utils = require("./utils.js");

module.exports = function (x) {
  // -1 - for errors that should never happen.
  try {
    if (x.length < 3) throw { code: 8, line: 0, extra: "No expression was given." };
    // Extra processing of AST.
    utils.expandCommaExpr(x); // 2
    utils.expandFuncs(x); // 6

    // Expression processing and semantic analysis.
    var algorithms = utils.groupAlg(x); // 1
    var algoSigs = utils.algoSigs(algorithms); // 3
    utils.evalExpr(algorithms, algoSigs); // 4 - bad expr, 5 - bad types.
    utils.groupExpressions(algorithms);
    utils.lint(algorithms); // 7

    return algorithms;
  } catch (a) {
    var e = a.code;
    var _x = a.extra;
    var l = a.line;
    var msg = '\n' + "> At line " + l + ". " + _x;

    if (e === -1) throw "Error. " + msg;else if (e === 1) throw "Could not identify the algorithms. Are you sure the layout is proper?" + msg;else if (e === 2) throw "Could not identify comma-separated blocks properly." + msg;else if (e === 3) throw "Could not identify algorithms." + msg;else if (e === 4) throw "Could not understand expressions." + msg;else if (e === 5) throw "The expression didn't respect the specified types." + msg;else if (e === 6) throw "Could not parse functions from expressions." + msg;else if (e == 7) throw "Improper use of expressions." + msg;else if (e === 8) throw "There is nothing to run." + msg;else throw "Didn't understand the error code " + e + ". " + msg;
  }
};
},{"./utils.js":7}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require("./utils.js");

function unarify(t, c) {
  if (t === undefined || t.type === '+') return c;

  if (t.type === '-') return -c;
}

var Program = function () {
  _createClass(Program, [{
    key: 'currentInstr',
    value: function currentInstr() {
      return this.executionStack[this.executionStack.length - 1].subexpr[this.currentInstrStack[this.currentInstrStack.length - 1]];
    }
  }, {
    key: 'cContext',
    value: function cContext() {
      return this.context[this.context.length - 1];
    }
  }, {
    key: 'runFunc',
    value: function runFunc(func) {
      if (this.stackLevel === 2500) throw "Stack limit exceeded, stopping everything.";

      var newContext = {};
      var algoToRun = this.algorithms[func.name];
      for (var i = 0; i < func.args.length; i++) {
        newContext[algoToRun.context.args[i].value] = this.eval(func.args[i]);
      }this.context.push(newContext);
      this.executionStack.push(algoToRun);
      this.currentInstrStack.push(0);

      var currentStack = this.stackLevel++;
      while (currentStack < this.stackLevel) {
        this.performStep();
      }

      this.context.pop();

      while (this.executionStack[this.executionStack.length - 1].type !== 'algorithm') {
        this.executionStack.pop();
        this.currentInstrStack.pop();
      }
      this.executionStack.pop();
      this.currentInstrStack.pop();
    }
  }, {
    key: 'eval',
    value: function _eval(t) {
      if (t.head === 'unit') {
        if (t.mainOp.type === 'variable') return unarify(t.mainOp.unary, this.cContext()[t.mainOp.value]);else if (t.mainOp.type === 'func') {
          this.runFunc(t.mainOp);
          return unarify(t.mainOp.unary, this.returnVals.pop());
        }

        return unarify(t.mainOp.unary, t.mainOp.value);
      }

      var left = unarify(t.mainOp.unary, this.eval(t.mainOp));
      var right = t.secnOp !== undefined ? unarify(t.secnOp.unary, this.eval(t.secnOp)) : undefined;
      switch (t.head) {
        case '*':
          return left * right;
        case '/':
          if (right === 0) throw "Cannot use div operand on zero.";
          return left / right >> 0;
        case '%':
          if (right === 0) throw "Cannot use mod operand on zero.";
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
  }, {
    key: 'jumpOrNext',
    value: function jumpOrNext() {
      var ci = this.currentInstrStack[this.currentInstrStack.length - 1];
      var li = this.executionStack[this.executionStack.length - 1];

      if (ci >= li.subexpr.length - 1) {
        if (this.executionStack.length === 1) // Particular case, for when the main algorithm has reached its end.
          {
            this.stackLevel--;
            this.executionStack.pop();
            this.currentInstrStack.pop();
          } else {
          switch (li.type) {
            case 'while':
              var ccnd = this.eval(li.context.expression);
              if (ccnd) this.currentInstrStack[this.currentInstrStack.length - 1] = 0;else {
                this.currentInstrStack.pop();
                this.executionStack.pop();
                this.jumpOrNext();
              }
              break;
            case 'until':
              var cond = this.eval(li.context.expression);
              if (!cond) this.currentInstrStack[this.currentInstrStack.length - 1] = 0;else {
                this.currentInstrStack.pop();
                this.executionStack.pop();
                this.jumpOrNext();
              }
              break;
            case 'for':
              var step = this.eval(li.context.step);
              var limit = this.eval(li.context.limit);

              this.cContext()[li.context.begin.target] = this.cContext()[li.context.begin.target] + step;
              var value = this.cContext()[li.context.begin.target];

              if (step >= 0) {
                if (value <= limit) this.currentInstrStack[this.currentInstrStack.length - 1] = 0;else {
                  this.executionStack.pop();
                  this.currentInstrStack.pop();
                  this.jumpOrNext();
                }
              } else {
                if (value >= limit) this.currentInstrStack[this.currentInstrStack.length - 1] = 0;else {
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
  }, {
    key: 'performStep',
    value: function performStep() {
      var step = this.currentInstr();

      if (step === undefined) {
        this.jumpOrNext();
        return;
      }
      switch (step.type) {
        case 'show':
          var buff = [];
          for (var i = 0; i < step.context.expression.length; i++) {
            if (step.context.expression[i].type === 'string') buff.push(step.context.expression[i].value);else buff.push(this.eval(step.context.expression[i]));
          }
          this.jumpOrNext();
          return buff.join('');
          break;
        case 'read':
          for (var _i = 0; _i < step.context.args.length; _i++) {
            if (this.input.length === 0) throw "Not enough input data was given! Attempting to read beyond what was given.";

            this.cContext()[step.context.args[_i]] = this.input[0];
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
          var cond = this.eval(step.context.expression);

          if (cond) {
            this.executionStack.push(step);
            this.currentInstrStack.push(0);
          } else {
            var last = step.subexpr[step.subexpr.length - 1];
            while (last.type === 'elseif' && !this.eval(last.context.expression)) {
              last = last.subexpr[last.subexpr.length - 1];
            }

            if (last.type === 'elseif' || last.type === 'else') {
              this.executionStack.push(last);
              this.currentInstrStack.push(0);
            } else this.jumpOrNext();
          }
          break;
        case 'while':
          if (this.eval(step.context.expression)) {
            this.executionStack.push(step);
            this.currentInstrStack.push(0);
          } else this.jumpOrNext();
          break;
        case 'for':
          var initial = this.eval(step.context.begin.expr);
          var limit = this.eval(step.context.limit);
          var incr = this.eval(step.context.step);
          this.cContext()[step.context.begin.target] = initial;

          if (incr >= 0) {
            if (initial <= limit) {
              this.executionStack.push(step);
              this.currentInstrStack.push(0);
            } else this.jumpOrNext();
          } else {
            if (initial >= limit) {
              this.executionStack.push(step);
              this.currentInstrStack.push(0);
            } else this.jumpOrNext();
          }
          break;
        case 'until':
          this.executionStack.push(step);
          this.currentInstrStack.push(0);
          break;
      }
    }
  }]);

  function Program(parsedState, input) {
    _classCallCheck(this, Program);

    this.input = input.split(' ').filter(function (x) {
      return x !== '';
    });
    this.algorithms = {};
    this.context = [{}];
    this.returnVals = [];
    this.stackLevel = 1;

    for (var i = 0; i < parsedState.length; i++) {
      if (parsedState[i].context.type !== 'program') this.algorithms[parsedState[i].context.target] = parsedState[i];else this.main = parsedState[i];
    }for (var _i2 = 0; _i2 < this.input.length; _i2++) {
      if (this.input[_i2].match(/^[+-]?[0-9]+$/)) this.input[_i2] = parseInt(this.input[_i2]);else throw "Part of given input is improper, not actually a number: " + this.input[_i2] + ".";
    }this.executionStack = [this.main];
    this.currentInstrStack = [0];
  }

  _createClass(Program, [{
    key: 'step',
    value: function step() {
      if (this.stackLevel === 0) return { err: true, msg: "Cannot execute step in a finished program." };

      if (this.error) return { err: true, msg: "Cannot execute step in a program that encountered an exception." };

      try {
        var res = this.performStep();
        if (res) return { err: false, msg: res };
      } catch (err) {
        this.error = true;
        return { err: true, msg: err };
      }
    }
  }, {
    key: 'currentLine',
    value: function currentLine() {
      if (this.stackLevel === 0) return { err: true, msg: "The current program has finished executing." };

      return this.currentInstr().id;
    }
  }, {
    key: 'isDone',
    value: function isDone() {
      return this.stackLevel === 0 || this.error;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.cContext();
    }
  }, {
    key: 'generateCpp',
    value: function generateCpp() {
      return 'TODO';
    }
  }]);

  return Program;
}();

module.exports = Program;
},{"./utils.js":7}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tokenizer = require("./tokenizer.js");
var Expression = require("./expression.js");
var Program = require("./program.js");
var utils = require("./utils.js");
var parser = require("./parser.js");

// The only class that should be visible from the outside.

var Pse = function () {
  // Creates everything, from a given string.
  function Pse(str, data) {
    _classCallCheck(this, Pse);

    this.errors = [];
    var lines = str.split('\n');

    var tokenizer = new Tokenizer(lines);
    for (var i = 0; i < tokenizer.errors.length; i++) {
      this.errors.push(tokenizer.errors[i]);
      if (i === tokenizer.errors.length - 1) return;
    }

    var expressions = [];
    for (var i = 0; i < tokenizer.lines.length; i++) {
      expressions.push(new Expression(tokenizer.lines[i], i + 1));
    }var leave = false;
    for (var i = 0; i < expressions.length; i++) {
      if (expressions[i].valid === false && expressions[i].err === false) {
        expressions.splice(i--, 1);
        continue;
      }

      if (expressions[i].err) {
        this.errors.push(expressions[i].err);
        leave = true;
      }
    }

    if (leave) return;

    try {
      var parsedState = parser(expressions);
      this.program = new Program(parsedState, data);
    } catch (e) {
      this.errors.push(e);
    }
  }

  // Attempts to return the next line id to be executed


  _createClass(Pse, [{
    key: "line",
    value: function line() {
      return this.program.currentLine();
    }
    // Attempts to perform a step.

  }, {
    key: "step",
    value: function step() {
      if (this.errors.length > 0) throw "Cannot step in a program with errors.";

      var res = this.program.step();
      if (!res) return;

      if (res.err) {
        this.errors.push(res.msg);
      }

      return res;
    }
  }, {
    key: "isDone",
    value: function isDone() {
      return this.program.isDone();
    }
    // Attempts to get the internal state of all variables.

  }, {
    key: "getState",
    value: function getState() {
      return this.program.getState();
    }
    // Attempts to get all the encountered errors.

  }, {
    key: "getErrors",
    value: function getErrors() {
      return this.errors.length > 0 ? this.errors : false;
    }
    // Attempts to generate an equivallent cpp program.

  }, {
    key: "getCpp",
    value: function getCpp() {
      return this.program.generateCpp();
    }
  }]);

  return Pse;
}();

module.exports = Pse;
},{"./expression.js":1,"./parser.js":3,"./program.js":4,"./tokenizer.js":6,"./utils.js":7}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wordstart = /^[a-zA-Z]$/g;
var wordbody = /^[a-zA-Z0-9]$/g;
var symbol = /^[><)(!=,:*\/%+^-]$/g;
var digit = /^[0-9]$/g;
var quotes = /^("|')$/g;
var whitespace = /^\s$/g;

var keywords = ["algorithm", "for", "while", "do", "until", "if", "else", "done", "as", "integer", "boolean", "show", "read", "return", "program", "and", "or", "not", "xor"];
var booleans = ["true", "false"];
var duochars = ["<-", ">=", "<=", "!="];
var unochars = ["-", "+", "/", "%", "*", "<", ">", "=", "(", ")", ":", ","];

// Takes an array of strings and returns an array of arrays of tokens {type:x, value?:y}.

var Tokenizer = function () {
  function Tokenizer(lines) {
    _classCallCheck(this, Tokenizer);

    this.lines = [];
    this.errors = [];
    for (var i = 0; i < lines.length; i++) {
      this.parseLine(lines[i], i);
    }
  }

  _createClass(Tokenizer, [{
    key: "parseLine",
    value: function parseLine(line, index) {
      var current = 0;
      var end = line.length;
      var tokens = [];

      while (current < end) {
        // Parse keyword / variable
        if (line.charAt(current).match(wordstart)) {
          var start = current;
          current++;

          while (line.charAt(current).match(wordbody)) {
            current++;
          }var name = line.substr(start, current - start);

          if (keywords.indexOf(name) !== -1) tokens.push({ type: 'keyword', value: name });else if (booleans.indexOf(name) !== -1) tokens.push({ type: 'boolean', value: name === 'true' });else tokens.push({ type: 'variable', value: name });
        }
        // Parse grammar
        else if (line.charAt(current).match(symbol)) {
            var uno = line.charAt(current);
            var duo = line.substr(current, 2);

            if (duochars.indexOf(duo) !== -1) {
              tokens.push({ type: duo });
              current += 2;
            } else if (unochars.indexOf(uno) !== -1) {
              tokens.push({ type: uno });
              current++;
            } else {
              this.errors.push("Couldn't parse symbol '" + line.charAt(current) + "' at position " + current + " in line " + index + ".");
              current++;
            }
          }
          // Parse integer literal
          else if (line.charAt(current).match(digit)) {
              var _start = current;
              current++;
              while (line.charAt(current).match(digit)) {
                current++;
              }tokens.push({ type: 'integer', value: parseInt(line.substr(_start, current - _start)) });
            }
            // Parse string literal
            else if (line.charAt(current).match(quotes)) {
                var _start2 = current;
                current++;
                while (line.charAt(current) !== line.charAt(_start2)) {
                  if (current === end) {
                    this.errors.push("Couldn't finish string literal started at line " + index + ' and position ' + current + '.');
                    return;
                  }
                  current++;
                }

                tokens.push({ type: 'string', value: line.substr(_start2 + 1, current - _start2 - 1) });
                current++;
              } else if (line.charAt(current).match(whitespace)) current++;else {
                this.errors.push("Couldn't parse character '" + line.charAt(current) + "' at position " + current + " in line " + index + ".");
                return;
              }
      } // end while

      this.lines.push(tokens);
    } // end function

  }]);

  return Tokenizer;
}(); // end class

module.exports = Tokenizer;
},{}],7:[function(require,module,exports){
"use strict";

var algTypes = ["integer", "boolean", "program"];
var usableTypes = ["integer", "boolean"];
var displayTypes = ["integer", "boolean", "string"];
var scopeCreate = ["do", "for", "while", "if"];
var scopeDelete = ["done", "until"];
var funcSing = ["var", "while", "if", "elseif", "return", "until"];
var operandMarks = ["integer", "variable", "boolean", "func"];
var literals = ["integer", "boolean"];
var intIntArr = ["*", "+", "-", "/", "%"];
var intBoolArr = ["<", ">", "=", "!=", "<=", ">="];
var boolBoolArr = ["and", "or", "xor"];
var opensSubExpr = ["do", "for", "while", "if"];
var permutesSubExpr = ["elseif", "else"];
var closesSubExpr = ["done", "until"];

function pSubExpr(x) {
  return permutesSubExpr.indexOf(x.type) !== -1;
}
function oSubExpr(x) {
  return opensSubExpr.indexOf(x.type) !== -1;
}
function dSubExpr(x) {
  return closesSubExpr.indexOf(x.type) !== -1;
}

function isLiteral(x) {
  return literals.indexOf(x) !== -1;
}

function operand(o) {
  return operandMarks.indexOf(o.type) !== -1;
}

function unary(o) {
  return o.type === '-' || o.type === '+';
}

function operator(x) {
  if (x.value === undefined) return x.type;

  return x.value;
}

function precedence(o) {
  switch (operator(o)) {
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

function defined(t) {
  return t.mainOp !== undefined && t.secnOp !== undefined;
}
function intInt(t) {
  return intIntArr.indexOf(t) !== -1;
}
function intBool(t) {
  return intBoolArr.indexOf(t) !== -1;
}
function boolBool(t) {
  return boolBoolArr.indexOf(t) !== -1;
}
function isIntInt(t) {
  return defined(t) && t.mainOp.sign === 'integer' && t.secnOp.sign === 'integer';
}
function isBoolBool(t) {
  return defined(t) && t.mainOp.sign === 'boolean' && t.secnOp.sign === 'boolean';
}

function matchTypes(tree, id) {
  if (tree.head === 'not') {
    if (tree.mainOp.sign !== 'boolean') throw exc(5, id, "Not requires a boolean.");else tree.sign = 'boolean';
  } else if (intInt(tree.head)) {
    if (isIntInt(tree)) tree.sign = 'integer';else throw exc(5, id, "Instruction " + tree.head + " requires two integers.");
  } else if (intBool(tree.head)) {
    if (isIntInt(tree)) tree.sign = 'boolean';else throw exc(5, id, "Instructions " + tree.head + " requires two integers.");
  } else if (boolBool(tree.head)) {
    if (isBoolBool(tree)) tree.sign = 'boolean';else throw exc(5, id, "Instructions " + tree.head + " requires two booleans.");
  }
}

function func(name, args) {
  return { type: "func", name: name, args: args };
}

function createScope(i) {
  return scopeCreate.indexOf(i) !== -1;
}
function deleteScope(i) {
  return scopeDelete.indexOf(i) !== -1;
}

function isFuncSing(i) {
  return funcSing.indexOf(i) !== -1;
}

function exc(code, line, extra) {
  return { code: code, line: line, extra: extra };
}

// /////////////////////////////////////////////////////

function isAlgType(x) {
  return algTypes.indexOf(x) !== -1;
}

function isDisplayType(x) {
  return displayTypes.indexOf(x) !== -1;
}

function isUsableType(x) {
  return usableTypes.indexOf(x) !== -1;
}

function log(x) {
  console.log(JSON.stringify(x, null, 2));
}

function groupAlg(e) {
  var algorithms = [];
  var current = [];
  var depth = 0;

  for (var i = 0; i < e.length; i++) {
    current.push(e[i]);
    var it = e[i].type;
    if (it === 'algorithm') {
      if (depth > 0) throw exc(1, e[i].id, "Cannot declare an algorithm inside another.");else depth = 1;
    } else if (deleteScope(it)) {
      if (depth === 0) throw exc(1, e[i].id, "Did not expect closing block.");

      depth--;
      if (depth === 0) {
        algorithms.push(current);
        current = [];
      }
    } else if (createScope(it)) depth++;
  }

  if (depth !== 0) throw exc(1, e[e.length - 1].id, "Expected done block.");

  return algorithms;
}

function splitComma(x, id) {
  var l = x.length;
  if (l === 0) return [];
  if (x[0].type === ',' || x[l - 1].type === ',') throw exc(2, id, "Unexpected comma at beginning/end.");

  var result = [];
  var counter = 0;
  var start = 0;
  for (var i = 0; i < l; i++) {
    if (x[i].type === '(') counter++;else if (x[i].type === ')') {
      if (counter === 0) throw exc(2, id, "Did not expect closing parenthesys.");
      counter--;
    } else if (x[i].type === ',' && counter === 0) {
      if (x[start].type === ',') throw exc(2, id, "Empty expression between commas found.");
      result.push(x.slice(start, i));
      i++;
      start = i;
    }
  }
  if (counter !== 0) throw exc(2, id, "Open parenthesys unterminated.");

  result.push(x.slice(start, l));
  return result;
}

function expandCommaExpr(algs) {
  for (var i = 0; i < algs.length; i++) {
    if (algs[i].type === 'for' || algs[i].type === 'show') algs[i].context.expression = splitComma(algs[i].context.expression, algs[i].id);
  }
}

function algoSigs(x) {
  var sigs = [];
  var main = false;

  for (var i = 0; i < x.length; i++) {
    var a = x[i][0];
    var ac = a.context;

    if (ac.type === 'program') if (main) throw exc(3, a.id, "Duplicate 'program' algorithms, cannot decide what to run.");else main = true;

    var args = [];
    for (var j = 0; j < ac.args.length; j++) {
      args.push(ac.args[j].type);
    }var current = { name: ac.target, type: ac.type, args: args };
    for (var k = 0; k < sigs.length; k++) {
      if (sigs[k].name === current.name) throw exc(3, a.id, "Duplicate algorithms. " + current.name + ".");
    }sigs.push(current);
  }

  if (!main) throw exc(3, x[x.length - 1][0].id, "Could not find any 'program' algorithm to run.");

  for (var _k = 0; _k < sigs.length; _k++) {
    if (sigs[_k].type === 'program') sigs.splice(_k, 1);
  }return sigs;
}

function parseFunc(expr, id) {
  var next = [];
  var l = expr.length;

  var counter = 0;
  for (var i = 0; i < l; i++) {
    if (i < l - 1 && expr[i].type === 'variable' && expr[i + 1].type === '(') {
      var fname = expr[i].value;
      var j = i + 2;
      counter++;
      while (counter > 0 && j < l) {
        if (expr[j].type === '(') counter++;else if (expr[j].type === ')') counter--;

        j++;
      }

      if (counter !== 0) throw exc(6, id, "Could not match opening parenthesys with closing parenthesys.");

      var result = splitComma(expr.slice(i + 2, j - 1), id);
      var yes = [];
      for (var k = 0; k < result.length; k++) {
        yes.push(parseFunc(result[k]));
      }next.push(func(fname, yes));
      i = j + 1;
    } else next.push(expr[i]);
  }

  return next;
}

function expandFuncs(_e) {
  for (var i = 0; i < _e.length; i++) {
    var e = _e[i];
    var ex = e.context.expression;
    if (ex !== undefined) {
      if (e.type === 'show') {
        var next = [];
        for (var j = 0; j < ex.length; j++) {
          next.push(parseFunc(ex[j], e.id));
        }
        e.context.expression = next;
      } else if (e.type === 'for') {
        if (ex.length !== 3 || ex[0][0].type !== 'variable' || ex[0][1].type !== '<-' || ex[0].length < 3) throw exc(2, e.id, "Improper for loop.");

        e.context.begin = { target: ex[0][0].value, expr: parseFunc(ex[0].slice(2, ex[0].length), e.id) };
        e.context.limit = parseFunc(ex[1]);
        e.context.step = parseFunc(ex[2]);
        e.context.expression = undefined;
      } else if (isFuncSing(e.type)) {
        e.context.expression = parseFunc(e.context.expression, e.id);
      }
    }
  }
}

function constructContext(alg, algoSigs) {
  var typeContext = {};

  for (var i = 0; i < algoSigs.length; i++) {
    typeContext[algoSigs[i].name] = { sign: algoSigs[i].type, type: "func", args: algoSigs[i].args };
  }for (var _i = 0; _i < alg[0].context.args.length; _i++) {
    if (typeContext[alg[0].context.args[_i].value] !== undefined) throw exc(5, alg[0].id, "Cannot have algorithm arguments named as other algorithms.");

    typeContext[alg[0].context.args[_i].value] = { sign: alg[0].context.args[_i].type, type: "var" };
  }

  typeContext["_self"] = alg[0].context.type;

  return typeContext;
}

function formTree(e, id) {
  if (e.length === 0) throw exc(5, id, "Empty expression found, probably between parenthesys.");

  var lowest = -1;
  var depth = 0;

  for (var i = 0; i < e.length; i++) {
    if (e[i].type === '(') depth++;else if (e[i].type === ')') depth--;else if (!operand(e[i]) && depth === 0) {
      if (lowest === -1 || precedence(e[i]) < precedence(e[lowest])) lowest = i;
    }
  }

  if (depth != 0) throw exc(5, id, "Bad pairs of parenthesys, cannot close them.");

  if (lowest === e.length) throw exc(5, id, "Cannot have operand on last position: " + operation(e[lowest]) + ".");

  if (lowest === -1) {
    if (e.length === 1) return { head: 'unit', mainOp: e[0] };else {
      e.pop();
      e.shift(1);
      return formTree(e, id);
    }
  } else if (lowest === 0) {
    if (unary(e[lowest])) {
      var op = e[0];
      e.shift(1);
      e[0].unary = op;
      return formTree(e, id);
    }
    return { head: operator(e[0]), mainOp: formTree(e.slice(1, e.length), id) };
  }

  return { head: operator(e[lowest]), mainOp: formTree(e.slice(0, lowest), id), secnOp: formTree(e.slice(lowest + 1, e.length), id) };
}

function validateFunction(mainOp, context, buildup, id) {
  if (mainOp.args.length !== context[mainOp.name].args.length) throw exc(5, id, "Bad number of arguments - gave " + mainOp.args.length + ". Expected " + context[mainOp.name].args.length + ".");

  for (var i = 0; i < mainOp.args.length; i++) {
    mainOp.args[i] = parseExpr(mainOp.args[i], context, buildup, id);
    if (mainOp.args[i].sign !== context[mainOp.name].args[i]) {
      var t = mainOp.args[i].sign !== undefined ? mainOp.args[i].sign : 'inexistent variable';
      throw exc(5, id, "Mismatched argument types - gave " + t + ". Expected " + context[mainOp.name].args[i] + ".");
    }
  }
}

function typeIt(tree, context, buildup, id) {
  if (tree.head === 'unit') {
    if (isLiteral(tree.mainOp.type)) tree.mainOp.sign = tree.mainOp.type;else if (tree.mainOp.type === 'func') {
      if (context[tree.mainOp.name] !== undefined) {
        tree.mainOp.sign = context[tree.mainOp.name].sign;
        validateFunction(tree.mainOp, context, buildup, id);
      } else throw exc(5, id, "Trying to use inexistent algorithm: " + tree.mainOp.name + ".");
    } else if (tree.mainOp.type === 'variable') {
      if (context[tree.mainOp.value] !== undefined) {
        if (context[tree.mainOp.value].type === 'func') throw exc(5, id, "Trying to use algorithm as variable: " + tree.mainOp.value + ".");

        tree.mainOp.sign = context[tree.mainOp.value].sign;
      } else {
        for (var i = 0; i < buildup.length; i++) {
          if (buildup[i][tree.mainOp.value] !== undefined) {
            tree.mainOp.sign = buildup[i][tree.mainOp.value];
            break;
          }
        }
      }
    } else {
      throw exc(5, id, "Cannot match unit type: " + tree.mainOp + ".");
    }

    tree.sign = tree.mainOp.sign;
  } else {
    typeIt(tree.mainOp, context, buildup, id);
    if (tree.secnOp !== undefined) typeIt(tree.secnOp, context, buildup, id);

    matchTypes(tree, id);
  }
}

function parseExpr(expr, context, buildup, id) {
  var exprTree = formTree(expr, id);
  typeIt(exprTree, context, buildup, id);
  return exprTree;
}

function validTarget(name, type, context, buildup, id) {
  if (context[name] !== undefined) throw exc(5, id, "Bad variable name, cannot name it like an algorithm or parameter.");

  for (var i = 0; i < buildup.length; i++) {
    var x = buildup[i][name];
    if (x !== undefined) {
      if (x !== type) throw exc(5, id, "Cannot change type of variable on the fly.");else return;
    }
  }
}

function expandExpr(alg, context) {
  var buildup = [{}];
  for (var i = 1; i < alg.length; i++) {
    var x = alg[i];
    switch (x.type) {
      case 'while':
      case 'if':
      case 'elseif':
        var parsedExpr = parseExpr(x.context.expression, context, buildup, x.id);

        if (parsedExpr.sign !== 'boolean') throw exc(5, x.id, "Mismatched expression type, expected boolean.");

        x.context.expression = parsedExpr;
        buildup.push({});
        break;
      case 'until':
        var parsedExpr = parseExpr(x.context.expression, context, buildup, x.id);

        if (parsedExpr.sign !== 'boolean') throw exc(5, x.id, "Mismatched expression type, expected boolean.");

        x.context.expression = parsedExpr;
        buildup.pop();
        break;
      case 'for':
        var begin = parseExpr(x.context.begin.expr, context, buildup, x.id);
        var limit = parseExpr(x.context.limit, context, buildup, x.id);
        var step = parseExpr(x.context.step, context, buildup, x.id);

        if (begin.sign !== 'integer' || limit.sign !== 'integer' || step.sign !== 'integer') throw exc(5, x.id, "Mismatched types, the begin, limit and step must all be integers.");

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
        if (context['_self'] !== 'program') throw exc(5, x.id, "Can only have read statement in the program algorithm.");
        for (var _i2 = 0; _i2 < x.context.args.length; _i2++) {
          buildup[buildup.length - 1][x.context.args[_i2]] = 'integer';
        }break;
      case 'show':
        if (context['_self'] !== 'program') throw exc(5, x.id, "Can only have show statement in the program algorithm.");

        var acc = [];
        for (var _i3 = 0; _i3 < x.context.expression.length; _i3++) {
          if (x.context.expression[_i3].length === 1 && x.context.expression[_i3][0].type === 'string') acc.push(x.context.expression[_i3][0]);else {
            var _ex = parseExpr(x.context.expression[_i3], context, buildup, x.id);

            if (_ex.sign !== undefined) acc.push(_ex);else throw exc(5, x.id, "Trying to display content of inexistent variable.");
          }
        }
        x.context.expression = acc;
        break;
      case 'return':
        if (context['_self'] === 'program') throw exc(5, x.id, "Cannot have return statement in the 'program' algorithm.");

        x.context.expression = parseExpr(x.context.expression, context, buildup, x.id);

        var t = x.context.expression.sign !== undefined ? x.context.expression.sign : 'inexistent variable';
        if (context['_self'] !== x.context.expression.sign) throw exc(5, x.id, "Returning " + t + " in function of type " + context['_self'] + ".");
        break;
      case 'var':
        var ex = parseExpr(x.context.expression, context, buildup, x.id);
        validTarget(x.context.target, ex.sign, context, buildup, x.id);
        x.context.expression = ex;
        buildup[buildup.length - 1][x.context.target] = ex.sign;
        break;

      default:
        throw exc(-1, x.id, "Couldn't parse expression type " + x.type + ".");
    }
  }
}

function evalExpr(alg, algoSigs) {
  for (var i = 0; i < alg.length; i++) {
    var typeContext = constructContext(alg[i], algoSigs);
    expandExpr(alg[i], typeContext);
  }
}

function groupExpressions(alg) {
  for (var i = 0; i < alg.length; i++) {
    var pass = alg[i];
    var contextStack = [pass[0]];
    pass[0].subexpr = [];

    for (var j = 1; j < pass.length - 1; j++) {
      if (pSubExpr(pass[j])) {
        contextStack[contextStack.length - 1].subexpr.push(pass[j]);
        contextStack.pop();
        contextStack.push(pass[j]);
        pass[j].subexpr = [];
      } else if (oSubExpr(pass[j])) {
        contextStack[contextStack.length - 1].subexpr.push(pass[j]);
        contextStack.push(pass[j]);
        pass[j].subexpr = [];
      } else if (dSubExpr(pass[j])) {
        if (pass[j].type === 'until') {
          contextStack[contextStack.length - 1].type = "until";
          contextStack[contextStack.length - 1].context.expression = pass[j].context.expression;
        }
        contextStack.pop();
      } else contextStack[contextStack.length - 1].subexpr.push(pass[j]);
    }

    alg[i] = contextStack[0];
  }
}

function find(expchain, keys) {
  for (var i = 0; i < expchain.length; i++) {
    var t = expchain[i].type;

    for (var j = 0; j < keys.length; j++) {
      if (keys[j] === t) return true;
    }if (expchain[i].subexpr !== undefined) if (find(expchain[i].subexpr, keys)) return true;
  }

  return false;
}

function nonEmpty(t) {
  return t === 'algorithm' || t === 'if' || t === 'elseif' || t === 'else' || t === 'until' || t === 'while';
}
function branchingStatement(t) {
  return t === 'elseif' || t === 'else';
}

function verifyCtrlStructs(struct) {
  if (struct.subexpr.length === 0 || struct.subexpr.length === 1 && branchingStatement(struct.subexpr[0].type)) throw exc(7, struct.id, "Control structure cannot have an empty body.");

  for (var i = 0; i < struct.subexpr.length; i++) {
    if (nonEmpty(struct.subexpr[i].type)) verifyCtrlStructs(struct.subexpr[i]);
  }
}

function lint(algos) {
  for (var i = 0; i < algos.length; i++) {
    verifyCtrlStructs(algos[i]);

    if (algos[i].context.type === 'program') {
      if (algos[i].context.args.length !== 0) throw exc(7, algos[i].id, "Program algorithm cannot take arguments.");
    } else {
      if (algos[i].subexpr[algos[i].subexpr.length - 1].type !== 'return') throw exc(7, algos[i].id, "Last statement in non-program algorithm must be a return statement.");
    }
  }
}

module.exports = {
  isAlgType: isAlgType,
  isDisplayType: isDisplayType,
  isUsableType: isUsableType,
  log: log,
  groupAlg: groupAlg,
  splitComma: splitComma,
  expandCommaExpr: expandCommaExpr,
  algoSigs: algoSigs,
  expandFuncs: expandFuncs,
  evalExpr: evalExpr,
  groupExpressions: groupExpressions,
  lint: lint
};
},{}]},{},[2]);
