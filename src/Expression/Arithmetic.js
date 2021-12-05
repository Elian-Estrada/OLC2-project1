"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Arithmetic = void 0;
var Instruction_js_1 = require("../Abstract/Instruction.js");
var Type_js_1 = require("../SymbolTable/Type.js");
var Exception_js_1 = require("../SymbolTable/Exception.js");
var Arithmetic = /** @class */ (function (_super) {
    __extends(Arithmetic, _super);
    function Arithmetic(exp1, exp2, operator, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.operator = operator;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        _this.value = null;
        _this.type = null;
        _this.bool = {
            "true": true,
            "false": false
        };
        return _this;
    }
    Arithmetic.prototype.interpret = function (tree, table) {
        var left = this.exp1.interpret(tree, table);
        if (left instanceof Error)
            return left;
        if (this.exp2 != null) {
            var right = this.exp2.interpret(tree, table);
            if (right instanceof Error)
                return right;
            switch (this.operator) {
                case Type_js_1.Arithmetic_operator.ADDITION:
                    if (this.exp1.getType() === Type_js_1.type.INT) {
                        switch (this.exp2.getType()) {
                            case Type_js_1.type.INT:
                                this.value = parseInt(left) + parseInt(right);
                                break;
                            case Type_js_1.type.DOUBLE:
                                this.value = parseFloat(left) + parseFloat(right);
                                break;
                            case Type_js_1.type.CHAR:
                                this.value = parseInt(left) + right.charCodeAt(0);
                                break;
                            case Type_js_1.type.STRING:
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception_js_1["default"]("Semantic", "The type ".concat(this.exp2.get_type().toString(), " cannot be operated with type: INTEGER"), this.row, this.column);
                        }
                    }
                    else if (this.exp1.getType() === Type_js_1.type.STRING) {
                        switch (this.exp2.getType()) {
                            case Type_js_1.type.INT:
                            case Type_js_1.type.DOUBLE:
                            case Type_js_1.type.CHAR:
                            case Type_js_1.type.STRING:
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception_js_1["default"]("Semantic", "The type ".concat(this.exp2.get_type().toString(), " cannot be operated with type: STRING"), this.row, this.column);
                        }
                    }
                    else if (this.exp1.getType() === Type_js_1.type.BOOL) {
                        switch (this.exp2.getType()) {
                            case Type_js_1.type.STRING:
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception_js_1["default"]("Semantic", "The type ".concat(this.exp2.get_type().toString(), " cannot be operated with type: BOOLEAN"), this.row, this.column);
                        }
                    }
            }
            switch (this.operator) {
                case Type_js_1.Arithmetic_operator.SUBSTRACTION:
                case Type_js_1.Arithmetic_operator.MULTIPLICATION:
                case Type_js_1.Arithmetic_operator.DIVISION:
                case Type_js_1.Arithmetic_operator.MODULS:
                    if (this.exp1.getType() === Type_js_1.type.INT) {
                        switch (this.exp2.getType()) {
                            case Type_js_1.type.INT:
                                this.value = parseInt(left) + parseInt(right);
                                break;
                            case Type_js_1.type.DOUBLE:
                                this.value = parseFloat(left) + parseFloat(right);
                                break;
                            case Type_js_1.type.CHAR:
                                this.value = parseInt(left) + right.charCodeAt(0);
                                break;
                            default:
                                return new Exception_js_1["default"]("Semantic", "The type ".concat(this.exp2.get_type().toString(), " cannot be operated with type: INTEGER"), this.row, this.column);
                        }
                    }
                    else if (this.exp1.getType() === Type_js_1.type.DOUBLE) {
                        switch (this.exp2.getType()) {
                            case Type_js_1.type.INT:
                            case Type_js_1.type.DOUBLE:
                                this.value = parseFloat(left) + parseFloat(right);
                                break;
                            case Type_js_1.type.CHAR:
                                this.value = parseInt(left) + right.charCodeAt(0);
                                break;
                            default:
                                return new Exception_js_1["default"]("Semantic", "The type ".concat(this.exp2.get_type().toString(), " cannot be operated with type: DOUBLE"), this.row, this.column);
                        }
                    }
                    else if (this.exp1.getType() === Type_js_1.type.CHAR) {
                        switch (this.exp2.get_type()) {
                            case Type_js_1.type.INT:
                                this.value = left.charCodeAt(0) - parseInt(right);
                                break;
                            case Type_js_1.type.DOUBLE:
                                this.value = parseFloat(left.charCodeAt(0)) - parseFloat(right);
                                break;
                            case Type_js_1.type.CHAR:
                                this.value = left.charCodeAt(0) - right.charCodeAt(0);
                                break;
                            default:
                                return new Exception_js_1["default"]("Semantic", "The type ".concat(this.exp2.get_type().toString(), " cannot be operated with type: CHAR"), this.row, this.column);
                        }
                    }
            }
        }
        return this.value;
    };
    Arithmetic.prototype.get_type = function () {
        return this.type;
    };
    return Arithmetic;
}(Instruction_js_1.Instruction));
exports.Arithmetic = Arithmetic;
