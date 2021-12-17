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
import { Cst_Node } from "../Abstract/Cst_Node.js";
var While = /** @class */ (function (_super) {
    __extends(While, _super);
    function While(expr, instructions, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.expr = expr;
        _this.instructions = instructions;
        _this.counter = 0;
        return _this;
    }
    While.prototype.interpret = function (tree, table) {
        try {
            while (true && this.counter < 100000) {
                var flag = this.expr.interpret(tree, table);
                if (flag instanceof Exception)
                    return flag;
                if (this.expr.get_type() == type.BOOL) {
                    if (String(flag) == "true") {
                        var new_table = new SymbolTable(table, "While-".concat(this.row, "-").concat(this.column));
                        for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
                            var item = _a[_i];
                            var instruction = item.interpret(tree, new_table);
                            if (instruction instanceof Exception) {
                                tree.get_errors().push(instruction);
                                tree.update_console(instruction.toString());
                            }
                            if (instruction instanceof Continue) {
                                break;
                            }
                            else if (instruction instanceof Break) {
                                return null;
                            }
                            else if (instruction instanceof Return) {
                                return instruction;
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
            }
            if (this.counter >= 100000) {
                throw "Infinity Loop in While";
            }
        }
        catch (error) {
            console.log(error);
            return new Exception("Semantic", "" + error, this.row, this.column);
        }
    };
    While.prototype.get_node = function () {
        var node = new Cst_Node("While");
        node.add_child("while");
        node.add_child("(");
        node.add_childs_node(this.expr.get_node());
        node.add_child(")");
        node.add_child("{");
        var instructions = new Cst_Node("Instructions");
        for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
            var item = _a[_i];
            instructions.add_childs_node(item.get_node());
        }
        node.add_childs_node(instructions);
        node.add_child("}");
        return node;
    };
    While.prototype.compile = function (table, generator) {
        var continue_label = generator.newLabel();
        generator.setLabel(continue_label);
        var condition = this.expr.compile(table, generator);
        var new_env = new SymbolTable(table, "While-Env-3D");
        new_env.break_label = condition.false_label;
        new_env.continue_label = continue_label;
        generator.setLabel(condition.true_label);
        for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
            var inst = _a[_i];
            inst.compile(table, generator);
            generator.addGoTo(continue_label);
        }
        generator.setLabel(condition.false_label);
    };
    return While;
}(Instruction));
export { While };
