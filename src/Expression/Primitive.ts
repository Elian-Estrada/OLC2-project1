import { Instruction } from "../Abstract/Instruction";
import SymbolTable from "../SymbolTable/SymbolTable";
import Tree from "../SymbolTable/Tree";
import { type } from "../SymbolTable/Type";

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