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
import { Instruction } from "../Abstract/Instruction.js";
import { type, Relational_operator } from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
var Relational = /** @class */ (function (_super) {
    __extends(Relational, _super);
    function Relational(exp1, exp2, operator, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        _this.operator = operator;
        _this.type = type.BOOL;
        _this.value = "";
        return _this;
    }
    Relational.prototype.interpret = function (tree, table) {
        //bool == bool -> si
        //bool != bool -> si
        //String == String -> si
        //String != String -> si
        //array == array -> si
        //array != array -> si
        //int y double -> si
        //int y char -> si
        //char y double -> si
        if (this.exp1 !== undefined && this.exp2 !== undefined) {
            var left = this.exp1.interpret(tree, table);
            if (left instanceof Exception) {
                return left;
            }
            var right = this.exp2.interpret(tree, table);
            if (right instanceof Exception) {
                return right;
            }
            switch (this.operator) {
                case Relational_operator.EQUAL:
                case Relational_operator.UNEQUAL:
                    switch (this.exp1.get_type()) {
                        case type.INT:
                        case type.DOUBLE:
                            switch (this.exp2.get_type()) {
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(parseFloat(left), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(parseFloat(left), right.charCodeAt(), this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(this.exp1.get_type()), this.row, this.column);
                            }
                        case type.CHAR:
                            switch (this.exp2.get_type()) {
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(left.charCodeAt(), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(this.exp1.get_type()), this.row, this.column);
                            }
                        case type.STRING:
                            switch (this.exp2.get_type()) {
                                case type.STRING:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(type.STRING), this.row, this.column);
                            }
                        case type.BOOL:
                            switch (this.exp2.get_type()) {
                                case type.BOOL:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(type.BOOL), this.row, this.column);
                            }
                        case type.ARRAY:
                            switch (this.exp2.get_type()) {
                                case type.ARRAY:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(type.ARRAY), this.row, this.column);
                            }
                        default:
                            return new Exception("Semantic", "The type: ".concat(this.exp1.get_type(), " cannot be operated whit operator: ").concat(this.operator), this.row, this.column);
                    }
                case Relational_operator.GREATER:
                case Relational_operator.GREATEREQUAL:
                case Relational_operator.LESS:
                case Relational_operator.LESSEQUAL:
                    switch (this.exp1.get_type()) {
                        case type.INT:
                        case type.DOUBLE:
                            switch (this.exp2.get_type()) {
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(parseFloat(left), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(parseFloat(left), right.charCodeAt(), this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(this.exp1.get_type()), this.row, this.column);
                            }
                        case type.CHAR:
                            switch (this.exp2.get_type()) {
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(left.charCodeAt(), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(this.exp1.get_type()), this.row, this.column);
                            }
                        default:
                            return new Exception("Semantic", "The type: ".concat(this.exp1.get_type(), " cannot be operated whit operator: ").concat(this.operator), this.row, this.column);
                    }
            }
        }
        else {
            return new Exception("Semantic", "Expression Expected", this.row, this.column);
        }
    };
    Relational.prototype.to_lower = function (op1, op2, operator) {
        switch (operator) {
            case Relational_operator.EQUAL:
                this.value = String(op1 == op2).toLowerCase();
                return this.value;
            case Relational_operator.UNEQUAL:
                this.value = String(op1 != op2).toLowerCase();
                return this.value;
            case Relational_operator.GREATER:
                this.value = String(op1 > op2).toLowerCase();
                return this.value;
            case Relational_operator.GREATEREQUAL:
                this.value = String(op1 >= op2).toLowerCase();
                return this.value;
            case Relational_operator.LESS:
                this.value = String(op1 < op2).toLowerCase();
                return this.value;
            case Relational_operator.LESSEQUAL:
                this.value = String(op1 <= op2).toLowerCase();
                return this.value;
        }
    };
    Relational.prototype.get_type = function () {
        return this.type;
    };
    Relational.prototype.toString = function () {
        return this.value;
    };
    return Relational;
}(Instruction));
export { Relational };
