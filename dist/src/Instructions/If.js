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
import { type } from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import { Continue } from "./Continue.js";
import { Break } from "./Break.js";
import { Return } from "./Return.js";
var If = /** @class */ (function (_super) {
    __extends(If, _super);
    function If(expr, instructions, else_instr, elseif, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.expr = expr;
        _this.instructions = instructions;
        _this.else_instr = else_instr;
        _this.elseif = elseif;
        return _this;
    }
    If.prototype.interpret = function (tree, table) {
        var flag = this.expr.interpret(tree, table);
        // console.log(flag);
        if (flag instanceof Exception) {
            return flag;
        }
        if (this.expr.get_type() === type.BOOL) {
            if (JSON.parse(String(flag))) {
                var new_table = new SymbolTable(table, "If - ".concat(this.row, "-").concat(this.column));
                // console.log(this.instructions)
                for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
                    var item = _a[_i];
                    // console.log(item);
                    var instruction = item.interpret(tree, new_table);
                    // console.log(instruction)
                    if (instruction === "void")
                        return "void";
                    if (instruction instanceof Exception) {
                        tree.get_errors().push(instruction);
                        tree.update_console(instruction.toString());
                    }
                    else {
                        if ((instruction instanceof Continue) ||
                            (instruction instanceof Break) ||
                            (instruction instanceof Return)) {
                            return instruction;
                        }
                    }
                }
            }
            else {
                if (this.else_instr != null) {
                    var new_table = new SymbolTable(table, "Else-".concat(this.row, "-").concat(this.column));
                    for (var _b = 0, _c = this.else_instr; _b < _c.length; _b++) {
                        var item = _c[_b];
                        var instruction_else = item.interpret(tree, new_table);
                        if (instruction_else instanceof Exception) {
                            tree.get_errors().push(instruction_else);
                            tree.update_console(instruction_else.toString());
                        }
                        else {
                            if ((instruction_else instanceof Continue) ||
                                (instruction_else instanceof Break) ||
                                (instruction_else instanceof Return)) {
                                return instruction_else;
                            }
                        }
                    }
                }
                else if (this.elseif != null) {
                    var result = this.elseif.interpret(tree, table);
                    if ((result instanceof Continue) || (result instanceof Break) ||
                        (result instanceof Return) || (result instanceof Exception)) {
                        return result;
                    }
                }
            }
        }
        else {
            return new Exception("Semantic", "Expect a Boolean type expression. Not ".concat(this.expr.get_type().name), this.row, this.column);
        }
    };
    return If;
}(Instruction));
export { If };
