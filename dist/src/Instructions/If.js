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
import { Cst_Node } from "../Abstract/Cst_Node.js";
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
                    // console.log(result)
                    if ((result instanceof Continue) || (result instanceof Break) ||
                        (result instanceof Return) || (result instanceof Exception)) {
                        return result;
                    }
                }
            }
        }
        else {
            return new Exception("Semantic", "Expect a Boolean type expression. Not ".concat(this.expr.get_type().name), this.row, this.column, table.get_name());
        }
    };
    If.prototype.get_node = function () {
        var node = new Cst_Node("If");
        node.add_child("if");
        node.add_child("(");
        node.add_childs_node(this.expr.get_node());
        node.add_child(")");
        node.add_child("{");
        var instructios = new Cst_Node("Instructions");
        for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
            var item = _a[_i];
            instructios.add_childs_node(item.get_node());
        }
        node.add_childs_node(instructios);
        node.add_child("}");
        if (this.else_instr !== null) {
            var instrctiosn_else = new Cst_Node("Else Instructions");
            node.add_child("else");
            node.add_child("{");
            for (var _b = 0, _c = this.else_instr; _b < _c.length; _b++) {
                var item = _c[_b];
                instrctiosn_else.add_childs_node(item.get_node());
            }
            node.add_childs_node(instrctiosn_else);
            node.add_child("}");
        }
        else if (this.elseif !== null) {
            node.add_childs_node(this.elseif.get_node());
        }
        return node;
    };
    If.prototype.compile = function (table, generator) {
        var condition = this.expr.compile(table, generator);
        if (condition.type !== type.BOOL) {
            generator.addError("Condition is not a boolean value", Number(this.row), Number(this.column));
            return;
        }
        generator.setLabel(condition.true_label);
        for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
            var instr = _a[_i];
            instr.compile(table, generator);
        }
        if (this.elseif !== null) {
            generator.setLabel(condition.false_label);
            this.elseif.compile(table, generator);
        }
        var label_exit_if = '';
        if (this.else_instr !== null) {
            label_exit_if = generator.newLabel();
            generator.addGoTo(label_exit_if);
        }
        generator.setLabel(condition.false_label);
        if (this.else_instr !== null) {
            for (var _b = 0, _c = this.else_instr; _b < _c.length; _b++) {
                var else_instr = _c[_b];
                else_instr.compile(table, generator);
                generator.setLabel(label_exit_if);
            }
        }
    };
    return If;
}(Instruction));
export { If };
