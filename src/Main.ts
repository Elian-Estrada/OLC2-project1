// @ts-ignore
import { grammar, errors, clean_errors } from "./grammar.js";
import { Instruction } from "./Abstract/Instruction.js";
import Tree from "./SymbolTable/Tree.js";
import SymbolTable from "./SymbolTable/SymbolTable.js";
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

export class Main {

    /*create_native_functions (tree: Tree) {
        let length_func = new Length("", 'length', [ { type: type.NULL, name: 'length##param1' } ], [], -1, -1);
        tree.add_function(length_func);
    }*/

    lexicalAnalysis(bufferStream: string) {
        console.log(`Analizando ${bufferStream}`);
        // @ts-ignore

        let instructions: Array<Instruction>;
        
        clean_errors();

        instructions = grammar.parse(bufferStream);
        // console.log(instructions)

        let tree: Tree = new Tree(instructions);
        let global_table: SymbolTable = new SymbolTable(undefined, undefined);
        tree.set_global_table(global_table);

        for ( let error of errors ) {
            // @ts-ignore
            // console.log(error);
            tree.get_errors().push(error);
            tree.update_console(error.toString());
        }

        // @ts-ignore
        if ( tree.get_instructions() != ';' ) {
            try {

                // this.create_native_functions(tree);
                // console.log(tree)

                /* First run for functions and assigns */
                for ( let instruction of tree.get_instructions() ){

                    // console.log(instruction)
                    if ( instruction instanceof Function )
                        tree.add_function(instruction);

                    if ( instruction instanceof Struct){
                        let value:any = instruction.interpret(tree, global_table);

                        if (value instanceof Exception){
                            tree.get_errors().push(value);
                            tree.update_console(value.toString());
                            continue;
                        }
                    }

                    if ( instruction instanceof Declaration ||
                        instruction instanceof Assignment ||
                        instruction instanceof Declaration_array) {
                        let value = instruction.interpret(tree, global_table);

                        if ( value instanceof Exception ) {
                            tree.get_errors().push(value);
                            tree.update_console(value.toString());
                            continue;
                        }

                        let error = null;
                        if ( instruction instanceof Break ) {
                            error = new Exception("Semantic", "Instruction Break is loop or switch instruction", instruction.row, instruction.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                            continue;
                        }

                        if ( instruction instanceof Continue ) {
                            error = new Exception("Semantic", "Instruction Continue is loop instruction", instruction.row, instruction.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                            continue;
                        }

                        if ( instruction instanceof Return ) {
                            error = new Exception("Semantic", "Instruction Return is loop instruction", instruction.row, instruction.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                        }
                    }
                }

                let count = 0;
                /* Second run for main function */
                for ( let instruction of tree.get_instructions() ) {
                    if ( instruction instanceof MainInstruction ) {
                        count += 1;
                        if ( count > 1 ) {
                            let error = new Exception("Semantic", "The main method is already defined", instruction.row, instruction.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                            break;
                        }
                    }
                }

                if ( count === 1 ) {
                    /* Third run for interpret main */
                    for ( let instruction of tree.get_instructions() ) {
                        if ( instruction instanceof  MainInstruction ) {
                            let value = instruction.interpret(tree, global_table);

                            let error;
                            if ( instruction instanceof Break ) {
                                error = new Exception("Semantic", "Instruction Break is loop or switch instruction", instruction.row, instruction.column);
                                tree.get_errors().push(error);
                                tree.update_console(error.toString());
                                continue;
                            }

                            if ( instruction instanceof Continue ) {
                                error = new Exception("Semantic", "Instruction Continue is loop instruction", instruction.row, instruction.column);
                                tree.get_errors().push(error);
                                tree.update_console(error.toString());
                                continue;
                            }

                            if ( instruction instanceof Return ) {
                                console.log(value);
                            }
                        }
                    }
                }

                /* Fourth run for instruction outside main */
                for ( let instruction of tree.get_instructions() ) {
                    if ( !(instruction instanceof MainInstruction || instruction instanceof Declaration
                        || instruction instanceof Assignment || instruction instanceof Function || instruction instanceof Struct) ) {
                        let error = new Exception("Semantic", "Instruction outside main", instruction.row, instruction.column);
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
            } catch (e) {
                return e;
            }
        }

        console.log(tree.get_instructions());
        console.log(tree.get_global_table());
        console.log(tree.get_errors());
        console.log(tree.get_all_structs());
        
        
        
        return tree.get_console();
        // console.log(res);
    }

    compile (bufferStream: string) {
        console.log(`Compilando ${bufferStream}`);
        let generator_aux = new Generator3D();
        generator_aux.clean_all();
        let generator = generator_aux.get_instance();

        return bufferStream;
    }
}