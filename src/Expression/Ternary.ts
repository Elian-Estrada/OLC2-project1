import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";

export class Ternary extends Instruction {

    private expr: any;
    private exp_if_true: any;
    private exp_if_false: any;
    private value: any;

    constructor(expr: any, exp_if_true: any, exp_if_false: any, row: number, col: number) {
        super(row, col);
        this.expr = expr;
        this.exp_if_true = exp_if_true;
        this.exp_if_false = exp_if_false;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let flag: boolean = this.expr.interpret(tree, table);

        if (this.expr.get_type() === type.BOOL) {

            // let new_table = new SymbolTable(table, `Ternary-${this.row}-${this.column}`);
            if (JSON.parse(String(flag))) {

                let res_if_true = this.exp_if_true.interpret(tree, table);
                if ( res_if_true instanceof Exception )
                    return res_if_true;

                this.value = res_if_true;
            }
            else {
                let res_if_false = this.exp_if_false.interpret(tree, table);
                if ( res_if_false instanceof Exception )
                    return res_if_false;

                this.value = res_if_false
            }
        }

        return this.value;
    }

    public get_type(): type | null {
        return this.exp_if_false.get_type();
    }
}