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
var Case = /** @class */ (function (_super) {
    __extends(Case, _super);
    function Case(expr, instructions, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.expr = expr;
        _this.instructions = instructions;
        return _this;
    }
    Case.prototype.interpret = function (tree, table) {
        return this.expr.interpret(tree, table);
    };
    Case.prototype.get_instructions = function () {
        return this.instructions;
    };
    Case.prototype.get_value = function () {
        return this.expr;
    };
    return Case;
}(Instruction));
export { Case };
