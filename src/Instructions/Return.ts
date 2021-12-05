import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception";

export class Return extends Instruction {

    private expr: any;
    private type: string;
    private result: string;

    constructor(expr: any, type: string, result: string, row: number, col: number) {
        super(row, col);
        this.expr = expr;
        this.type = type;
        this.result = result;
    }

    public interpret(tree: Tree, table: SymbolTable): any {
        let value = this.expr.interpret(tree, table);

        if ( value instanceof Exception )
            return value;

        this.type = this.expr.get_type();
        this.result = value;

        return this;
    }

    public get_type() {
        return this.type;
    }

    public get_result() {
        return this.type;
    }
}