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
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
import { Value } from "../Abstract/Value.js";
var ToInt = /** @class */ (function (_super) {
    __extends(ToInt, _super);
    function ToInt(expression, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.expression = expression;
        return _this;
    }
    ToInt.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        if (value instanceof Exception) {
            return value;
        }
        if (this.expression.get_type() !== type.DOUBLE) {
            return new Exception("Semantic", "The param: ".concat(value, " isn't of type double"), this.expression.row, this.expression.column, table.get_name());
        }
        this.type = type.INT;
        return parseInt(value);
    };
    ToInt.prototype.get_node = function () {
        var node = new Cst_Node("ToInt");
        node.add_child("toInt");
        node.add_child("(");
        node.add_childs_node(this.expression.get_node());
        node.add_child(")");
        return node;
    };
    ToInt.prototype.compile = function (table, generator, tree) {
        var exp = this.expression.compile(table, generator, tree);
        var temp = generator.addTemp();
        generator.toInt(temp, exp.value);
        return new Value(temp, this.type, false);
    };
    return ToInt;
}(Function));
export { ToInt };
