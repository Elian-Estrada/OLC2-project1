// @ts-ignore
import { grammar, errors, clean_errors, grammatical, clean_gramatical } from "./grammar.js";
import { Instruction } from "./Abstract/Instruction.js";
import Tree from "./SymbolTable/Tree.js";
import SymbolTable from "./SymbolTable/SymbolTable.js";
import { variables } from "./SymbolTable/SymbolTable.js";
import { clear_count } from "./Nativas/Graficar_ts.js";
import Exception from "./SymbolTable/Exception.js";
import {Function} from "./Instructions/Function.js";
import {Declaration} from "./Instructions/Declaration.js";
import {Assignment} from "./Instructions/Assignment.js";
import {Break} from "./Instructions/Break.js";
import {Continue} from "./Instructions/Continue.js";
import {Return} from "./Instructions/Return.js";
import {MainInstruction} from "./Instructions/MainInstruction.js";
import { Struct } from "./Instructions/Struct.js";
import {Declaration_array} from "./Instructions/Declaration_array.js";
import {Generator3D} from "./Generator/Generator3D.js";
import { Cst_Node } from "./Abstract/Cst_Node.js";

export class Main {

    /*create_native_functions (this.tree: Tree) {
        let length_func = new Length("", 'length', [ { type: type.NULL, name: 'length##param1' } ], [], -1, -1);
        this.tree.add_function(length_func);
    }*/
    public tree: Tree | null;
    public global_table: SymbolTable | null;

    constructor() {
        this.tree = null;
        this.global_table = null;
    }


    lexicalAnalysis(bufferStream: string) {
        console.log(`Analizando ${bufferStream}`);
        // @ts-ignore

        let instructions: Array<Instruction>;
        
        clean_errors();
        clean_gramatical();
        clear_count();

        instructions = grammar.parse(bufferStream);
        // console.log(instructions)

        this.tree = new Tree(instructions);
        this.global_table = new SymbolTable(undefined, undefined);
        this.global_table.clean_variables();
        this.tree.set_global_table(this.global_table);

        for ( let error of errors ) {
            // @ts-ignore
            // console.log(error);
            this.tree.get_errors().push(error);
            this.tree.update_console(error.toString());
        }

        // @ts-ignore
        if ( this.tree.get_instructions() != ';' ) {
            try {

                // this.create_native_functions(this.tree);
                // console.log(this.tree)

                /* First run for functions and assigns */
                for ( let instruction of this.tree.get_instructions() ){

                    // console.log(instruction)
                    if ( instruction instanceof Function )
                        this.tree.add_function(instruction);

                    if ( instruction instanceof Struct){
                        let value:any = instruction.interpret(this.tree, this.global_table);

                        if (value instanceof Exception){
                            this.tree.get_errors().push(value);
                            this.tree.update_console(value.toString());
                            continue;
                        }
                    }

                    if ( instruction instanceof Declaration ||
                        instruction instanceof Assignment ||
                        instruction instanceof Declaration_array) {
                        let value = instruction.interpret(this.tree, this.global_table);

                        if ( value instanceof Exception ) {
                            this.tree.get_errors().push(value);
                            this.tree.update_console(value.toString());
                            continue;
                        }

                        let error = null;
                        if ( instruction instanceof Break ) {
                            error = new Exception("Semantic", "Instruction Break is loop or switch instruction", instruction.row, instruction.column, this.global_table.get_name());
                            this.tree.get_errors().push(error);
                            this.tree.update_console(error.toString());
                            continue;
                        }

                        if ( instruction instanceof Continue ) {
                            error = new Exception("Semantic", "Instruction Continue is loop instruction", instruction.row, instruction.column, this.global_table.get_name());
                            this.tree.get_errors().push(error);
                            this.tree.update_console(error.toString());
                            continue;
                        }

                        if ( instruction instanceof Return ) {
                            error = new Exception("Semantic", "Instruction Return is loop instruction", instruction.row, instruction.column, this.global_table.get_name());
                            this.tree.get_errors().push(error);
                            this.tree.update_console(error.toString());
                        }
                    }
                }

                let count = 0;
                /* Second run for main function */
                for ( let instruction of this.tree.get_instructions() ) {
                    if ( instruction instanceof MainInstruction ) {
                        count += 1;
                        if ( count > 1 ) {
                            let error = new Exception("Semantic", "The main method is already defined", instruction.row, instruction.column, this.global_table.get_name());
                            this.tree.get_errors().push(error);
                            this.tree.update_console(error.toString());
                            break;
                        }
                    }
                }

                if ( count === 1 ) {
                    /* Third run for interpret main */
                    for ( let instruction of this.tree.get_instructions() ) {
                        if ( instruction instanceof  MainInstruction ) {
                            let value = instruction.interpret(this.tree, this.global_table);

                            let error;
                            if ( instruction instanceof Break ) {
                                error = new Exception("Semantic", "Instruction Break is loop or switch instruction", instruction.row, instruction.column, this.global_table.get_name());
                                this.tree.get_errors().push(error);
                                this.tree.update_console(error.toString());
                                continue;
                            }

                            if ( instruction instanceof Continue ) {
                                error = new Exception("Semantic", "Instruction Continue is loop instruction", instruction.row, instruction.column, this.global_table.get_name());
                                this.tree.get_errors().push(error);
                                this.tree.update_console(error.toString());
                                continue;
                            }

                            if ( instruction instanceof Return ) {
                            }
                        }
                    }
                }

                /* Fourth run for instruction outside main */
                for ( let instruction of this.tree.get_instructions() ) {
                    if ( !(instruction instanceof MainInstruction || instruction instanceof Declaration
                        || instruction instanceof Assignment || instruction instanceof Function || instruction instanceof Struct
                        || instruction instanceof Declaration_array) ) {
                            let error = new Exception("Semantic", "Instruction outside main", instruction.row, instruction.column, this.global_table.get_name());
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
            } catch (e) {
                return e;
            }
        }

        console.log(grammatical);
        
        
        localStorage.setItem("errors", JSON.stringify(this.tree.get_errors()));
        localStorage.setItem("symbol", JSON.stringify(variables));
        localStorage.setItem("functions", JSON.stringify(this.tree.get_all_functions()));
        localStorage.setItem("structs", JSON.stringify(this.tree.get_all_structs()));
        localStorage.setItem("gramatica", JSON.stringify(grammatical));
        
        let init = new Cst_Node("Root");
        let inst = new Cst_Node("Instructions");

        for (let item of this.tree.get_instructions()){
            inst.add_childs_node(item.get_node());
        }

        init.add_childs_node(inst);

        let graph = this.tree.get_dot(init);

        localStorage.setItem("dot", graph);
        
        return this.tree.get_console();
        // console.log(res);
    }

    compile (bufferStream: string) {
        console.log(`Compilando ${bufferStream}`);
        let res = "";

        let generator_aux = new Generator3D();
        generator_aux.clean_all();
        let generator = generator_aux.get_instance();

        let instructions = grammar.parse(bufferStream);
        // @ts-ignore
        this.tree.set_global_table(this.global_table);

        // @ts-ignore
        for ( let instruction of this.tree.get_instructions() ){
            // @ts-ignore
            res = instruction.compile(this.global_table, generator, this.tree);
        }

        return res;
    }
}