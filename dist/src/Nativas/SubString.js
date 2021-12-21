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
var SubString = /** @class */ (function (_super) {
    __extends(SubString, _super);
    function SubString(id, from, to, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.id = id;
        _this.from = from;
        _this.to = to;
        return _this;
    }
    SubString.prototype.interpret = function (tree, table) {
        var id_founded = this.id.interpret(tree, table);
        if (id_founded === null)
            return new Exception("Semantic", "Identifier not found in the current context", this.row, this.column, table.get_name());
        if (this.id.get_type() !== type.STRING)
            return new Exception("Semantic", "The type ".concat(id_founded.type, " not valid for Length"), this.row, this.column, table.get_name());
        var from = this.from.interpret(tree, table);
        if (from instanceof Exception) {
            return from;
        }
        if (this.from.get_type() !== type.INT) {
            return new Exception("Semantic", "The expression can be only of type: int", this.from.row, this.from.column, table.get_name());
        }
        if (from > id_founded.length || from < 0) {
            return new Exception("Semantic", "The index: ".concat(from, " out of range"), this.from.row, this.from.column, table.get_name());
        }
        var to = this.to.interpret(tree, table);
        if (to instanceof Exception) {
            return to;
        }
        if (this.to.get_type() !== type.INT) {
            return new Exception("Semantic", "The expression can be only of type: int", this.to.row, this.to.column, table.get_name());
        }
        // @ts-ignore
        to = parseInt(to) + 1;
        if (to > id_founded.length) {
            return new Exception("Semantic", "The index: ".concat(to - 1, " out of range"), this.row, this.column, table.get_name());
        }
        this.type = type.STRING;
        return id_founded.substring(from, to);
    };
    return SubString;
}(Function));
export { SubString };
