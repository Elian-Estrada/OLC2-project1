import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";

export class Break extends Instruction {

    constructor(row: number, col: number) {
        super(row, col);
    }

    public interpret(tree: Tree, table: SymbolTable) {
        return this;
    }

    get_node() {
        return new Cst_Node("Break");
    }
    
    compile(table: SymbolTable, generator: Generator3D): any {
        if ( table.break_label == '' ) {
            generator.addError("Break transfer statement is not into a cycle", Number(this.row), Number(this.column));
            return;
        }

        generator.addGoTo(table.break_label);
    }
}