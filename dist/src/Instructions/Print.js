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
var Print = /** @class */ (function (_super) {
    __extends(Print, _super);
    function Print(expression, row, col, flag) {
        if (flag === void 0) { flag = true; }
        var _this = _super.call(this, row, col) || this;
        _this.expression = expression;
        _this.flag = flag;
        return _this;
    }
    Print.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        if (value instanceof Exception)
            return value;
        if (this.expression.get_type() == type.ARRAY) {
            //return new Exception("Semantic", "Don't print array", this.row, this.column);
            console.log(value.get_value());
            value = JSON.stringify(value.get_value());
        }
        else if (this.expression.get_type() == type.NULL) {
            return new Exception("Semantic", "Null Pointer Exception", this.row, this.column);
        }
        tree.update_console("".concat(value), this.flag);
    };
    return Print;
}(Instruction));
export { Print };
