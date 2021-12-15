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
import { type } from "../SymbolTable/Type.js";
var Inc_Dec = /** @class */ (function (_super) {
    __extends(Inc_Dec, _super);
    function Inc_Dec(expression, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.expression = expression;
        _this.type = type.NULL;
        return _this;
    }
    Inc_Dec.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        if (value instanceof Exception) {
            return value;
        }
        this.type = this.expression.get_type();
        return value;
    };
    Inc_Dec.prototype.compile = function (table, generator) {
    };
    Inc_Dec.prototype.get_node = function () {
        var node = new Cst_Node("Incremento_Decremento");
        node.add_childs_node(this.expression.get_node());
        return node;
    };
    return Inc_Dec;
}(Instruction));
export { Inc_Dec };
