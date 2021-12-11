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
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.prototype.lexicalAnalysis = function (bufferStream) {
        //console.log(`Analizando ${bufferStream}`);
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
                /* First run for functions and assigns */
                for (var _a = 0, _b = tree.get_instructions(); _a < _b.length; _a++) {
                    var instruction = _b[_a];
                    // console.log(instruction)
                    if (instruction instanceof Function)
                        tree.add_function(instruction);
                    if (instruction instanceof Declaration ||
                        instruction instanceof Assignment) {
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
                                console.log(value);
                            }
                        }
                    }
                }
                /* Fourth run for instruction outside main */
                for (var _g = 0, _h = tree.get_instructions(); _g < _h.length; _g++) {
                    var instruction = _h[_g];
                    if (!(instruction instanceof MainInstruction || instruction instanceof Declaration
                        || instruction instanceof Assignment || instruction instanceof Function)) {
                        var error = new Exception("Semantic", "Instruction outside main", instruction.row, instruction.column);
                        tree.get_errors().push(error);
                        tree.update_console(error.toString());
                    }
                }
            }
            catch (e) {
                return e;
            }
        }
        console.log(tree.get_instructions());
        console.log(tree.get_global_table());
        console.log(tree.get_errors());
        console.log(tree.get_all_structs());
        return tree.get_console();
        // console.log(res);
    };
    return Main;
}());
export { Main };
