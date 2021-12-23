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
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
var ToLowerCase = /** @class */ (function (_super) {
    __extends(ToLowerCase, _super);
    function ToLowerCase(id, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.id = id;
        return _this;
    }
    ToLowerCase.prototype.interpret = function (tree, table) {
        var id_founded = this.id.interpret(tree, table);
        if (id_founded === null)
            return new Exception("Semantic", "Identifier not found in the current context", this.row, this.column, table.get_name());
        if (this.id.get_type() !== type.STRING)
            return new Exception("Semantic", "The type ".concat(id_founded.type, " not valid for Length"), this.row, this.column, table.get_name());
        this.type = type.STRING;
        return id_founded.toLowerCase();
    };
    ToLowerCase.prototype.get_node = function () {
        var node = new Cst_Node("ToLowerCase");
        node.add_childs_node(this.id.get_node());
        node.add_child(".");
        node.add_child("toLowercase");
        node.add_child("(");
        node.add_child(")");
        return node;
    };
    return ToLowerCase;
}(Function));
export { ToLowerCase };
