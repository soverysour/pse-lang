# Pse - Language specification

## Basics

Every line must be a valid expression. An expression, depending on its type, may have other subexpressions of its own.
Only empty lines and valid expressions are allowed.

## Types

There are four types present:
* integer - general purpose.
* boolean - general purpose.
* program - this is the algorithm that is the 'program' to be run.
* string - no operations are defined on strings, they can only be given as literals to show expressions.

General purpose means that they can be types of a variable, types of an algorithm.
Only integer values can be used as input, with the read expression.

## Variables and algorithms

Algorithm parameters are immutable.
You cannot have a variable named as a parameter or an algorithm name.

## Types of expressions

*Algorithm expression*
```
algorithm nameOfAlgorithm(argument1 as type1, ...) as typeAlg:
  @other subexpressions
done
```

Every algorithm must have a name, a type, and some subexpression(s).

There has to be at least one algorithm with the type 'program'. That will be the algorithm to be run.
The 'program' algorithm cannot take parameters or return values.

Any other algorithm cannot use show or read expressions.
Any other algorithm must have as its last expression a return expression, returning the same type as the algorithm's signature.

*Read expression*
```
read varname1, varname2, ...
```

Attempts to read integers from input and assign them to the variable names.

*Show expression*
```
show 'string1', 12 + 3, false, ...
```

Attempts to show output.

*If/Else if/Else expressions*
```
if cond1 do
  @subexpressions
else if cond2 do
  @subexpressions
else
  @subexpressions
done
```

There can be as many else-if and else expressions as wanted, but they will only be executed as necessary.
The condition for any check must be a boolean.

*While expression*
```
while cond do
  @subexpressions
done
```

Attempts to execute the subexpressions as long as cond evaluates to true.
Tests before executing.

*Until expressions*
```
do
  @subexpressions
until cond
```

Attempts to execute the subexpressions as long as cond is false.
Executes before testing.

*For expression*
```
for var <- initial, final, step do
  @subexpressions
done
```

Defines var with value initial, and attempts to perform all subexpressions as long as initial hasn't passed final, given a step.
The definition and last value of var persists after the for loop is finished.

The condition for re-executing depends on the step:
If the step is negative and var is >= final, the for is re-executed.
If the step is not negative and var is <= final, the for is re-executed.
Otherwise, it is not executed again.

*Return expression*
```
return val
```

Attempts to return val from the algorithm.
Can only return from non-program algorithms, values of the same signature as the algorithm.
Must be the last statement in any non-program algorithm.

*Assignment expression*
```
var <- expr
```
Attempts to assign expr to variable var. Var must have the same type or not be declared.
Var must not be a name of another algorithm or of an algorithm parameter.

## Literals
* Integer - 0, -1, 3, ...
* Boolean - true, false.
* String - "'string1", 'string2"'

## Operators
* Integer to integer: +, -, \*, /, %.
* Integer to boolean: >, <, >=, <=, =, !=
* Boolean to boolean: and, or, xor, not

As far as precedence goes, it is as expected. except 'not'. It has a higher precedence than and, or, xor.
