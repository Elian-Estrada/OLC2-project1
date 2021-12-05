"use strict";
exports.__esModule = true;
exports.Logical_operator = exports.Relational_operator = exports.Arithmetic_operator = exports.type = void 0;
var type;
(function (type) {
    type["INT"] = "int";
    type["DOUBLE"] = "double";
    type["STRING"] = "string";
    type["CHAR"] = "char";
    type["BOOL"] = "boolean";
    type["ARRAY"] = "array";
    type["STRUCT"] = "struct";
    type["NULL"] = "null";
})(type = exports.type || (exports.type = {}));
var Arithmetic_operator;
(function (Arithmetic_operator) {
    Arithmetic_operator["ADDITION"] = "+";
    Arithmetic_operator["SUBSTRACTION"] = "-";
    Arithmetic_operator["MULTIPLICATION"] = "*";
    Arithmetic_operator["DIVISION"] = "/";
    Arithmetic_operator["MODULS"] = "%";
    Arithmetic_operator["INC"] = "++";
    Arithmetic_operator["DEC"] = "--";
    Arithmetic_operator["REPETITION"] = "^";
})(Arithmetic_operator = exports.Arithmetic_operator || (exports.Arithmetic_operator = {}));
var Relational_operator;
(function (Relational_operator) {
    Relational_operator["EQUAL"] = "==";
    Relational_operator["UNEQUAL"] = "!=";
    Relational_operator["GREATER"] = ">";
    Relational_operator["GREATEREQUAL"] = ">=";
    Relational_operator["LESS"] = "<";
    Relational_operator["LESSEQUAL"] = "<=";
})(Relational_operator = exports.Relational_operator || (exports.Relational_operator = {}));
var Logical_operator;
(function (Logical_operator) {
    Logical_operator["AND"] = "&&";
    Logical_operator["NOT"] = "!";
    Logical_operator["OR"] = "||";
})(Logical_operator = exports.Logical_operator || (exports.Logical_operator = {}));
