import { Instruction } from "../Abstract/Instruction.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";

export class Values_array extends Instruction{

    constructor(row: number, column: number){
        super(row, column);
    }

    interpret(tree: Tree, table: SymbolTable) {
        
    }

}