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
        let value = this.expression.interpret(tree, table);
        // console.log(value)

        if ( value instanceof Exception )
            return value;

        if ( value === null )
            return new Exception("Semantic", "Error 'void' type not allowed here", this.row, this.column);

        if ( this.expression.get_type() == type.ARRAY ) {
            //return new Exception("Semantic", "Don't print array", this.row, this.column);
            console.log(value.get_value());
            
            value = JSON.stringify(value.get_value());
            
        }
        else if ( this.expression.get_type() == type.NULL ) {
            return new Exception("Semantic", "Null Pointer Exception", this.row, this.column);
        }

        tree.update_console(`${ value }`, this.flag);
    }
}