
var mathReplacements = Object.getOwnPropertyNames(Math) //i.e cos, sin, atan, etc ...
  , DEBUG = false
  , debug = (DEBUG ? console.log : function(){})

function interpretFunc(str) {
  try {
    var sections = /f\(([A-Za-z\s\,]+)\)\s*\=([\s\S]*)/.exec(str) // capture the f({varname}) = {mathematical function with respect to 'varname'}
      , varnames = sections[1]
      , func = ' ' + sections[2] + ' ' //pad with spaces b/c regexes wont work with matching ''

    //debug('varnames:' + varnames)
    //debug('func:' + func)
    mathReplacements.forEach(function (prop, ix) {
      var idx = func.indexOf(prop)
        , notAlphaNum
        , before
        , after

      if (idx !== -1) {
        notAlphaNum = /[^\w]/
        before = func.charAt(idx-1)
        after = func.charAt(idx+prop.length)
        debug('before:' + before)
        debug('after:' + after)

        //make sure before/after aren't alpha num. Make sure before isn't period.
        //this is here because we don't 'asin' replaced with 'aMath.sin' and we dont want 'Math.pow' to be replaced with 'Math.Math.pow'
        if (notAlphaNum.test(before) && before !== '.' && notAlphaNum.test(after)) { //if the match isn't followed by another alphaNum replace it with Math func
          func = func.replace(prop, 'Math.' + prop)
          debug('replacing with math')
        }
        debug('compiled function =>'+func)
      }
    })

    return formulateFunc(func, varnames)
  } catch(e) {
    return null
  }
  //console.log(func)
}

/* return {function} */
function formulateFunc(str, varname) {
  var s = '(function() { return function('+varname+') { return '+str+'} })()'
    , func = eval(s)
  //console.log(func.toString())
  return func     //I know it's 'evil'. This returns a function when 'eval'ed
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
  if (!func) return NaN

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

var interval = Math.pow(10, -15) //small ass number
function derive(f, x) {
  var func
    , x2 = x + interval
    , x1 = x - interval
    , slope

  while (x1 === x2) {
    x1 *= 10
    x2 *= 10
  }
  if (typeof f === 'function') {
    func = f
  } else {
    func = interpretFunc(f)
  }
  if (!func) return NaN

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
exports.description.func = 'accepts a string like "f(x) = x*x" or "f(t) = Math.pow(t, 3)" and returns a function that when passed a parameter will evaluate the function'
exports.description.derive = 'evaluates a function or string following the "func" guidelines of a string and derives it at a given point, paramters to this function are ([string|function], point)'
exports.description.integrate = 'evaluates a function or string following the "func" guidelines of a string and integrates it between two points, paramters to this function are ([string|function], lowerLim, upperLim)'
