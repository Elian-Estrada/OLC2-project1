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
var Length = /** @class */ (function (_super) {
    __extends(Length, _super);
    function Length(id, type_fun, name, params, instructions, row, col) {
        var _this = _super.call(this, type_fun, name, params, instructions, row, col) || this;
        _this.id = id;
        return _this;
    }
    Length.prototype.interpret = function (tree, table) {
        var id_founded = this.id.interpret(tree, table);
        if (id_founded === null)
            return new Exception("Semantic", "Identifier not found in the current context", this.row, this.column);
        // console.log(this.id.get_type() == type.STRING)
        if (this.id.get_type() !== type.STRING && this.id.get_type() !== type.ARRAY)
            return new Exception("Semantic", "The type ".concat(id_founded.type, " not valid for Length"), this.row, this.column);
        if (this.id.get_type() === type.ARRAY) {
            id_founded = id_founded.get_value();
        }
        this.type = type.INT;
        return id_founded.length;
    };
    return Length;
}(Function));
export { Length };
