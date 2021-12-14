import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";
import {Continue} from "./Continue.js";
import {type} from "../SymbolTable/Type.js";
import {If} from "./If.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";

export class Function extends Instruction {

    private name: string;
    private params: Array<any>;
    private instructions: Array<Instruction>;
    protected type: any;

    constructor(type: string, name: string, params: Array<any>, instructions: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.instructions = instructions;
        this.name = name;
        this.params = params;
        this.type = type;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let new_table = new SymbolTable(table, `Function-${this.name}-${this.row}-${this.column}`);
        
        for ( let instruction of this.instructions ) {
            let value = instruction.interpret(tree, new_table);

            if ( value === "void" )
                return;

            if ( value instanceof Exception ) {
                tree.get_errors().push(value);
                tree.update_console(value.toString());
            }

            let error = null;
            if ( value instanceof Break ) {
                error = new Exception("Semantic", "Instruction Break out of loop", instruction.row, instruction.column);
                tree.get_errors().push(error);
                // tree.get_update(error);
            }

            if ( value instanceof Continue ) {
                // console.log("Hola")
                error = new Exception("Semantic", "Instruction Continue out of loop", instruction.row, instruction.column);
                tree.get_errors().push(error);
            }

            if ( value instanceof Return ) {
                console.log(this.type)
                if (this.type == type.VOID) {
                    // console.log("Hola")
                    return new Exception("Semantic", "Function should not return anything", instruction.row, instruction.column);
                }

                if (this.type != value.get_type()) {
                    return new Exception("Semantic", "Function doesn't return same data type", instruction.row, instruction.column);
                }

                return value.get_result();
            }
        }

        if (this.type !== type.VOID){
            return new Exception("Semantic", `Function of type: ${this.type} expected one Return`, this.instructions[this.instructions.length - 1].row, this.instructions[this.instructions.length - 1].column);
        }

        return null;
    }

    public get_type() {
        return this.type;
    }

    public get_name() {
        return this.name;
    }

    public get_params() {
        return this.params;
    }

    get_node() {
        let node = new Cst_Node("Function");
        return node;
    }
}