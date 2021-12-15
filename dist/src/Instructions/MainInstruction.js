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
import { Function } from "./Function.js";
import { Continue } from "./Continue.js";
import { Break } from "./Break.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
var MainInstruction = /** @class */ (function (_super) {
    __extends(MainInstruction, _super);
    function MainInstruction(instructions, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.instructions = instructions;
        return _this;
    }
    MainInstruction.prototype.interpret = function (tree, table) {
        var new_table = new SymbolTable(table, "Method_Main");
        tree.set_symbol_table(new_table);
        for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item instanceof Function) {
                var error = new Exception("Semantic", "The instruction func don't be into of method main", item.row, item.column);
                tree.get_errors().push(error);
                tree.update_console(error.toString());
            }
            var instruction = item.interpret(tree, new_table);
            // if ( instruction === undefined ){
            //     console.log("entro");    
            //     return;
            // }
            if (instruction instanceof Exception) {
                //let error = new Exception("Semantic", "The instruction Continue is loop instruction", item.row, item.column);
                tree.get_errors().push(instruction);
                tree.update_console(instruction.toString());
            }
            if (instruction instanceof Break) {
                var error = new Exception("Semantic", "The instruction Break is loop instruction", item.row, item.column);
                tree.get_errors().push(error);
                tree.update_console(error.toString());
            }
            if (instruction instanceof Continue) {
                var error = new Exception("Semantic", "The instruction Continue is loop instruction", item.row, item.column);
                tree.get_errors().push(error);
                tree.update_console(error.toString());
            }
        }
    };
    MainInstruction.prototype.compile = function (table, generator) {
        /*let generator_aux = new Generator3D();
        let generator = generator_aux.get_instance();*/
        for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
            var item = _a[_i];
            // @ts-ignore
            if (item === ';') {
                generator.add_print("c", "char", 10);
            }
            else {
                item.compile(table, generator);
            }
        }
        return generator.get_code();
    };
    MainInstruction.prototype.get_node = function () {
        var node = new Cst_Node("Main");
        node.add_child("void");
        node.add_child("main");
        node.add_child("(");
        node.add_child(")");
        node.add_child("{");
        var instructions = new Cst_Node("Instructios");
        for (var _i = 0, _a = this.instructions; _i < _a.length; _i++) {
            var item = _a[_i];
            instructions.add_childs_node(item.get_node());
        }
        node.add_childs_node(instructions);
        node.add_child("}");
        return node;
    };
    return MainInstruction;
}(Instruction));
export { MainInstruction };
