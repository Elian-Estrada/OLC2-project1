// @ts-ignore
import { grammar, errors, clean_errors } from "./grammar.js";
import Tree from "./SymbolTable/Tree.js";
import SymbolTable from "./SymbolTable/SymbolTable.js";
import Exception from "./SymbolTable/Exception.js";
import { Function } from "./Instructions/Function.js";
import { Declaration } from "./Instructions/Declaration.js";
import { Assignment } from "./Instructions/Assignment.js";
import { Break } from "./Instructions/Break.js";
import { Continue } from "./Instructions/Continue.js";
import { Return } from "./Instructions/Return.js";
import { MainInstruction } from "./Instructions/MainInstruction.js";
import { Struct } from "./Instructions/Struct.js";
import { Declaration_array } from "./Instructions/Declaration_array.js";
import { Generator3D } from "./Generator/Generator3D.js";
import { Cst_Node } from "./Abstract/Cst_Node.js";
var Main = /** @class */ (function () {
    function Main() {
    }
    /*create_native_functions (tree: Tree) {
        let length_func = new Length("", 'length', [ { type: type.NULL, name: 'length##param1' } ], [], -1, -1);
        tree.add_function(length_func);
    }*/
    Main.prototype.lexicalAnalysis = function (bufferStream) {
        console.log("Analizando ".concat(bufferStream));
        // @ts-ignore
        var instructions;
        clean_errors();
        instructions = grammar.parse(bufferStream);
        // console.log(instructions)
        var tree = new Tree(instructions);
        var global_table = new SymbolTable(undefined, undefined);
        tree.set_global_table(global_table);
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            // @ts-ignore
            // console.log(error);
            tree.get_errors().push(error);
            tree.update_console(error.toString());
        }
        // @ts-ignore
        if (tree.get_instructions() != ';') {
            try {
                // this.create_native_functions(tree);
                // console.log(tree)
                /* First run for functions and assigns */
                for (var _a = 0, _b = tree.get_instructions(); _a < _b.length; _a++) {
                    var instruction = _b[_a];
                    // console.log(instruction)
                    if (instruction instanceof Function)
                        tree.add_function(instruction);
                    if (instruction instanceof Struct) {
                        var value = instruction.interpret(tree, global_table);
                        if (value instanceof Exception) {
                            tree.get_errors().push(value);
                            tree.update_console(value.toString());
                            continue;
                        }
                    }
                    if (instruction instanceof Declaration ||
                        instruction instanceof Assignment ||
                        instruction instanceof Declaration_array) {
                        var value = instruction.interpret(tree, global_table);
                        if (value instanceof Exception) {
                            tree.get_errors().push(value);
                            tree.update_console(value.toString());
                            continue;
                        }
                        var error = null;
                        if (instruction instanceof Break) {
                            error = new Exception("Semantic", "Instruction Break is loop or switch instruction", instruction.row, instruction.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                            continue;
                        }
                        if (instruction instanceof Continue) {
                            error = new Exception("Semantic", "Instruction Continue is loop instruction", instruction.row, instruction.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                            continue;
                        }
                        if (instruction instanceof Return) {
                            error = new Exception("Semantic", "Instruction Return is loop instruction", instruction.row, instruction.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                        }
                    }
                }
                var count = 0;
                /* Second run for main function */
                for (var _c = 0, _d = tree.get_instructions(); _c < _d.length; _c++) {
                    var instruction = _d[_c];
                    if (instruction instanceof MainInstruction) {
                        count += 1;
                        if (count > 1) {
                            var error = new Exception("Semantic", "The main method is already defined", instruction.row, instruction.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                            break;
                        }
                    }
                }
                if (count === 1) {
                    /* Third run for interpret main */
                    for (var _e = 0, _f = tree.get_instructions(); _e < _f.length; _e++) {
                        var instruction = _f[_e];
                        if (instruction instanceof MainInstruction) {
                            var value = instruction.interpret(tree, global_table);
                            var error = void 0;
                            if (instruction instanceof Break) {
                                error = new Exception("Semantic", "Instruction Break is loop or switch instruction", instruction.row, instruction.column);
                                tree.get_errors().push(error);
                                tree.update_console(error.toString());
                                continue;
                            }
                            if (instruction instanceof Continue) {
                                error = new Exception("Semantic", "Instruction Continue is loop instruction", instruction.row, instruction.column);
                                tree.get_errors().push(error);
                                tree.update_console(error.toString());
                                continue;
                            }
                            if (instruction instanceof Return) {
                            }
                        }
                    }
                }
                /* Fourth run for instruction outside main */
                for (var _g = 0, _h = tree.get_instructions(); _g < _h.length; _g++) {
                    var instruction = _h[_g];
                    if (!(instruction instanceof MainInstruction || instruction instanceof Declaration
                        || instruction instanceof Assignment || instruction instanceof Function || instruction instanceof Struct)) {
                        var error = new Exception("Semantic", "Instruction outside main", instruction.row, instruction.column);
                        tree.get_errors().push(error);
                        tree.update_console(error.toString());
                    }
                }
                /*for ( let item of tree.get_all_functions() ) {
                    if ( item.get_name() === 'length' ) {

                        let declaration: string = "";
                        if ( item.get_type() === type.VOID ) {
                            declaration = "Method";
                        } else {
                            declaration = "Function";
                        }
                        global_table.inser
                    }
                }*/
            }
            catch (e) {
                return e;
            }
        }
        console.log(tree.get_instructions());
        console.log(tree.get_global_table());
        console.log(tree.get_errors());
        console.log(tree.get_all_structs());
        var init = new Cst_Node("Root");
        var inst = new Cst_Node("Instructions");
        for (var _j = 0, _k = tree.get_instructions(); _j < _k.length; _j++) {
            var item = _k[_j];
            inst.add_childs_node(item.get_node());
        }
        init.add_childs_node(inst);
        var graph = tree.get_dot(init);
        localStorage.setItem("dot", graph);
        return tree.get_console();
        // console.log(res);
    };
    Main.prototype.compile = function (bufferStream) {
        console.log("Compilando ".concat(bufferStream));
        var res = "";
        /*let res = `/!*------HEADER------*!/\n`;
        res += "#include <stdio.h>\n";
        res += "#include <math.h>\n";
        res += "double heap[30101999];\n";
        res += "double stack[30101999];\n";
        res += "double P;\n";
        res += "double H;\n\n";
        res += "/!*------MAIN------*!/\n";
        res += "void main() {\n";
        res += "\tP = 0; H = 0;\n";*/
        var generator_aux = new Generator3D();
        generator_aux.clean_all();
        var generator = generator_aux.get_instance();
        var instructions = grammar.parse(bufferStream);
        var tree = new Tree(instructions);
        var global_table = new SymbolTable(undefined, undefined);
        tree.set_global_table(global_table);
        for (var _i = 0, _a = tree.get_instructions(); _i < _a.length; _i++) {
            var instruction = _a[_i];
            res = instruction.compile(global_table, generator);
        }
        return res;
    };
    return Main;
}());
export { Main };
