import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";

export class Continue extends Instruction {

    constructor(row: number, col: number) {
        super(row, col);
    }

    public interpret(tree: Tree, table: SymbolTable): any {
        return this;
    }
}