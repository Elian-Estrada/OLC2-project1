import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";
import {Continue} from "./Continue.js";
import {type} from "../SymbolTable/Type.js";

export class Function extends Instruction {

    private name: string;
    private params: Array<any>;
    private instructions: Array<Instruction>;
    private type: any;

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
            // console.log(instruction)
            let value = instruction.interpret(tree, new_table);
            // console.log(value)

            if ( value == undefined )
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
                error = new Exception("Semantic", "Instruction Continue out of loop", instruction.row, instruction.column);
                tree.get_errors().push(error);
            }

            if ( value instanceof Return ) {

                if ( this.type != value.get_type() ){
                    return new Exception("Semantic", "Function doesn't return same data type", instruction.row, instruction.column);
                }

                if ( this.type == type.VOID ) {
                    return new Exception("Semantic", "Function should not return anything", instruction.row, instruction.column);
                }

                return value.get_result();
            }
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
}