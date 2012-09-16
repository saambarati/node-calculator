
var calc = require('./calculator')
  , assert = require('assert')

//check replacements
var f = calc.func('f(x) = sin(x)')
assert(f(Math.PI/2) === 1)

f = calc.func('f(t) = asin(t)')
assert(f(Math.sqrt(3)/2) === Math.PI/3)
assert(f(1) === Math.PI/2)

f = calc.func('f(t) = acos(t)')
assert(f(1) === 0)

f = calc.func('f(x) = log(x)')
assert(f(Math.E) === 1)
