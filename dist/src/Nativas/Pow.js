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
var Pow = /** @class */ (function (_super) {
    __extends(Pow, _super);
    function Pow(exp1, exp2, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        return _this;
    }
    Pow.prototype.interpret = function (tree, table) {
        var base = this.exp1.interpret(tree, table);
        if (base instanceof Exception) {
            return base;
        }
        var pow = this.exp2.interpret(tree, table);
        if (pow instanceof Exception) {
            return pow;
        }
        if (this.exp1.get_type() !== type.INT && this.exp1.get_type() !== type.DOUBLE) {
            return new Exception("Semanitc", "The base: ".concat(base, " can only be of type int|double"), this.exp1.row, this.exp1.column, table.get_name());
        }
        if (this.exp2.get_type() !== type.INT) {
            return new Exception("Semantic", "The pow: ".concat(pow, " can only be of type int"), this.exp2.row, this.exp2.column, table.get_name());
        }
        this.type = this.exp1.get_type();
        return Math.pow(base, pow);
    };
    Pow.prototype.get_node = function () {
        var node = new Cst_Node("Pow");
        node.add_child("pow");
        node.add_child("(");
        node.add_childs_node(this.exp1.get_node());
        node.add_child(",");
        node.add_childs_node(this.exp2.get_node());
        node.add_child(")");
        return node;
    };
    return Pow;
}(Function));
export { Pow };
