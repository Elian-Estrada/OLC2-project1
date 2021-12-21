import { Instruction } from "../Abstract/Instruction.js";
import { Generator3D } from "../Generator/Generator3D.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";

export class Interpolation extends Instruction {
    constructor(row: number, column: number){
        super(row, column);
    }

    interpret(tree: Tree, table: SymbolTable) {
        
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        
    }
}