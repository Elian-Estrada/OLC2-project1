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
import { Relational_operator, type } from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Value } from "../Abstract/Value.js";
import { Access_struct } from "./Access_struct.js";
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
    Relational.prototype.compile = function (table, generator) {
        var left = this.exp1.compile(table, generator);
        if (left instanceof Exception)
            return left;
        var right = null;
        var res = new Value(null, type.BOOL, false);
        var operator = this.operator;
        if (left.type != type.BOOL) {
            right = this.exp2.compile(table, generator);
            if (left.type == type.INT || left.type == type.DOUBLE) {
                switch (right.type) {
                    case type.INT:
                    case type.DOUBLE:
                        this.checkLabels(generator, left);
                        generator.addIf(left.value, right.value, operator, left.label_true);
                        generator.addGoTo(left.label_false);
                }
            }
            if (left.type == type.STRING && right.type == type.STRING) {
                generator.compareString();
                var param_temp = generator.addTemp();
                generator.addExpression(param_temp, 'P', table.get_size(), '+');
                generator.addExpression(param_temp, param_temp, '1', '+');
                generator.setStack(param_temp, left.value);
                generator.addExpression(param_temp, param_temp, '1', '+');
                generator.setStack(param_temp, right.value);
                generator.newEnv(table.get_size());
                generator.callFunc('compareStr');
                var temp = generator.addTemp();
                generator.getStack(temp, 'P');
                generator.setEnv(table.get_size());
                var true_label = generator.newLabel();
                var false_label = generator.newLabel();
                if (this.operator == Relational_operator.EQUAL) {
                    generator.addIf(temp, '0', '==', false_label);
                    generator.addGoTo(true_label);
                    var res_1 = new Value(temp, type.BOOL, true);
                    res_1.true_label = true_label;
                    res_1.false_label = false_label;
                    return res_1;
                }
                if (this.operator == Relational_operator.UNEQUAL) {
                    generator.addIf(temp, '0', '!=', false_label);
                    generator.addGoTo(true_label);
                    var res_2 = new Value(temp, type.BOOL, true);
                    res_2.true_label = true_label;
                    res_2.false_label = false_label;
                    return res_2;
                }
            }
        }
        else {
            var goto_right = generator.newLabel();
            var left_temp = generator.addTemp();
            generator.setLabel(left.true_label);
            generator.addExpression(left_temp, '1', '', '');
            generator.addGoTo(goto_right);
            generator.setLabel(left.false_label);
            generator.addExpression(left_temp, '0', '', '');
            generator.setLabel(goto_right);
            var right_1 = this.exp2.compile(table, generator);
            if (right_1.get_type() != type.BOOL) {
                generator.addError('Relational: Operator must be boolean', Number(this.row), Number(this.column));
                return;
            }
            var goto_end = generator.newLabel();
            var right_temp = generator.addTemp();
            generator.setLabel(right_1.true_label);
            generator.addExpression(right_temp, '1', '', '');
            generator.addGoTo(goto_end);
            generator.setLabel(right_1.false_label);
            generator.addExpression(right_temp, '0', '', '');
            generator.setLabel(goto_end);
            this.checkLabels(generator, left);
            generator.addIf(left_temp, right_temp, this.operator, left.label_true);
            generator.addGoTo(left.label_false);
        }
        res.true_label = left.label_true;
        res.false_label = left.label_false;
        return res;
    };
    Relational.prototype.checkLabels = function (generator, value) {
        value.label_true = generator.newLabel();
        value.label_false = generator.newLabel();
    };
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
                    if (this.exp1.get_type() === type.STRUCT && this.exp1 instanceof Access_struct) {
                        left = left.get_value();
                    }
                    if (left.value == "null") {
                        left = left.value;
                    }
                    if (this.exp2.get_type() === type.STRUCT && this.exp2 instanceof Access_struct) {
                        right = right.get_vale();
                    }
                    if (right.value == "null") {
                        right = right.get_value();
                    }
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
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(this.exp1.get_type()), this.row, this.column, table.get_name());
                            }
                        case type.CHAR:
                            switch (this.exp2.get_type()) {
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(left.charCodeAt(), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(this.exp1.get_type()), this.row, this.column, table.get_name());
                            }
                        case type.STRING:
                            switch (this.exp2.get_type()) {
                                case type.STRING:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(type.STRING), this.row, this.column, table.get_name());
                            }
                        case type.BOOL:
                            switch (this.exp2.get_type()) {
                                case type.BOOL:
                                    return this.to_lower(JSON.parse(left), JSON.parse(right), this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(type.BOOL), this.row, this.column, table.get_name());
                            }
                        case type.ARRAY:
                            switch (this.exp2.get_type()) {
                                case type.ARRAY:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(type.ARRAY), this.row, this.column, table.get_name());
                            }
                        case type.STRUCT:
                            switch (this.exp2.get_type()) {
                                case type.NULL:
                                    //return this.to_lower(left.get_value(), right, this.operator);
                                    return this.to_lower(left, right, this.operator);
                                case type.STRUCT:
                                    //return this.to_lower(left.get_value(), right.get_value(), this.operator);
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(type.STRUCT), this.exp2.row, this.exp2.column, table.get_name());
                            }
                        case type.NULL:
                            switch (this.exp2.get_type()) {
                                case type.NULL:
                                    return this.to_lower(left, right, this.operator);
                                case type.STRUCT:
                                    //return this.to_lower(left, right.get_value(), this.operator);
                                    return this.to_lower(left, right, this.operator);
                                case type.STRING:
                                    return this.to_lower(left, right, this.operator);
                                case type.CHAR:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(type.NULL), this.exp2.row, this.exp2.column, table.get_name());
                            }
                        default:
                            return new Exception("Semantic", "The type: ".concat(this.exp1.get_type(), " cannot be operated whit operator: ").concat(this.operator), this.exp1.row, this.exp2.row, table.get_name());
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
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(this.exp1.get_type()), this.row, this.column, table.get_name());
                            }
                        case type.CHAR:
                            switch (this.exp2.get_type()) {
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(left.charCodeAt(), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", "The type: ".concat(this.exp2.get_type(), " cannot be operated whit type: ").concat(this.exp1.get_type()), this.row, this.column, table.get_name());
                            }
                        default:
                            return new Exception("Semantic", "The type: ".concat(this.exp1.get_type(), " cannot be operated whit operator: ").concat(this.operator), this.row, this.column, table.get_name());
                    }
            }
        }
        else {
            return new Exception("Semantic", "Expression Expected", this.row, this.column, table.get_name());
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
    Relational.prototype.get_node = function () {
        var node = new Cst_Node("Expression Relational");
        node.add_childs_node(this.exp1.get_node());
        node.add_child(this.operator);
        node.add_childs_node(this.exp2.get_node());
        return node;
    };
    Relational.prototype.toString = function () {
        return String(this.value);
    };
    return Relational;
}(Instruction));
export { Relational };
