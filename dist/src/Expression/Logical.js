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
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import { Logical_operator, type } from "../SymbolTable/Type.js";
import { Value } from "../Abstract/Value.js";
var Logical = /** @class */ (function (_super) {
    __extends(Logical, _super);
    function Logical(exp1, exp2, operator, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        _this.operator = operator;
        _this.type = type.BOOL;
        _this.value = "";
        return _this;
    }
    Logical.prototype.interpret = function (tree, table) {
        var left = this.exp1.interpret(tree, table);
        if (left instanceof Exception) {
        }
        if (this.exp2 != null) {
            var right = this.exp2.interpret(tree, table);
            if (right instanceof Exception) {
                return right;
            }
            if (this.exp1.get_type() === type.BOOL && this.exp2.get_type() === type.BOOL) {
                switch (this.operator) {
                    case Logical_operator.AND:
                        this.value = String(JSON.parse(left) && JSON.parse(right)).toLowerCase();
                        return this.value;
                    case Logical_operator.OR:
                        this.value = String(JSON.parse(left) || JSON.parse(right)).toLowerCase();
                        return this.value;
                }
            }
            else {
                return new Exception("Semantic", "This operators only work whit type boolean", this.row, this.column);
            }
        }
        else {
            if (this.exp1.get_type() == type.BOOL) {
                this.value = String(!JSON.parse(left)).toLowerCase();
                return this.value;
            }
            else {
                return new Exception("Semantic", "The type: ".concat(this.exp1.get_type(), " does not work whit operator: ").concat(this.operator), this.row, this.column);
            }
        }
    };
    Logical.prototype.compile = function (table, generator) {
        var temp = generator.addTemp();
        var operation = this.operator;
        var type_op = null;
        var val_return = null;
        if (this.operator === Logical_operator.AND) {
            var left = this.exp1.compile(table, generator);
            type_op = type.BOOL;
            val_return = new Value(temp, type_op, true);
            if (JSON.parse(this.exp1.value) && JSON.parse(this.exp2.value)) {
                // @ts-ignore
                val_return.true_label = left.true_label;
                val_return.false_label = left.false_label;
            }
            else {
                // @ts-ignore
                val_return.true_label = left.false_label;
                val_return.false_label = left.true_label;
            }
        }
        // @ts-ignore
        val_return.value = JSON.parse(this.exp1.value) && JSON.parse(this.exp2.value);
        return val_return;
    };
    Logical.prototype.checkLabels = function (generator, value) {
        value.label_true = generator.newLabel();
        value.label_false = generator.newLabel();
    };
    Logical.prototype.get_type = function () {
        return this.type;
    };
    Logical.prototype.compile = function (table, generator) {
    };
    Logical.prototype.get_node = function () {
        var node = new Cst_Node("Expression Logic");
        if (this.exp2 !== null) {
            node.add_childs_node(this.exp1.get_node());
            node.add_child(this.operator);
            node.add_childs_node(this.exp2.get_node());
        }
        else {
            node.add_child("!");
            node.add_childs_node(this.exp1.get_node());
        }
        return node;
    };
    Logical.prototype.toString = function () {
        return String(this.value);
    };
    return Logical;
}(Instruction));
export { Logical };
