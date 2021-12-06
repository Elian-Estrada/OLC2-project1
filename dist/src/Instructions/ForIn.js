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
import { Continue } from "./Continue.js";
import { Break } from "./Break.js";
import { Return } from "./Return.js";
import { type } from "../SymbolTable/Type.js";
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
        var value_dec;
        var value_iterable;
        if (this.firsExp != null) {
            value_dec = this.firsExp.interpret(tree, table);
            if (value_dec instanceof Exception)
                return value_dec;
            value_iterable = this.secondExp.interpret(tree, table);
            if (value_iterable instanceof Exception)
                return value_iterable;
            if (this.secondExp.get_type() == type.STRING) {
                var new_table = new SymbolTable(table, "ForIn-".concat(this.row, "-").concat(this.column));
                this.firsExp.interpret(tree, new_table);
                for (var _i = 0, _a = this.secondExp.value; _i < _a.length; _i++) {
                    var item_dec = _a[_i];
                    console.log(item_dec);
                    if (this.instructions != null) {
                        for (var _b = 0, _c = this.instructions; _b < _c.length; _b++) {
                            var item_instr = _c[_b];
                            var instruction = item_instr.interpret(tree, new_table);
                            if (instruction instanceof Exception) {
                                tree.get_errors().push(instruction);
                                tree.update_console(instruction.toString());
                            }
                            if (instruction instanceof Continue)
                                break;
                            if (instruction instanceof Break)
                                return null;
                            if (instruction instanceof Return)
                                return instruction;
                            item_dec = instruction;
                            value_dec = item_dec;
                        }
                    }
                }
            }
        }
    };
    return ForIn;
}(Instruction));
export { ForIn };
