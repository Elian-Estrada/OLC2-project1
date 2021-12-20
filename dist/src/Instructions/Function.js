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
import { Cst_Node } from "../Abstract/Cst_Node.js";
import Symbol from "../SymbolTable/Symbol.js";
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
    Function.prototype.interpret = function (tree, table) {
        var new_table = new SymbolTable(table, "Function-".concat(this.name, "-").concat(this.row, "-").concat(this.column));
        for (var _i = 0, _a = this.params; _i < _a.length; _i++) {
            var param = _a[_i];
            new_table.increment_size();
        }
        for (var _b = 0, _c = this.instructions; _b < _c.length; _b++) {
            var instruction = _c[_b];
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
                if (this.type == type.VOID) {
                    // console.log("Hola")
                    return new Exception("Semantic", "Function should not return anything", instruction.row, instruction.column);
                }
                if (value.get_type() === type.STRUCT) {
                    if (value.get_result().get_id() !== this.type) {
                        return new Exception("Semantic", "Function doesn't return same data type", instruction.row, instruction.column);
                    }
                }
                else {
                    if (this.type != value.get_type()) {
                        return new Exception("Semantic", "Function doesn't return same data type", instruction.row, instruction.column);
                    }
                }
                return value.get_result();
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
    Function.prototype.compile = function (table, generator, tree) {
        var new_env = new SymbolTable(table, this.name);
        new_env.type = this.type;
        var return_label = generator.newLabel();
        new_env.return_label = return_label;
        new_env.set_size(1);
        for (var _i = 0, _a = this.params; _i < _a.length; _i++) {
            var param = _a[_i];
            var in_heap = (param.type == type.STRING || param.type == type.STRUCT);
            var new_symbol = new Symbol(param.name, param.type, this.row, this.column, param.value, "", in_heap);
            new_env.set_table(new_symbol);
        }
        generator.freeAllTemps();
        generator.addBeginFunc(this.name, this.type);
        for (var _b = 0, _c = this.instructions; _b < _c.length; _b++) {
            var i = _c[_b];
            i.compile(new_env, generator, tree);
        }
        if (this.type != null)
            generator.setLabel(return_label);
        generator.addEndFunc();
        generator.freeAllTemps();
        tree.set_symbol_table(new_env);
    };
    Function.prototype.get_node = function () {
        var node = new Cst_Node("Function");
        node.add_child(this.name);
        node.add_child("(");
        var params = new Cst_Node("Parameters");
        var param;
        for (var _i = 0, _a = this.params; _i < _a.length; _i++) {
            var item = _a[_i];
            param = new Cst_Node("Parameter");
            switch (item.type) {
                case type.ARRAY:
                    param.add_child(item.sub_type);
                    param.add_child("[");
                    param.add_child("]");
                    param.add_child(item.id);
                    break;
                case type.STRUCT:
                    param.add_child(item.struct);
                    param.add_child(item.name);
                    break;
                default:
                    param.add_child(item.type);
                    param.add_child(item.name);
                    break;
            }
            params.add_childs_node(param);
        }
        node.add_childs_node(params);
        node.add_child(")");
        node.add_child("{");
        var instructions = new Cst_Node("Instructions");
        for (var _b = 0, _c = this.instructions; _b < _c.length; _b++) {
            var item = _c[_b];
            instructions.add_childs_node(item.get_node());
        }
        node.add_childs_node(instructions);
        node.add_child("}");
        return node;
    };
    return Function;
}(Instruction));
export { Function };
