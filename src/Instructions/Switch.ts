import {Instruction} from "../Abstract/Instruction.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import {Relational} from "../Expression/Relational.js";
import {Relational_operator} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import {Break} from "./Break.js";
import {Continue} from "./Continue.js";
import {Return} from "./Return.js";
import {Case} from "./Case.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";

export class Switch extends Instruction {

    private expr: any;
    private list_cases: Array<Case>;
    private default_case: Array<Instruction>;
    private row_case: Number;
    private col_case: Number;
    private flag: boolean;

    constructor(expr: any, list_cases: Array<Case>, default_case: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.expr = expr;
        this.list_cases = list_cases;
        this.default_case = default_case;
        this.row_case = 0;
        this.col_case = 0;
        this.flag = false;
    }

    interpret(tree: Tree, table: SymbolTable) {
        if ( this.list_cases != null ) {
            for ( let item of this.list_cases ) {
                let rel = new Relational(this.expr, item.get_value(), Relational_operator.EQUAL, this.row, this.column);
                let res = rel.interpret(tree, table);

                if ( res instanceof Exception )
                    return res;

                if ( String(res) == "true" ) {
                    this.row_case = item.row;
                    this.col_case = item.column;

                    let res_interpret = this.execute_instructs(tree, table, item.get_instructions(), true);

                    if ( res_interpret == null && !JSON.parse(String(this.flag)) ) {
                        return null;
                    } else if ( res_interpret instanceof Return ) {
                        return res_interpret;
                    }
                }

                if ( JSON.parse( String(this.flag) ) ) {
                    this.flag = false;
                }
            }

            if ( this.default_case != null ) {
                return this.execute_instructs(tree, table, this.default_case);
            }
        }
        else if ( this.default_case != null ) {
            return this.execute_instructs(tree, table, this.default_case);
        }
    }

    public execute_instructs (tree: Tree, table: SymbolTable, instructs: Array<Instruction>, flag: boolean = false) {
        let new_table;
        if ( JSON.parse(String(flag)) ){
            new_table = new SymbolTable(table, `Switch-Case-${this.row_case}-${this.col_case}`);
        } else {
            new_table = new SymbolTable(table, `Switch-Case-${this.row}-${this.column}`);
        }

        for ( let item of instructs ) {
            let instr = item.interpret(tree, new_table);
            console.log(instr)

            if ( instr instanceof Exception ) {
                tree.get_errors().push(instr);
                tree.update_console(instr.toString());
            }

            if ( instr instanceof Break ) {
                return null;
            } else if ( ( instr instanceof Return ) || ( instr instanceof  Continue ) ) {
                return instr;
            }
        }

        if ( JSON.parse( String(flag) ) ) {
            this.flag = true;
        }
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        let node = new Cst_Node("Switch");

        node.add_child("switch");
        node.add_child("(");
        node.add_childs_node(this.expr.get_node());
        node.add_child(")");
        node.add_child("{");

        if (this.list_cases !== null){
            let cases = new Cst_Node("Cases");

            for (let item of this.list_cases){
                cases.add_childs_node(item.get_node());
            }
            node.add_childs_node(cases);
        }

        if (this.default_case !== null){
            let default_case = new Cst_Node("Default");
            default_case.add_child("default");
            default_case.add_child(":");

            let inst_default = new Cst_Node("Instructions");

            for (let item of this.default_case){
                inst_default.add_childs_node(item.get_node());
            }
            default_case.add_childs_node(inst_default);

            node.add_childs_node(default_case);
        }

        node.add_child("}");

        return node;
    }
}