#!/usr/bin/env node

var calcBrain = require('./integral.js') 
  , repl = require('repl')

calcBrain.roundAccuracy = 1/10
console.log('listing all properties that are becoming part of the global scope')
console.log('-----------------------------------------------------------------')
Object.getOwnPropertyNames(calcBrain).forEach(function(prop) {
  if (prop === 'description') return //shim, but ignore description property

  GLOBAL[prop] = calcBrain[prop]
  console.log('property => ' + prop)
  console.log('  ' + calcBrain.description[prop])
})

repl.start({})

