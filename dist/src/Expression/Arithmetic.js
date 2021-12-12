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
import { Arithmetic_operator, type } from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import { Identifier } from "./Identifier.js";
var Arithmetic = /** @class */ (function (_super) {
    __extends(Arithmetic, _super);
    function Arithmetic(exp1, exp2, operator, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.operator = operator;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        _this.value = "";
        _this.type = null;
        _this.bool = {
            true: true,
            false: false
        };
        return _this;
    }
    Arithmetic.prototype.interpret = function (tree, table) {
        var left = this.exp1.interpret(tree, table);
        if (left instanceof Exception)
            return left;
        if (this.exp2 != null) {
            var right = this.exp2.interpret(tree, table);
            if (right instanceof Exception)
                return right;
            switch (this.operator) {
                case Arithmetic_operator.ADDITION:
                    if (this.exp1.get_type() === type.INT || this.exp1.get_type() === type.DOUBLE) {
                        switch (this.exp2.get_type()) {
                            case type.INT:
                                this.exp1.get_type() === type.INT ?
                                    this.type = type.INT :
                                    this.type = type.DOUBLE;
                                this.exp1.get_type() === type.INT ?
                                    this.value = String(parseInt(left) + parseInt(right)) :
                                    this.value = String(parseFloat(left) + parseFloat(right));
                                return this.value;
                            case type.DOUBLE:
                                this.type = type.DOUBLE;
                                this.value = String(parseFloat(left) + parseFloat(right));
                                break;
                            case type.CHAR:
                                this.exp1.get_type() === type.INT ?
                                    this.type = type.INT :
                                    this.type = type.DOUBLE;
                                this.exp1.get_type() === type.INT ?
                                    this.value = String(parseInt(left) + right.charCodeAt(0)) :
                                    this.value = String(parseFloat(left) + right.charCodeAt(0));
                                break;
                            default:
                                return new Exception("Semantic", "The type ".concat(this.exp2.get_type().toString(), " \n cannot be operated with type: INTEGER"), this.row, this.column);
                        }
                    }
                    else if (this.exp1.get_type() === type.CHAR) {
                        switch (this.exp2.get_type()) {
                            case type.INT:
                            case type.DOUBLE:
                                this.exp2.get_type() === type.INT ?
                                    this.type = type.INT :
                                    this.type = type.DOUBLE;
                                this.exp2.get_type() === type.INT ?
                                    this.value = String(parseInt(right) + left.charCodeAt(0)) :
                                    this.value = String(parseFloat(right) + left.charCodeAt(0));
                                break;
                            case type.CHAR:
                                this.type = type.INT;
                                this.value = String(left.charCodeAt() + right.charCodeAt());
                                break;
                        }
                    }
                    else if (this.exp1.get_type() === type.STRING ||
                        this.exp1.get_type() === type.BOOL ||
                        this.exp1.get_type() === type.NULL) {
                        return new Exception("Semantic", "The type ".concat(this.exp2.get_type().toString(), " \n cannot  be operated with type: ").concat(this.exp1.get_type().toString()), this.row, this.column);
                    }
            }
            switch (this.operator) {
                case Arithmetic_operator.SUBSTRACTION:
                case Arithmetic_operator.MULTIPLICATION:
                case Arithmetic_operator.DIVISION:
                case Arithmetic_operator.MODULS:
                    if (this.exp1.get_type() === type.INT) {
                        switch (this.exp2.get_type()) {
                            case type.INT:
                                this.type = type.INT;
                                this.value = this.operation(parseInt(left), parseInt(right), this.operator);
                                break;
                            case type.DOUBLE:
                                this.type = type.DOUBLE;
                                this.value = this.operation(parseFloat(left), parseFloat(right), this.operator);
                                break;
                            case type.CHAR:
                                this.type = type.CHAR;
                                this.value = this.operation(parseInt(left), right.charCodeAt(0), this.operator);
                                break;
                            default:
                                return new Exception("Semantic", "The type ".concat(this.exp2.get_type().toString(), " \n cannot be operated with type: INTEGER"), this.row, this.column);
                        }
                    }
                    else if (this.exp1.get_type() === type.DOUBLE) {
                        switch (this.exp2.get_type()) {
                            case type.INT:
                            case type.DOUBLE:
                                this.type = type.DOUBLE;
                                this.value = this.operation(parseFloat(left), parseFloat(right), this.operator);
                                break;
                            case type.CHAR:
                                this.type = type.DOUBLE;
                                this.value = this.operation(parseFloat(left), right.charCodeAt(0), this.operator);
                                break;
                            default:
                                return new Exception("Semantic", "The type ".concat(this.exp2.get_type().toString(), " \n cannot be operated with type: DOUBLE"), this.row, this.column);
                        }
                    }
                    else if (this.exp1.get_type() === type.CHAR) {
                        switch (this.exp2.get_type()) {
                            case type.INT:
                                this.type = type.INT;
                                this.value = this.operation(left.charCodeAt(0), parseInt(right), this.operator);
                                break;
                            case type.DOUBLE:
                                this.type = type.DOUBLE;
                                this.value = this.operation(parseFloat(left.charCodeAt(0)), parseFloat(right), this.operator);
                                break;
                            case type.CHAR:
                                this.type = type.INT;
                                this.value = this.operation(left.charCodeAt(0), right.charCodeAt(0), this.operator);
                                break;
                            default:
                                return new Exception("Semantic", "The type ".concat(this.exp2.get_type().toString(), " \n cannot be operated with type: CHAR"), this.row, this.column);
                        }
                    }
            }
        }
        else {
            var symbol = null;
            switch (this.operator) {
                case Arithmetic_operator.SUBSTRACTION:
                    switch (this.exp1.get_type()) {
                        case type.INT:
                            this.type = type.INT;
                            this.value = String(-parseInt(left));
                            break;
                        case type.DOUBLE:
                            this.type = type.DOUBLE;
                            this.value = String(-parseFloat(left));
                            break;
                        default:
                            return new Exception("Semantic", "The type ".concat(this.exp2.get_type().toString(), " \n cannot be operated with operator -"), this.row, this.column);
                    }
                    break;
                case Arithmetic_operator.INC:
                case Arithmetic_operator.DEC:
                    if (this.exp1 instanceof Identifier) {
                        switch (this.exp1.get_type()) {
                            case type.INT:
                                left = parseInt(left);
                                break;
                            case type.DOUBLE:
                                left = parseFloat(left);
                                break;
                            default:
                                return new Exception("Semantic", "The type: ".concat(this.exp1.get_type(), " \n cannot be operated whit operator: ").concat(this.operator), this.row, this.column);
                        }
                        if (this.operator === Arithmetic_operator.INC) {
                            symbol = new Symbol(this.exp1.get_id(), this.exp1.get_type(), this.row, this.column, String(left + 1));
                        }
                        else {
                            symbol = new Symbol(this.exp1.get_id(), this.exp1.get_type(), this.row, this.column, String(left - 1));
                        }
                        var result = table.update_table(symbol);
                        if (result instanceof Exception) {
                            return result;
                        }
                        this.type = this.exp1.get_type();
                        this.value = symbol.value;
                        return this.value;
                    }
                default:
                    return new Exception("Semantic", "Invalid operator: ".concat(this.operator.toString()), this.row, this.column);
            }
        }
        return this.value;
    };
    Arithmetic.prototype.operation = function (op1, op2, op) {
        switch (op) {
            case Arithmetic_operator.MULTIPLICATION:
                return String(op1 * op2);
            case Arithmetic_operator.SUBSTRACTION:
                return String(op1 - op2);
            case Arithmetic_operator.MODULS:
                return String(op1 % op2);
            case Arithmetic_operator.DIVISION:
                return String(op1 / op2);
            default:
                return "";
        }
    };
    Arithmetic.prototype.get_type = function () {
        return this.type;
    };
    Arithmetic.prototype.toString = function () {
        return this.value;
    };
    return Arithmetic;
}(Instruction));
export { Arithmetic };
