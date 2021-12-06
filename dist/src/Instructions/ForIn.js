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
var ForIn = /** @class */ (function (_super) {
    __extends(ForIn, _super);
    function ForIn(firstExp, secondExp, instructions, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.firsExp = firstExp;
        _this.secondExp = secondExp;
        _this.instructions = instructions;
        _this.counter = 0;
        return _this;
    }
    ForIn.prototype.interpret = function (tree, table) {
    };
    return ForIn;
}(Instruction));
export { ForIn };
