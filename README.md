# calculator

### Install
     npm install calculator
     cd calculator
     npm start

or

    npm install -g calculator
    node-calc

### API

When starting calculator, it starts a node repl with all of the following properties set as properties of the `GLOBAL` object.
All Math properties are replaced with `Math.(prop)` so you can write `var f = func('f(x) = sin(x)')` instead of `var f = func('f(x) = Math.sin(x)')`

#### func
    var f = func('f(x) = x*10 - 20')
    f(3) //returns 10

    f = func('f(x, t) = Math.pow(x, 2) + t + 1')
    f(2, 4) // returns 9

#### derive
params `([string|function], point to evaluate function)`
    `derive('f(x) = x*x', 2) //evaluate derivative @ x = 2;  returns 4`

#### integrate
params `([string|function], lower limit, upper limit)`
`derive('f(x) = x*x', 0, 1) //evaluate definite integral from x = 0 to x = 1;  returns .333 = 1/3`

#### accuracy
Set this property to determine how accurate the definite integral will be. Essentialy the "dx" in f(x)dx.
Default is `1/1000000`

#### roundAccuracy
Set this property to determine the distance between an estimated answer and a whole number that you wish cli calc to return the rounded number.
This is useful when you know the answer is a whole number and you don't want something like `1.99999999998384` returned instead of `2`

