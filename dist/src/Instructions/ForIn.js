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
import Symbol from "../SymbolTable/Symbol.js";
import { Declaration } from "./Declaration.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
var ForIn = /** @class */ (function (_super) {
    __extends(ForIn, _super);
    function ForIn(identifier, secondExp, instructions, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.firsExp = identifier;
        _this.secondExp = secondExp;
        _this.instructions = instructions;
        _this.counter = 0;
        return _this;
    }
    ForIn.prototype.interpret = function (tree, table) {
        var value_dec;
        var value_iterable;
        if (this.firsExp != null) {
            value_iterable = this.secondExp.interpret(tree, table);
            if (value_iterable instanceof Exception) {
                return value_iterable;
            }
            if (this.secondExp.get_type() == type.STRING) {
                var new_table = new SymbolTable(table, "ForIn-".concat(this.row, "-").concat(this.column));
                /* Hacer nueva declaration */
                // @ts-ignore
                var new_var = new Declaration([this.firsExp.toString()], type.STRING, this.row, this.column, null);
                var res_dec = new_var.interpret(tree, new_table);
                if (res_dec instanceof Exception)
                    return res_dec;
                for (var _i = 0, value_iterable_1 = value_iterable; _i < value_iterable_1.length; _i++) {
                    var item_dec = value_iterable_1[_i];
                    var new_symbol = new Symbol(new_var.get_id()[0], type.STRING, this.row, this.column, item_dec);
                    var res_new_table = new_table.update_table(new_symbol);
                    if (res_new_table instanceof Exception)
                        return res_new_table;
                    if (this.instructions != null) {
                        for (var _a = 0, _b = this.instructions; _a < _b.length; _a++) {
                            var item_instr = _b[_a];
                            var instruction = item_instr.interpret(tree, new_table);
                            if (instruction instanceof Exception) {
                                tree.get_errors().push(instruction);
                                tree.update_console(instruction.toString());
                            }
                            if (instruction instanceof Continue) {
                                break;
                            }
                            if (instruction instanceof Break) {
                                return null;
                            }
                            if (instruction instanceof Return) {
                                return instruction;
                            }
                            item_dec = instruction;
                            value_dec = item_dec;
                        }
                    }
                }
            }
        }
    };
    ForIn.prototype.get_node = function () {
        var node = new Cst_Node("For-In");
        return node;
    };
    return ForIn;
}(Instruction));
export { ForIn };
