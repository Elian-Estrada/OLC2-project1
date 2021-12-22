import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";
import {type} from "../SymbolTable/Type.js";

export class Return extends Instruction {

    private expr: any;
    private type: string | null;
    private result: any | null;

    constructor(expr: any, row: number, col: number) {
        super(row, col);
        this.expr = expr;
        this.type = null;
        this.result = null;
    }

    public interpret(tree: Tree, table: SymbolTable): any {

        if ( this.expr == null ){
            //return "void";
            this.type = type.VOID;
            this.result = null;
            return this;
        }

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

    compile(table: SymbolTable, generator: Generator3D, tree: Tree): any {

        if ( this.expr != null ) {
            // console.log(this.expr)
            let value = this.expr.compile(table, generator, tree);

            if ( value.type == type.BOOL ) {
                let temp_label = generator.newLabel();
                generator.setLabel(value.true_label);
                generator.setStack('P', '1');
                generator.addGoTo(temp_label);

                generator.setLabel(value.false_label);
                generator.setStack('P', '0');
                generator.setLabel(temp_label);
                table.value_ret = value.value;
            } else {
                console.log(value);
                generator.setStack('P', value.value);
            }

            generator.addGoTo(table.return_label);
        } else
            return;
    }
}