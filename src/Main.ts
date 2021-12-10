// @ts-ignore
import { grammar, errors, clean_errors } from "./grammar.js";
import { Instruction } from "./Abstract/Instruction.js";
import Tree from "./SymbolTable/Tree.js";
import SymbolTable from "./SymbolTable/SymbolTable.js";
import Exception from "./SymbolTable/Exception.js";

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
                for (let instruction of tree.get_instructions()){
                    let result = instruction.interpret(tree, global_table);

                    if (result instanceof Exception){
                        tree.get_errors().push(result);
                        tree.update_console(result.toString());
                    }
                }
            } catch (e) {
                return e;
            }
        }

        console.log(tree.get_instructions());
        console.log(tree.get_global_table());
        console.log(tree.get_errors());
        
        
        return tree.get_console();
        // console.log(res);
    }
}