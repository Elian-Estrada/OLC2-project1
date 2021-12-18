import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";

export class Continue extends Instruction {

    constructor(row: number, col: number) {
        super(row, col);
    }

    public interpret(tree: Tree, table: SymbolTable): any {
        return this;
    }

    get_node() {
        return new Cst_Node("Continue");
    }
    
    compile(table: SymbolTable, generator: Generator3D): any {
        if ( table.continue_label == '' ) {
            generator.addError('Continue transfer statement is not into a cycle', Number(this.row), Number(this.column));
            return;
        }

        generator.addGoTo(table.continue_label);
    }
}