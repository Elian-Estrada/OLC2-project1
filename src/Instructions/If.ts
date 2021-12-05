import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break";
import {Return} from "./Return";

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

        if (this.expr.get_type() === type.BOOL) {
            if (flag) {
                let new_table = new SymbolTable(table, `If - ${this.row}-${this.column}`)

                for (let item of this.instructions) {
                    let instruction = item.interpret(tree, new_table);

                    if (instruction instanceof Exception) {
                        tree.get_errors().push(instruction);
                        tree.update_console(instruction.toString());
                    } else {
                        switch (instruction) {
                            case instruction instanceof Continue:
                            case instruction instanceof Break:
                            case instruction instanceof Return:
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
                            switch (instruction_else) {
                                case instruction_else instanceof Continue:
                                case instruction_else instanceof Break:
                                case instruction_else instanceof Return:
                                    return instruction_else;
                            }
                        }
                    }
                }
                else if ( this.elseif != null ) {
                    let result = this.elseif.interpret(tree, table);

                    switch (result) {
                        case result instanceof Continue:
                        case result instanceof Break:
                        case result instanceof Return:
                        case result instanceof Exception:
                            return result;
                    }
                }
            }
        } else {
            return new Exception("Semantic", `Expect a Boolean type expression. Not ${this.expr.get_type().name}`, this.row, this.column);
        }
    }
}