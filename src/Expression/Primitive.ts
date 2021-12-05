import { Instruction } from "../Abstract/Instruction.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Primitive extends Instruction {

    private type: type;
    private value: String;

    constructor(value: String, type: type, row: Number, column: Number) {
        super(row, column);
        this.type = type;
        this.value = value;
    }

    interpret(tree: Tree, table: SymbolTable){
        return this.value;
    }
    

    get_type(): type{
        return this.type;
    }

    toString(): String {
        return this.value;
    }
}