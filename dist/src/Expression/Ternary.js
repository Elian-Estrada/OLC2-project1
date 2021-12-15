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
import { type } from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
var Ternary = /** @class */ (function (_super) {
    __extends(Ternary, _super);
    function Ternary(expr, exp_if_true, exp_if_false, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.expr = expr;
        _this.exp_if_true = exp_if_true;
        _this.exp_if_false = exp_if_false;
        return _this;
    }
    Ternary.prototype.interpret = function (tree, table) {
        var flag = this.expr.interpret(tree, table);
        if (this.expr.get_type() === type.BOOL) {
            // let new_table = new SymbolTable(table, `Ternary-${this.row}-${this.column}`);
            if (JSON.parse(String(flag))) {
                var res_if_true = this.exp_if_true.interpret(tree, table);
                if (res_if_true instanceof Exception)
                    return res_if_true;
                this.value = res_if_true;
            }
            else {
                var res_if_false = this.exp_if_false.interpret(tree, table);
                if (res_if_false instanceof Exception)
                    return res_if_false;
                this.value = res_if_false;
            }
        }
        return this.value;
    };
    Ternary.prototype.get_type = function () {
        return this.exp_if_false.get_type();
    };
    Ternary.prototype.compile = function (table, generator) {
    };
    Ternary.prototype.get_node = function () {
        var node = new Cst_Node("Ternary");
        node.add_child("(");
        node.add_childs_node(this.expr.get_node());
        node.add_child(")");
        node.add_child("?");
        node.add_childs_node(this.exp_if_true.get_node());
        node.add_child(":");
        node.add_childs_node(this.exp_if_false.get_node());
        return node;
    };
    Ternary.prototype.toString = function () {
        return String(this.value);
    };
    return Ternary;
}(Instruction));
export { Ternary };
