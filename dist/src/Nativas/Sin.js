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
var Sin = /** @class */ (function (_super) {
    __extends(Sin, _super);
    function Sin(expression, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.expression = expression;
        return _this;
    }
    Sin.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        if (value instanceof Exception) {
            return value;
        }
        if (this.expression.get_type() !== type.INT && this.expression.get_type() !== type.DOUBLE) {
            return new Exception("Semantic", "The expression: ".concat(value, " can be only type: int|double"), this.expression.row, this.expression.column, table.get_name());
        }
        this.type = type.DOUBLE;
        //return Math.sin((value * Math.PI) / 180);
        return Math.sin(value);
    };
    return Sin;
}(Function));
export { Sin };
