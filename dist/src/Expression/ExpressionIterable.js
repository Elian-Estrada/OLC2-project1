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
var ExpressionIterable = /** @class */ (function (_super) {
    __extends(ExpressionIterable, _super);
    function ExpressionIterable(exp1, exp2, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        return _this;
    }
    ExpressionIterable.prototype.compile = function (table, generator, tree) {
        var val1 = this.exp1.compile(table, generator, tree);
        var val2 = this.exp2.compile(table, generator, tree);
        var lis_aux = [];
        lis_aux.push(val1);
        lis_aux.push(val2);
        return lis_aux;
    };
    ExpressionIterable.prototype.get_node = function () {
    };
    ExpressionIterable.prototype.interpret = function (tree, table) {
    };
    return ExpressionIterable;
}(Instruction));
export { ExpressionIterable };
