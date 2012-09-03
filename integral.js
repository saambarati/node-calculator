

/* return {function} */
function formulateFunc(str, varname) {
  var s = '(function() { return function('+varname+') { return '+str+'} })()'
  //console.log(s)
  return eval(s) //I know it's 'evil'. This returns a function when 'eval'ed
  //return new Function()
}

function interpretFunc(str) {
  var sections = /f\(([A-Za-z\s\,]+)\)\s*\=\s*([\s\S]*)/.exec(str) // capture the f({varname}) = {mathematical function with respect to 'varname'}
    , varnames = sections[1]
    , func = sections[2]
  //console.log(sections)
  return formulateFunc(func, varnames)
}

function integrate(f, lower, upper) {
  var dx = exports.accuracy
    , sum = 0
    , cur = lower
    , func 

  if (typeof f === 'function') {
    func = f
  } else {
    func = interpretFunc(f)
  }
 
  try {
    while (cur < upper) {
      sum += func(cur) * dx
      cur += dx
    }
  } catch (e) {
    console.error('your function has an error in it =>\n\t' + e)
    sum = NaN
  }
  if (Math.abs((Math.round(sum) - sum)) < exports.roundAccuracy) sum = Math.round(sum)
  return sum
}

function derive(f, x) {
  var func
    , interval = exports.accuracy
    , x2 = x + interval
    , x1 = x - interval
    , slope

  if (typeof f === 'function') {
    func = f
  } else {
    func = interpretFunc(f)
  }

  slope = (func(x2) - func(x1)) / (x2-x1)
  if (Math.abs(Math.round(slope) - slope) < exports.accuracy * 10) slope = Math.round(slope)

  return slope
}

/*testing*/
//function sq(x) { return x*x }
//console.log(integrate('f(x) = x*x', 1, 2))
//console.log(integrate('f(q) = q*q*q', 0, 1))
//console.log(integrate('f(q) = (Math.sqrt(q) / q*q)', 1, 2))
//console.log(integrate('f(x) = Math.sin(x)', 0, Math.PI))
//console.log(integrate('f(x) = (0-x) * Math.pow(x+3,2)', -3, 0))
//console.log(derive('f(x) = Math.pow(x, 2) + x', 1))


exports.accuracy = 1/1000000
exports.roundAccuracy = 1/1000
exports.func = interpretFunc
exports.derive = derive
exports.integrate = integrate

exports.description = {}
exports.description.accuracy = 'how fine of rectangle do you want calculating your integrals. i.e the "dx" part of an integral'
exports.description.roundAccuracy = 'if an answer is within this distance to a whole number, a whole number is returned'
exports.description.func = 'accepts a string like "f(x) = x*x" or "f(t) = Math.pow(x, 3)" and returns a function that when passed a parameter will evaluate the function'
exports.description.derive = 'evaluates a function or string following the "func" guidelines of a string and derives it at a given point, paramters to this function are ([string|function], point)'
exports.description.integrate = 'evaluates a function or string following the "func" guidelines of a string and integrates it between two points, paramters to this function are ([string|function], lowerLim, upperLim)'
