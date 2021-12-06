import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";

export class Print extends Instruction {

    private expression: any;
    private flag: boolean;

    constructor(expression: any, row: number, col: number, flag:boolean = true) {
        super(row, col);
        this.expression = expression;
        this.flag = flag;
    }
    
    public interpret(tree: Tree, table: SymbolTable) {
        console.log("algo");
        let value = this.expression.interpret(tree, table);

        if ( value instanceof Exception )
            return value;

        if ( this.expression.get_type() == type.ARRAY ) {
            return new Exception("Semantic", "Don't print array", this.row, this.column);
        }
        else if ( this.expression.get_type() == type.NULL ) {
            return new Exception("Semantic", "Null Pointer Exception", this.row, this.column);
        }

        tree.update_console(`${ value }`, this.flag);
    }
}