"use strict";
var Calc = /** @class */ (function () {
    function Calc() {
    }
    Calc.prototype.add = function (a, b) {
        return a + b;
    };
    Calc.prototype.inc = function (a) {
        return a += 1;
    };
    return Calc;
}());
var calc = new Calc();
console.log(calc.inc(4));
