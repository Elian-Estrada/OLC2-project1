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

export class Main {
    lexicalAnalysis(bufferStream: string) {
        //console.log(`Analizando ${bufferStream}`);
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
                        instruction instanceof Assignment ) {
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
}