
var calcBrain = require('./integral.js') 
  , repl = require('repl')

calcBrain.roundAccuracy = 1/10
console.log('listing all properties that are becoming part of the global scope')
console.log('-----------------------------------------------------------------')
for (prop in calcBrain) {
  GLOBAL[prop] = calcBrain[prop]
  console.log('property =>' + prop)
  console.log('  ' + calcBrain[prop].description)
}

repl.start({})

