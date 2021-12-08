import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";

export class If extends Instruction {

    private expr: any;
    private instructions: Array<Instruction>;
    private else_instr: Array<Instruction>;
    private elseif: Instruction;

    constructor(expr: any, instructions: Array<Instruction>, else_instr: Array<Instruction>, elseif: Instruction, row: Number, col: Number) {
        super(row, col);
        this.expr = expr;
        this.instructions = instructions;
        this.else_instr = else_instr;
        this.elseif = elseif;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let flag: boolean = this.expr.interpret(tree, table);
        // console.log(flag);
        if (this.expr.get_type() === type.BOOL) {
            if (JSON.parse(String(flag))) {
                let new_table = new SymbolTable(table, `If - ${this.row}-${this.column}`)

                // console.log(this.instructions)
                for (let item of this.instructions) {
                    // console.log(item);
                    let instruction = item.interpret(tree, new_table);
                    // console.log(instruction)

                    if (instruction instanceof Exception) {
                        tree.get_errors().push(instruction);
                        tree.update_console(instruction.toString());
                    } else {
                        if ( (instruction instanceof Continue) ||
                            ( instruction instanceof Break )   ||
                            ( instruction instanceof Return ) ) {
                            return instruction;
                        }
                    }
                }
            } else {
                if (this.else_instr != null) {
                    let new_table = new SymbolTable(table, `Else-${this.row}-${this.column}`);

                    for (let item of this.else_instr) {
                        let instruction_else = item.interpret(tree, new_table);

                        if (instruction_else instanceof Exception) {
                            tree.get_errors().push(instruction_else);
                            tree.update_console(instruction_else.toString());
                        } else {
                            if ( (instruction_else instanceof Continue) ||
                                ( instruction_else instanceof Break )   ||
                                ( instruction_else instanceof Return ) ) {
                                return instruction_else;
                            }
                        }
                    }
                }
                else if ( this.elseif != null ) {
                    let result = this.elseif.interpret(tree, table);

                    if ( (result instanceof Continue) || ( result instanceof Break ) ||
                        ( result instanceof Return ) || ( result instanceof Exception ) ) {
                        return result;
                    }
                }
            }
        } else {
            return new Exception("Semantic", `Expect a Boolean type expression. Not ${this.expr.get_type().name}`, this.row, this.column);
        }
    }
}