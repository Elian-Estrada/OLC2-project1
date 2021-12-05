// @ts-ignore
import {grammar} from "./grammar.js";
import { Instruction } from "./Abstract/Instruction.js";
import Tree from "./SymbolTable/Tree.js";
import SymbolTable from "./SymbolTable/SymbolTable.js";

export class Main {
    lexicalAnalysis(bufferStream: string) {
        console.log(`Analizando ${bufferStream}`);
        // @ts-ignore
        //return grammar.parse(bufferStream);

        let instructions: Array<Instruction>;
        instructions = grammar.parse(bufferStream);
        
        let tree: Tree = new Tree(instructions);
        let global_table: SymbolTable = new SymbolTable(undefined, undefined);

        tree.set_global_table(global_table);
        
        for (let instruction of tree.get_instructions()){
            instruction.interpret(tree, global_table);
        }
        console.log(tree.get_instructions());
        console.log(tree.get_global_table());
        
        return tree.get_console();
        
        
        
        // console.log(res);
    }
}