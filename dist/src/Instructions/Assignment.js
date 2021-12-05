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
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import { type } from "../SymbolTable/Type.js";
var Assignment = /** @class */ (function (_super) {
    __extends(Assignment, _super);
    function Assignment(id, expression, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.id = id;
        _this.expression = expression;
        return _this;
    }
    Assignment.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        if (value instanceof Exception) {
            return value;
        }
        if (this.expression.get_type() === type.ARRAY) {
            //array implemented
        }
        var new_symbol = new Symbol(this.id, this.expression.get_type(), this.row, this.column, value);
        var result = table.update_table(new_symbol);
        if (result instanceof Exception) {
            return result;
        }
        return undefined;
    };
    Assignment.prototype.get_id = function () {
        return this.id;
    };
    Assignment.prototype.get_expression = function () {
        return this.expression;
    };
    return Assignment;
}(Instruction));
export { Assignment };
