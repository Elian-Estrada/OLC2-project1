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
import { Break } from "./Break.js";
import { Return } from "./Return.js";
import { Continue } from "./Continue.js";
import { type } from "../SymbolTable/Type.js";
import { If } from "./If.js";
var Function = /** @class */ (function (_super) {
    __extends(Function, _super);
    function Function(type, name, params, instructions, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.instructions = instructions;
        _this.name = name;
        _this.params = params;
        _this.type = type;
        return _this;
    }
    Function.prototype.look_for_a_return = function (instruction) {
        var flag = false;
        var count = 0;
        if (instruction instanceof If) {
            for (var _i = 0, _a = instruction.instructions; _i < _a.length; _i++) {
                var instr = _a[_i];
                if (flag)
                    return flag;
                // console.log(instr);
                if (instr instanceof Return) {
                    console.log("Hola");
                    flag = true;
                    break;
                }
                else {
                    this.look_for_a_return(instr);
                }
            }
        }
        else {
            count += 1;
            this.look_for_a_return(this.instructions[count]);
        }
        return flag;
    };
    Function.prototype.interpret = function (tree, table) {
        var new_table = new SymbolTable(table, "Function-".concat(this.name, "-").concat(this.row, "-").concat(this.column));
        var flag = false;
        if (this.type == type.VOID)
            flag = true;
        if (!flag) {
            for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
                var instr = _a[_i];
                if (instr instanceof Return) {
                    flag = true;
                    break;
                }
                else {
                    this.look_for_a_return(instr);
                }
            }
        }
        for (var _b = 0, _c = this.instructions; _b < _c.length; _b++) {
            var instruction = _c[_b];
            // console.log(instruction)
            if (flag) {
                var value = instruction.interpret(tree, new_table);
                if (value === "void")
                    return;
                if (value instanceof Exception) {
                    tree.get_errors().push(value);
                    tree.update_console(value.toString());
                }
                var error = null;
                if (value instanceof Break) {
                    error = new Exception("Semantic", "Instruction Break out of loop", instruction.row, instruction.column);
                    tree.get_errors().push(error);
                    // tree.get_update(error);
                }
                if (value instanceof Continue) {
                    // console.log("Hola")
                    error = new Exception("Semantic", "Instruction Continue out of loop", instruction.row, instruction.column);
                    tree.get_errors().push(error);
                }
                if (value instanceof Return) {
                    console.log(this.type);
                    if (this.type == type.VOID) {
                        // console.log("Hola")
                        return new Exception("Semantic", "Function should not return anything", instruction.row, instruction.column);
                    }
                    if (this.type != value.get_type()) {
                        return new Exception("Semantic", "Function doesn't return same data type", instruction.row, instruction.column);
                    }
                    return value.get_result();
                }
            }
            else {
                return new Exception("Semantic", "Function doesn't return anything", instruction.row, instruction.column);
            }
        }
        if (this.type !== type.VOID) {
            return new Exception("Semantic", "Function of type: ".concat(this.type, " expected one Return"), this.instructions[this.instructions.length - 1].row, this.instructions[this.instructions.length - 1].column);
        }
        return null;
    };
    Function.prototype.get_type = function () {
        return this.type;
    };
    Function.prototype.get_name = function () {
        return this.name;
    };
    Function.prototype.get_params = function () {
        return this.params;
    };
    return Function;
}(Instruction));
export { Function };
