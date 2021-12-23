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
var Push = /** @class */ (function (_super) {
    __extends(Push, _super);
    function Push(id, expression, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.id = id;
        _this.expression = expression;
        return _this;
    }
    Push.prototype.interpret = function (tree, table) {
        var symbol = this.id.interpret(tree, table);
        if (symbol instanceof Exception) {
            return symbol;
        }
        var value = this.expression.interpret(tree, table);
        if (value instanceof Exception) {
            return value;
        }
        if (symbol.get_type() === type.ARRAY && symbol.get_subtype() !== this.expression.get_type()) {
            return new Exception("Semantic", "The type: ".concat(this.expression.get_type(), " cannot be assignment to array of type: ").concat(symbol.get_subtype()), this.expression.row, this.expression.column, table.get_name());
        }
        else if (symbol.get_type() !== type.ARRAY) {
            return new Exception("Semantic", "This function is only for arrays", this.id.row, this.id.column, table.get_name());
        }
        switch (this.expression.get_type()) {
            case type.INT:
                value = parseInt(value);
                break;
            case type.DOUBLE:
                value = parseFloat(value);
                break;
            case type.BOOL:
                value = JSON.parse(value);
                break;
        }
        symbol.get_value().push(value);
        return null;
    };
    Push.prototype.get_node = function () {
        var node = new Cst_Node("Push");
        node.add_childs_node(this.id.get_node());
        node.add_child(".");
        node.add_child("push");
        node.add_child("(");
        node.add_childs_node(this.expression.get_node());
        node.add_child(")");
        return node;
    };
    return Push;
}(Function));
export { Push };
