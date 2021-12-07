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
import { Declaration } from "./Declaration.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
import { Continue } from "./Continue.js";
import { Break } from "./Break.js";
import { Return } from "./Return.js";
var For = /** @class */ (function (_super) {
    __extends(For, _super);
    function For(init, condition, step, instructions, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.init = init;
        _this.condition = condition;
        _this.step = step;
        _this.instructions = instructions;
        _this.counter = 0;
        return _this;
    }
    For.prototype.interpret = function (tree, table) {
        if (!(typeof null in (this.init))
            || !(typeof null in (this.condition))
            || !(typeof null in (this.step))) {
            var new_table = undefined;
            var declare_flag = false;
            var start = null;
            if (this.init instanceof Declaration) {
                new_table = new SymbolTable(table, "Init_For-".concat(this.row, "-").concat(this.column));
                declare_flag = true;
                start = this.init.interpret(tree, new_table);
            }
            else {
                start = this.init.interpret(tree, table);
            }
            if (start instanceof Exception)
                return start;
            while (true) {
                var flag = null;
                if (new_table == null) {
                    flag = this.condition.interpret(tree, table);
                }
                else {
                    flag = this.condition.interpret(tree, new_table);
                }
                if (flag instanceof Exception)
                    return flag;
                if (this.condition.get_type() == type.BOOL) {
                    if (String(flag) == "true") {
                        if (!JSON.parse(String(declare_flag))) {
                            new_table = new SymbolTable(table, "For-".concat(this.row, "-").concat(this.column));
                        }
                        else {
                            new_table = new SymbolTable(new_table, "For-".concat(this.row, "-").concat(this.column));
                        }
                        if (this.instructions != null) {
                            for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
                                var item = _a[_i];
                                var instruction = item.interpret(tree, new_table);
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
                            }
                            var step = this.step.interpret(tree, new_table);
                            if (step instanceof Exception)
                                return step;
                        }
                    }
                    else {
                        break;
                    }
                }
                else {
                    return new Exception("Semantic", "Expect a Boolean type expression", this.row, this.column);
                }
                this.counter += 1;
            }
        }
        else {
            return new Exception("Semantic", "Expression Expected", this.row, this.column);
        }
    };
    return For;
}(Instruction));
export { For };