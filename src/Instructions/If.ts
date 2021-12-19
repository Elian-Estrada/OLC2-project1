import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";
import {Value} from "../Abstract/Value.js";

export class If extends Instruction {

    private expr: any;
    public instructions: Array<Instruction>;
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
        let flag: any = this.expr.interpret(tree, table);
        // console.log(flag);

        if (flag instanceof Exception){
            return flag;
        }

        if (this.expr.get_type() === type.BOOL) {
            if (JSON.parse(String(flag))) {
                let new_table = new SymbolTable(table, `If - ${this.row}-${this.column}`)

                // console.log(this.instructions)
                for (let item of this.instructions) {
                    // console.log(item);
                    let instruction = item.interpret(tree, new_table);
                    // console.log(instruction)

                    if ( instruction === "void" )
                        return "void";

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
                    // console.log(result)

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

    get_node() {
        let node = new Cst_Node("If");

        node.add_child("if");
        node.add_child("(");
        node.add_childs_node(this.expr.get_node());
        node.add_child(")");
        node.add_child("{");

        let instructios = new Cst_Node("Instructions");
        for (let item of this.instructions){
            instructios.add_childs_node(item.get_node());
        }
        node.add_childs_node(instructios);
        node.add_child("}");

        if (this.else_instr !== null){
            let instrctiosn_else = new Cst_Node("Else Instructions");
            node.add_child("else");
            node.add_child("{");

            for(let item of this.else_instr){
                instrctiosn_else.add_childs_node(item.get_node());
            }

            node.add_childs_node(instrctiosn_else);
            node.add_child("}");
        } else if (this.elseif !== null){
            node.add_childs_node(this.elseif.get_node());
        }

        return node;
    }
    
    compile(table: SymbolTable, generator: Generator3D): any {
        let condition = this.expr.compile(table, generator);

        if ( condition.type !== type.BOOL ) {
            generator.addError("Condition is not a boolean value", Number(this.row), Number(this.column));
            return;
        }

        generator.setLabel(condition.true_label);
        for ( let instr of this.instructions ) {
            instr.compile(table, generator);
        }

        if ( this.elseif !== null ) {
            generator.setLabel(condition.false_label);
            this.elseif.compile(table, generator);
        }

        let label_exit_if = '';
        if ( this.else_instr !== null ) {
            label_exit_if = generator.newLabel();
            generator.addGoTo(label_exit_if);
        }

        generator.setLabel(condition.false_label);
        if ( this.else_instr !== null ) {
            for ( let else_instr of this.else_instr ) {
                else_instr.compile(table, generator);
                generator.setLabel(label_exit_if);
            }
        }
    }
}