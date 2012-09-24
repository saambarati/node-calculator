#!/usr/bin/env node

var fs = require('fs')
  , DATA_FILE = require('./FILE_NAME')

require('colors')

try {
  fs.unlinkSync(DATA_FILE)
  console.log('successfuly removed data file at location: ' + DATA_FILE.green)
} catch (e) {
  console.log('could not remove file at file path ' + DATA_FILE.red + '\nError: ' + e.message.red)
  console.log('\nAccess was probably denied. \nI would recommend running: ' + ('$( rm ' + DATA_FILE + ' )').green + '  from your terminal ')
}
