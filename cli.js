#!/usr/bin/env node

var calcBrain = require('./calculator.js')
  , repl = require('repl')
  , fs = require('fs')
  , path = require('path')
  , optimist = require('optimist')
  , prompt = require('prompt')
  , DEBUG = false
  , argv
  , debug
  , FILE_NAME = require('./FILE_NAME')

if (DEBUG) {
  debug = function() { console.log.apply(console, ['debug: '.yellow].concat(Array.prototype.slice.call(arguments)) ) }
} else {
  debug = function(){}
}

require('colors') //add color extenstions to String

// have optimist parse argv
argv = require('optimist')
  .usage('node-calc [-options]')

  .alias('c', 'console')
  .describe('c', 'launch the interactive console')

  .alias('l', 'list')
  .describe('l', 'list the functions that are globals when the REPL is launched [option: --console]')

  .alias('g', 'define-global')
  .describe('g','make a global function that is defined when the REPL begins')

  .alias('d', 'delete')
  .describe('d', 'delete global function by named identifier. To see the number identifier, use [option: --list]')

  .alias('h', 'help')

  .argv
//end of optimist parse


/* functions to deal with global data IO*/
if (!fs.existsSync(FILE_NAME)) save({ "globalFunctions":{} }) //make sure data.json exists


var getData = (function() {
  var data = fs.readFileSync(FILE_NAME, 'utf8')
  data = JSON.parse(data)

  return function() {
    return data
  }

})()

function save(data) {
  if (!data) data = getData()

  try {
    data = JSON.stringify(data)
    fs.writeFileSync(FILE_NAME, data, 'utf8')
    debug('successfuly saved to : '+FILE_NAME)
  } catch(e) {
    console.error('error saving data file: ' + e.message)
  }
}




/* list globally defined functions */
function list() {
  var globals = getData().globalFunctions
    , globalsProps = Object.getOwnPropertyNames(globals)

  globalsProps.forEach(function(prop, ix) {
    console.log('['+prop+'] => '+globals[prop])
  })

  if (!globalsProps.length) console.log('no global functions defined')
}

/* delete a global */
function deleteGlobal() {
  var promptFor = {
    properties : {
      deletable : {
        message : 'enter the function name that you want to delete'.green
        , required : true
      }
    }
  }

  var funcs = getData().globalFunctions
  if (!Object.getOwnPropertyNames(funcs).length) return console.log('No global functions defined'.yellow)

  console.log('global functions'.magenta)
  console.log('----------------'.magenta)
  list() //list all func names prior to prompting for deletion
  prompt.start()
  prompt.get(promptFor, function(err, results) {
    if (err) return console.log('error while getting function name :=> ' + err.message.red)
    var fnName = results.deletable
    if (!funcs[fnName]) {
      console.log('function name does not exist'.yellow)
    } else {
      delete funcs[fnName]
      save()
      console.log('function ' + fnName.red + ' deleted')
    }
  })
}

/* handle defining global functions */
function defineGlobal() {
  var globals = getData().globalFunctions
    , promptFor

  prompt.start() //begin the input process

  function gather () {
    promptFor = {
      properties : {
        funcName : {
          message : 'enter the name you want the global function to be'.green
          , required : true
        }
        , funcLiteral : {
          message : 'enter the literal function that you want to define: i.e => f(x) = x*x'.green
          , required : true
        }
        , defineAnother : {
          message : 'define another global (y/n)'.green
          , required : true
        }
      }
    }
    prompt.get(promptFor, function(err, results) {
      if (err) return console.log('error while gathering info :=> ' + err.message.red)

      var funcName = results.funcName
        , defAnother = results.defineAnother.toLowerCase()

      if (globals[funcName]) {
        console.log('redefining function named: '.yellow+funcName.red)
      }

      globals[funcName] = results.funcLiteral
      debug('defined function: ' + funcName + '=> ' + results.funcLiteral)

      if (defAnother === 'y' || defAnother === 'yes') {
        gather()
      } else {
        console.log('successfuly defined globals')
        save()
        //process.exit(0)
      }
    })
  }
  gather()
}


/* interactive calculator console */
function launchConsole() {
  calcBrain.roundAccuracy = 1/10

  //start the repl
  var opts = { 'prompt' : '> '.cyan }
    , context = repl.start(opts).context //repl context
    , data = getData().globalFunctions
    , props = Object.getOwnPropertyNames(data)

  //list possible functions from ./calculator.js module
  console.log(' ') //get rid of initial prompt '>'
  console.log('listing all properties that are becoming part of the global scope'.magenta)
  console.log('-----------------------------------------------------------------'.magenta)
  Object.getOwnPropertyNames(calcBrain).forEach(function(prop) {
    if (prop === 'description') return //shim, but ignore description property of the ./calculator.js module

    context[prop] = calcBrain[prop]
    console.log( ('property => ' + prop.inverse).yellow ) //.inverse is part of colors module
    console.log('  ' + calcBrain.description[prop])
  })
  //list global functions
  console.log('\nGlobal Functions'.magenta)
  console.log('----------------'.magenta)
  props.forEach(function(prop) {
    var toDisplay = 'var ' + prop + ' = ' + data[prop] + ';'
    console.log(toDisplay.blue)
    context[prop] = context.func(data[prop]) //define the corresponding property as an interpreted function
    if (!context[prop]) console.error('the following function has an error: ' + prop.yellow + '  its value is => ' + data[prop].red)
  })
  process.stdout.write(opts.prompt) //write one prompt i.e '>' to indicate repl has started
}

//parse through argv
;(function action() {

  var actions =
  [
    'g', defineGlobal
    ,'l', list
    ,'c', launchConsole
    ,'h', optimist.showHelp
    ,'d', deleteGlobal
  ]

  for (var i = 0; i < actions.length; i+=2) {
    if (argv[ actions[i] ]) return actions[i+1]() //invoke corresponding function
  }
  //if nothing was chosen just default to showing the help
  optimist.showHelp()
})()


