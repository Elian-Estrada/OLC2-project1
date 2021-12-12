import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";
import {Continue} from "./Continue.js";
import {type} from "../SymbolTable/Type.js";
import {If} from "./If.js";

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

    look_for_a_return(instruction: Instruction) {
        let flag = false;
        if ( instruction instanceof If ) {
            for ( let instr of instruction.instructions ) {

                if ( flag )
                    return flag;

                // console.log(instr);
                if ( instr instanceof Return ) {
                    console.log("Hola")
                    flag = true;
                    break;
                } else {
                    this.look_for_a_return(instr);
                }
            }
        }

        return flag;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let new_table = new SymbolTable(table, `Function-${this.name}-${this.row}-${this.column}`);

        let flag = false;
        if ( this.type !== type.VOID ) {
            flag = this.look_for_a_return(this.instructions[0]);
        } else {
            flag = true;
        }

        for ( let instruction of this.instructions ) {
            // console.log(instruction)
            if ( flag ) {
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
            } else {
                return new Exception("Semantic", "Function doesn't return anything", instruction.row, instruction.column);
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