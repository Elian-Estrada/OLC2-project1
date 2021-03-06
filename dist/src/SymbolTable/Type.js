export var type;
(function (type) {
    type["INT"] = "int";
    type["DOUBLE"] = "double";
    type["STRING"] = "string";
    type["CHAR"] = "char";
    type["BOOL"] = "boolean";
    type["ARRAY"] = "array";
    type["STRUCT"] = "struct";
    type["NULL"] = "null";
    type["VOID"] = "void";
})(type || (type = {}));
export var Arithmetic_operator;
(function (Arithmetic_operator) {
    Arithmetic_operator["ADDITION"] = "+";
    Arithmetic_operator["SUBSTRACTION"] = "-";
    Arithmetic_operator["MULTIPLICATION"] = "*";
    Arithmetic_operator["DIVISION"] = "/";
    Arithmetic_operator["MODULS"] = "%";
    Arithmetic_operator["INC"] = "++";
    Arithmetic_operator["DEC"] = "--";
    Arithmetic_operator["REPETITION"] = "^";
})(Arithmetic_operator || (Arithmetic_operator = {}));
export var Relational_operator;
(function (Relational_operator) {
    Relational_operator["EQUAL"] = "==";
    Relational_operator["UNEQUAL"] = "!=";
    Relational_operator["GREATER"] = ">";
    Relational_operator["GREATEREQUAL"] = ">=";
    Relational_operator["LESS"] = "<";
    Relational_operator["LESSEQUAL"] = "<=";
})(Relational_operator || (Relational_operator = {}));
export var Logical_operator;
(function (Logical_operator) {
    Logical_operator["AND"] = "&&";
    Logical_operator["NOT"] = "!";
    Logical_operator["OR"] = "||";
})(Logical_operator || (Logical_operator = {}));
export var String_operator;
(function (String_operator) {
    String_operator["CONCAT"] = "&";
    String_operator["REPETITION"] = "^";
})(String_operator || (String_operator = {}));
