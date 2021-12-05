import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";

export class Identifier extends Instruction {

    private id: number;

    constructor(id: number, row: number, col: number) {
        super(row, col);
        this.id = id;
    }

    public interpret(tree: Tree, table: SymbolTable): any {
        let symbol;
    }
}