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
var Parse = /** @class */ (function (_super) {
    __extends(Parse, _super);
    function Parse(data_type, exp, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.data_type = data_type;
        _this.exp = exp;
        return _this;
    }
    Parse.prototype.interpret = function (tree, table) {
        var value = this.exp.interpret(tree, table);
        if (this.data_type === type.INT)
            return parseInt(value);
        else if (this.data_type === type.DOUBLE)
            return parseFloat(value);
        else if (this.data_type === type.BOOL)
            return (value === "true");
        else if (this.data_type === type.CHAR)
            return value.replace("", '');
        else
            return new Exception("Semantic", "Data type not compatible", this.row, this.column);
    };
    Parse.prototype.get_node = function () {
        var node = new Cst_Node("Parse");
        node.add_child(this.data_type);
        node.add_child("parse");
        node.add_child("(");
        node.add_childs_node(this.exp.get_node());
        node.add_child(")");
        return node;
    };
    return Parse;
}(Instruction));
export { Parse };
