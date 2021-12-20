import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import {Generator3D} from "../Generator/Generator3D";

export abstract class Instruction {

    public row: Number;
    public column: Number;

    constructor(row: Number, column: Number) {
        this.row = row;
        this.column = column;
    }

    abstract interpret(tree: Tree, table: SymbolTable): any;
    abstract get_node(): any;

    abstract compile(table: SymbolTable, generator: Generator3D, tree: Tree): any;
}