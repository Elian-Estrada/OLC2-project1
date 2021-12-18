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
import Exception from "../SymbolTable/Exception.js";
import { String_operator, type } from "../SymbolTable/Type.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Value } from "../Abstract/Value.js";
var StringText = /** @class */ (function (_super) {
    __extends(StringText, _super);
    function StringText(exp1, exp2, operator, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.operator = operator;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        _this.value = "";
        _this.type = null;
        return _this;
    }
    StringText.prototype.compile = function (table, generator) {
        generator.addComment("----STRING EXPRESSION----");
        var left = this.exp1.compile(table, generator);
        var right = this.exp2.compile(table, generator);
        var temp = generator.addTemp();
        var operation = this.operator;
        if (operation === String_operator.CONCAT) {
            if (this.exp1.get_type() === type.STRING && this.exp2.get_type() === type.STRING) {
                generator.concatString();
                var paramTemp = generator.addTemp();
                generator.addExpression(paramTemp, 'P', table.get_size(), '+');
                // Valor izquierda
                generator.addExpression(paramTemp, paramTemp, '1', '+');
                generator.setStack(paramTemp, left.value);
                // Valor derecha
                generator.addExpression(paramTemp, paramTemp, '1', '+');
                generator.setStack(paramTemp, right.value);
                generator.newEnv(table.get_size());
                generator.callFunc('concatString');
                var temp_1 = generator.addTemp();
                generator.getStack(temp_1, 'P');
                generator.setEnv(table.get_size());
                return new Value(temp_1, type.STRING, true);
            }
            else {
                generator.addExpression(temp, left.value, right.value, "+");
                var type_ret = type.STRING;
                return new Value(temp, type_ret, true);
            }
        }
        else if (operation === String_operator.REPETITION) {
            generator.repString();
            var param_temp = generator.addTemp();
            generator.addExpression(param_temp, 'P', table.get_size(), '+');
            generator.addExpression(param_temp, param_temp, '1', '+');
            generator.setStack(param_temp, left.value);
            generator.addExpression(param_temp, param_temp, '1', '+');
            generator.setStack(param_temp, right.value);
            generator.newEnv(table.get_size());
            generator.callFunc('repetitionStr');
            var temp_2 = generator.addTemp();
            generator.getStack(temp_2, 'P');
            generator.setEnv(table.get_size());
            return new Value(temp_2, type.STRING, true);
        }
    };
    StringText.prototype.interpret = function (tree, table) {
        var left = this.exp1.interpret(tree, table);
        if (left instanceof Exception)
            return left;
        if (this.exp2 != null) {
            var right = this.exp2.interpret(tree, table);
            if (right instanceof Exception)
                return right;
            switch (this.operator) {
                case String_operator.CONCAT:
                    switch (this.exp1.get_type()) {
                        case type.INT:
                        case type.DOUBLE:
                        case type.BOOL:
                        case type.CHAR:
                        case type.NULL:
                            if (this.exp2.get_type() == type.STRING) {
                                this.type = type.STRING;
                                this.value = left.toString() + right.toString();
                            }
                            else
                                return new Exception("Semantic", "The type: ".concat(this.exp1.get_type(), " \n cannot be concatenated whit type: ").concat(this.exp2.get_type()), this.row, this.column);
                            break;
                    }
                    if (this.exp1.get_type() == type.STRING) {
                        switch (this.exp2.get_type()) {
                            case type.INT:
                            case type.DOUBLE:
                            case type.BOOL:
                            case type.CHAR:
                            case type.STRING:
                            case type.NULL:
                                this.type = type.STRING;
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception("Semantic", "The type ".concat(this.exp2.get_type().toString(), " cannot be operated with type: STRING"), this.row, this.column);
                        }
                    }
                    break;
                case String_operator.REPETITION:
                    if (this.exp1.get_type() === type.STRING && this.exp2.get_type() === type.INT) {
                        this.type = type.STRING;
                        this.value = left.repeat(right);
                    }
                    else {
                        return new Exception("Semantic", "This operation cannot be performed", this.row, this.column);
                    }
                    break;
            }
        }
        return this.value;
    };
    StringText.prototype.operation = function (op1, op2, op) {
        switch (op) {
            case String_operator.CONCAT:
                return String(op1 + op2);
            case String_operator.REPETITION:
                return String(op1.repeat(op2));
            default:
                return "";
        }
    };
    StringText.prototype.get_type = function () {
        return this.type;
    };
    StringText.prototype.get_node = function () {
        var node = new Cst_Node("Concat");
        node.add_childs_node(this.exp1.get_node());
        node.add_child(this.operator);
        node.add_childs_node(this.exp2.get_node());
        return node;
    };
    StringText.prototype.toString = function () {
        return String(this.value);
    };
    return StringText;
}(Instruction));
export { StringText };
