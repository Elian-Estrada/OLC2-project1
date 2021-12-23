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
var Pop = /** @class */ (function (_super) {
    __extends(Pop, _super);
    function Pop(id, expression, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.id = id;
        return _this;
    }
    Pop.prototype.interpret = function (tree, table) {
        var symbol = this.id.interpret(tree, table);
        if (symbol instanceof Exception) {
            return symbol;
        }
        if (symbol.get_type() !== type.ARRAY) {
            return new Exception("Semantic", "This function is only for arrays", this.id.row, this.id.column, table.get_name());
        }
        this.type = symbol.get_subtype();
        return symbol.get_value().pop();
    };
    Pop.prototype.get_node = function () {
        var node = new Cst_Node("Pop");
        node.add_childs_node(this.id.get_node());
        node.add_child(".");
        node.add_child("pop");
        node.add_child("(");
        node.add_child(")");
        return node;
    };
    return Pop;
}(Function));
export { Pop };
