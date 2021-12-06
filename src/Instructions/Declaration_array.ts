import { Instruction } from "../Abstract/Instruction.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Declaration_array extends Instruction {

    private type: type;
    private type_array: type;
    private id: string;
    private expression: any;
    private list_expression: Array<any>;

    constructor(row: number, column: number) {
        super(row, column);
        this.id = "";
        this.type = type.ARRAY
        this.type_array = this.type;
        this.expression = [];
        this.list_expression = [];

    }

    interpret(tree: Tree, table: SymbolTable){

    }
}