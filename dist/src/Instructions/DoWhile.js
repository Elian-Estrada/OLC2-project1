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
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
import { Continue } from "./Continue.js";
import { Break } from "./Break.js";
import { Return } from "./Return.js";
var DoWhile = /** @class */ (function (_super) {
    __extends(DoWhile, _super);
    function DoWhile(expr, instructions, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.expr = expr;
        _this.instructions = instructions;
        _this.counter = 0;
        return _this;
    }
    DoWhile.prototype.interpret = function (tree, table) {
        do {
            var flag = this.expr.interpret(tree, table);
            if (flag instanceof Exception)
                return flag;
            if (this.expr.get_type() == type.BOOL) {
                if (String(flag) == "true") {
                    var new_table = new SymbolTable(table, "DoWhile-".concat(this.row, "-").concat(this.column));
                    for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
                        var item = _a[_i];
                        var inst = item.interpret(tree, new_table);
                        if (inst instanceof Exception) {
                            tree.get_errors().push(inst);
                            tree.update_console(inst.toString());
                        }
                        if (inst instanceof Continue) {
                            break;
                        }
                        else if (inst instanceof Break) {
                            return null;
                        }
                        else if (inst instanceof Return) {
                            return inst;
                        }
                    }
                }
                else {
                    break;
                }
            }
            else {
                return new Exception("Semantic", "Expect a Boolean type expression. Not ".concat(this.expr.get_type().name), this.row, this.column);
            }
            this.counter += 1;
        } while (true);
    };
    return DoWhile;
}(Instruction));
export { DoWhile };
