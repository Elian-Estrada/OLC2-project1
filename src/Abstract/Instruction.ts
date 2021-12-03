import SymbolTable from "../SymbolTable/SymbolTable";
import Tree from "../SymbolTable/Tree";

export abstract class Instruction {

    public row: Number;
    public column: Number;

    constructor(row: Number, column: Number) {
        this.row = row;
        this.column = column;
    }

    abstract interpret(tree: Tree, table: SymbolTable): any;

}