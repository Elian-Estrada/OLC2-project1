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
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Value } from "../Abstract/Value.js";
import { Primitive } from "./Primitive.js";
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
    Arithmetic.prototype.compile = function (table, generator) {
        var left = this.exp1.compile(table, generator);
        if (this.exp2 !== null) {
            var right = this.exp2.compile(table, generator);
            var temp = generator.addTemp();
            var operation = this.operator;
            if ((left.type == type.INT || left.type == type.DOUBLE) &&
                (right.type == type.INT || right.type == type.DOUBLE)) {
                generator.addExpression(temp, left.value, right.value, operation);
                var type_op = type.INT;
                // generator.setLabel(label_exit);
                return new Value(temp, type_op, true);
            }
        }
        else {
            if (this.operator === Arithmetic_operator.INC) {
                var new_prim = new Primitive('1', type.INT, this.row, this.column);
                var new_symbol = new Arithmetic(this.exp1, new_prim, Arithmetic_operator.ADDITION, this.row, this.column);
                var new_val = new_symbol.compile(table, generator);
                return new Value(new_val.value, type.INT, false);
            }
            else if (this.operator === Arithmetic_operator.DEC) {
                var new_prim = new Primitive('1', type.INT, this.row, this.column);
                var new_symbol = new Arithmetic(this.exp1, new_prim, Arithmetic_operator.SUBSTRACTION, this.row, this.column);
                var new_val = new_symbol.compile(table, generator);
                return new Value(new_val.value, type.INT, false);
            }
        }
        return null;
    };
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
                        this.value = left;
                        return left;
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
                return this.type === type.INT ? parseInt(String(op1 / op2)).toString() : String(op1 / op2);
            default:
                return "";
        }
    };
    Arithmetic.prototype.get_type = function () {
        return this.type;
    };
    Arithmetic.prototype.get_node = function () {
        var node = new Cst_Node("Expression Arithmetic");
        if (this.exp2 !== null) {
            node.add_childs_node(this.exp1.get_node());
            node.add_child(this.operator);
            node.add_childs_node(this.exp2.get_node());
        }
        else {
            switch (this.operator) {
                case Arithmetic_operator.INC:
                case Arithmetic_operator.DEC:
                    node.add_childs_node(this.exp1.get_node());
                    node.add_child(this.operator);
                    break;
                default:
                    node.add_child("-");
                    node.add_childs_node(this.exp1.get_node());
                    break;
            }
        }
        return node;
    };
    Arithmetic.prototype.toString = function () {
        return String(this.value);
    };
    return Arithmetic;
}(Instruction));
export { Arithmetic };
