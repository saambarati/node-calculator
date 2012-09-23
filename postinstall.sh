#!/bin/sh

if [ ! -e "./data.json" ]
then
  out=$(node ./cli.js -l 2>&1) #silent stdout while creating ./data.json file
  echo "creating data.json file"
else
  echo "not overwriting globals in data.json"
fi
