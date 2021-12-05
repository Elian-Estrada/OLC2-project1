import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Inc_Dec extends Instruction {

    private expression: any;
    private type: type;

    constructor(expression: any, row: number, column: number) {
        super(row, column);
        this.expression = expression;
        this.type = type.NULL;
    }

    interpret(tree: Tree, table: SymbolTable){

        let value = this.expression.interpret(tree, table);

        if (value instanceof Exception){
            return value;
        }

        this.type = this.expression.get_type();
        return value;
    }
}