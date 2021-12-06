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
var Declaration_array = /** @class */ (function (_super) {
    __extends(Declaration_array, _super);
    function Declaration_array(row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.id = "";
        _this.type = type.ARRAY;
        _this.type_array = _this.type;
        _this.expression = [];
        _this.list_expression = [];
        return _this;
    }
    Declaration_array.prototype.interpret = function (tree, table) {
    };
    return Declaration_array;
}(Instruction));
export { Declaration_array };
