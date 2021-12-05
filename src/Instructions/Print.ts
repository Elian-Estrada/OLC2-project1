import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";

export class Print extends Instruction {

    private expression: any;

    constructor(expression: any, row: number, col: number) {
        super(row, col);
        this.expression = expression;
    }

    public interpret(tree: Tree, table: SymbolTable) {
        let value = this.expression.interpret(tree, table);

        if ( value instanceof Error )
            return value;

        if ( this.expression.getType() == type.ARRAY ) {
            return new Exception("Semantic", "Don't print array", this.row, this.column);
        }
        else if ( this.expression.getType() == type.NULL ) {
            return new Exception("Semantic", "Null Pointer Exception", this.row, this.column);
        }

        tree.update_console(`> ${ value.toString() }`);
    }
}