import { type } from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
var Print = /** @class */ (function () {
    function Print(expression, row, col) {
        this.expression = expression;
        this.row = row;
        this.col = col;
    }
    Print.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        if (value instanceof Error)
            return value;
        if (this.expression.getType() == type.ARRAY) {
            return new Exception("Semantic", "Don't print array", this.row, this.col);
        }
        else if (this.expression.getType() == type.NULL) {
            return new Exception("Semantic", "Null Pointer Exception", this.row, this.col);
        }
        tree.update_console("> ".concat(value.toString()));
    };
    return Print;
}());
export { Print };
