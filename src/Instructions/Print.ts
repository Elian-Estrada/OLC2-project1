import {Instruction} from "../Abstract/Instruction";
import Tree from "../SymbolTable/Tree";
import SymbolTable from "../SymbolTable/SymbolTable";
import {type} from "../SymbolTable/Type";
import Exception from "../SymbolTable/Exception";

export class Print {

    private expression: any;
    private readonly row: number;
    private readonly col: number;

    constructor(expression: any, row: number, col: number, ifln: boolean = false) {
        this.expression = expression;
        this.row = row;
        this.col = col;
    }

    public interpret(tree: Tree, table: SymbolTable) {
        let value = this.expression.interpret(tree, table);

        if ( value instanceof Error )
            return value;

        if ( this.expression.getType() == type.ARRAY ) {
            return new Exception("Semantic", "Don't print array", this.row, this.col);
        }
        else if ( this.expression.getType() == type.NULL ) {
            return new Exception("Semantic", "Null Pointer Exception", this.row, this.col);
        }

        tree.update_console(`> ${ value.toString() }`);
    }
}