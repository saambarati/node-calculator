
var calc = require('./calculator')
  , assert = require('assert')

function good(expected, actual) {
  return Math.abs(expected - actual) < calc.accuracy
}
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
assert(good(calc.derive(f, 2), 1/2))

f = calc.func('f(x) = 1/x')
assert(good(calc.integrate(f, 1, 4), Math.log(4)))

f = calc.func('f(x) = x*x')
assert(good(calc.derive(f, 2), 4))


console.log('passed all assertions')
