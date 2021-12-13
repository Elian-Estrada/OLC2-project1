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
var Identifier = /** @class */ (function (_super) {
    __extends(Identifier, _super);
    function Identifier(id, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.id = id;
        _this.value = "null";
        _this.type = type.NULL;
        return _this;
    }
    Identifier.prototype.interpret = function (tree, table) {
        var symbol = table.get_table(this.id);
        if (symbol == undefined) {
            return new Exception("Semantic", "The id: ".concat(this.id, " doesn't exist in current context"), this.row, this.column);
        }
        this.type = symbol.type;
        this.value = symbol.value;
        return this.value;
    };
    Identifier.prototype.get_type = function () {
        return this.type;
    };
    Identifier.prototype.get_id = function () {
        return this.id;
    };
    Identifier.prototype.get_value = function () {
        return this.value;
    };
    Identifier.prototype.toString = function () {
        return this.value;
    };
    return Identifier;
}(Instruction));
export { Identifier };
