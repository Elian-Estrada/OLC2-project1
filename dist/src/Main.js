// @ts-ignore
import { grammar, errors, clean_errors } from "./grammar.js";
import Tree from "./SymbolTable/Tree.js";
import SymbolTable from "./SymbolTable/SymbolTable.js";
import { variables } from "./SymbolTable/SymbolTable.js";
import { clear_count } from "./Nativas/Graficar_ts.js";
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
        this.tree = null;
        this.global_table = null;
    }
    Main.prototype.lexicalAnalysis = function (bufferStream) {
        console.log("Analizando ".concat(bufferStream));
        // @ts-ignore
        var instructions;
        clean_errors();
        clear_count();
        instructions = grammar.parse(bufferStream);
        // console.log(instructions)
        this.tree = new Tree(instructions);
        this.global_table = new SymbolTable(undefined, undefined);
        this.global_table.clean_variables();
        this.tree.set_global_table(this.global_table);
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            // @ts-ignore
            // console.log(error);
            this.tree.get_errors().push(error);
            this.tree.update_console(error.toString());
        }
        // @ts-ignore
        if (this.tree.get_instructions() != ';') {
            try {
                // this.create_native_functions(this.tree);
                // console.log(this.tree)
                /* First run for functions and assigns */
                for (var _a = 0, _b = this.tree.get_instructions(); _a < _b.length; _a++) {
                    var instruction = _b[_a];
                    // console.log(instruction)
                    if (instruction instanceof Function)
                        this.tree.add_function(instruction);
                    if (instruction instanceof Struct) {
                        var value = instruction.interpret(this.tree, this.global_table);
                        if (value instanceof Exception) {
                            this.tree.get_errors().push(value);
                            this.tree.update_console(value.toString());
                            continue;
                        }
                    }
                    if (instruction instanceof Declaration ||
                        instruction instanceof Assignment ||
                        instruction instanceof Declaration_array) {
                        var value = instruction.interpret(this.tree, this.global_table);
                        if (value instanceof Exception) {
                            this.tree.get_errors().push(value);
                            this.tree.update_console(value.toString());
                            continue;
                        }
                        var error = null;
                        if (instruction instanceof Break) {
                            error = new Exception("Semantic", "Instruction Break is loop or switch instruction", instruction.row, instruction.column, this.global_table.get_name());
                            this.tree.get_errors().push(error);
                            this.tree.update_console(error.toString());
                            continue;
                        }
                        if (instruction instanceof Continue) {
                            error = new Exception("Semantic", "Instruction Continue is loop instruction", instruction.row, instruction.column, this.global_table.get_name());
                            this.tree.get_errors().push(error);
                            this.tree.update_console(error.toString());
                            continue;
                        }
                        if (instruction instanceof Return) {
                            error = new Exception("Semantic", "Instruction Return is loop instruction", instruction.row, instruction.column, this.global_table.get_name());
                            this.tree.get_errors().push(error);
                            this.tree.update_console(error.toString());
                        }
                    }
                }
                var count = 0;
                /* Second run for main function */
                for (var _c = 0, _d = this.tree.get_instructions(); _c < _d.length; _c++) {
                    var instruction = _d[_c];
                    if (instruction instanceof MainInstruction) {
                        count += 1;
                        if (count > 1) {
                            var error = new Exception("Semantic", "The main method is already defined", instruction.row, instruction.column, this.global_table.get_name());
                            this.tree.get_errors().push(error);
                            this.tree.update_console(error.toString());
                            break;
                        }
                    }
                }
                if (count === 1) {
                    /* Third run for interpret main */
                    for (var _e = 0, _f = this.tree.get_instructions(); _e < _f.length; _e++) {
                        var instruction = _f[_e];
                        if (instruction instanceof MainInstruction) {
                            var value = instruction.interpret(this.tree, this.global_table);
                            var error = void 0;
                            if (instruction instanceof Break) {
                                error = new Exception("Semantic", "Instruction Break is loop or switch instruction", instruction.row, instruction.column, this.global_table.get_name());
                                this.tree.get_errors().push(error);
                                this.tree.update_console(error.toString());
                                continue;
                            }
                            if (instruction instanceof Continue) {
                                error = new Exception("Semantic", "Instruction Continue is loop instruction", instruction.row, instruction.column, this.global_table.get_name());
                                this.tree.get_errors().push(error);
                                this.tree.update_console(error.toString());
                                continue;
                            }
                            if (instruction instanceof Return) {
                            }
                        }
                    }
                }
                /* Fourth run for instruction outside main */
                for (var _g = 0, _h = this.tree.get_instructions(); _g < _h.length; _g++) {
                    var instruction = _h[_g];
                    if (!(instruction instanceof MainInstruction || instruction instanceof Declaration
                        || instruction instanceof Assignment || instruction instanceof Function || instruction instanceof Struct
                        || instruction instanceof Declaration_array)) {
                        var error = new Exception("Semantic", "Instruction outside main", instruction.row, instruction.column, this.global_table.get_name());
                        this.tree.get_errors().push(error);
                        this.tree.update_console(error.toString());
                    }
                }
                /*for ( let item of this.tree.get_all_functions() ) {
                    if ( item.get_name() === 'length' ) {

                        let declaration: string = "";
                        if ( item.get_type() === type.VOID ) {
                            declaration = "Method";
                        } else {
                            declaration = "Function";
                        }
                        this.global_table.inser
                    }
                }*/
            }
            catch (e) {
                return e;
            }
        }
        console.log(this.tree.get_instructions());
        console.log(this.tree.get_global_table());
        console.log(this.tree.get_errors());
        console.log(this.tree.get_all_structs());
        localStorage.setItem("errors", JSON.stringify(this.tree.get_errors()));
        localStorage.setItem("symbol", JSON.stringify(variables));
        var init = new Cst_Node("Root");
        var inst = new Cst_Node("Instructions");
        for (var _j = 0, _k = this.tree.get_instructions(); _j < _k.length; _j++) {
            var item = _k[_j];
            inst.add_childs_node(item.get_node());
        }
        init.add_childs_node(inst);
        var graph = this.tree.get_dot(init);
        localStorage.setItem("dot", graph);
        return this.tree.get_console();
        // console.log(res);
    };
    Main.prototype.compile = function (bufferStream) {
        console.log("Compilando ".concat(bufferStream));
        var res = "";
        var generator_aux = new Generator3D();
        generator_aux.clean_all();
        var generator = generator_aux.get_instance();
        var instructions = grammar.parse(bufferStream);
        // @ts-ignore
        this.tree.set_global_table(this.global_table);
        // @ts-ignore
        for (var _i = 0, _a = this.tree.get_instructions(); _i < _a.length; _i++) {
            var instruction = _a[_i];
            // @ts-ignore
            res = instruction.compile(this.global_table, generator, this.tree);
        }
        return res;
    };
    return Main;
}());
export { Main };
