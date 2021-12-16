import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";

export class Return extends Instruction {

    private expr: any;
    private type: string | null;
    private result: string | null;

    constructor(expr: any, row: number, col: number) {
        super(row, col);
        this.expr = expr;
        this.type = null;
        this.result = null;
    }

    public interpret(tree: Tree, table: SymbolTable): any {

        if ( this.expr == null )
            return "void";

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
        return this.result;
    }

    get_node() {
        let node = new Cst_Node("Return");

        if (this.expr !== null){
            node.add_childs_node(this.expr.get_node());
        }
        
        return node;
    }

    compile(table: SymbolTable, generator: Generator3D): any {
        return;
    }
}