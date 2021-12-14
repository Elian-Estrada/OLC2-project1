import { Instruction } from "../Abstract/Instruction.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";
import {Generator3D} from "../Generator/Generator3D.js";

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

    get_value() {
        return this.value;
    }

    get_type(): type{
        return this.type;
    }

    toString(): String {
        return this.value;
    }

    compile(table: SymbolTable): any {
        let generator_aux = new Generator3D();
        let generator = generator_aux.get_instance();

        if ( this.type === type.INT || this.type === type.DOUBLE )
            return this.value;
    }
}