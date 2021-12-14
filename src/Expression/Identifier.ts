import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import { type } from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";

export class Identifier extends Instruction {

    private id: string;
    private type: type;
    private value: string | any;

    constructor(id: string, row: number, col: number) {
        super(row, col);
        this.id = id;
        this.value = "null";
        this.type = type.NULL;
    }

    public interpret(tree: Tree, table: SymbolTable): any {
        let symbol = table.get_table(this.id);

        if (symbol == undefined){
            return new Exception("Semantic", `The id: ${this.id} doesn't exist in current context`, this.row, this.column);
        }

        this.type = symbol.type;
        this.value = symbol.value;

        return this.value;
    }

    get_type(){
        return this.type;
    }

    get_id(){
        return this.id;
    }

    get_value(){
        return this.value;
    }

    toString(): String{
        return this.value;
    }
}