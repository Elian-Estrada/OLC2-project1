import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {type} from "../SymbolTable/Type.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";

export class While extends Instruction {

    private expr: any;
    private instructions: Array<Instruction>;
    private counter: number;

    constructor(expr: any, instructions: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.expr = expr;
        this.instructions = instructions;
        this.counter = 0;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        try {
            
            while (true && this.counter < 100000) {
                let flag = this.expr.interpret(tree, table);

                if ( flag instanceof Exception )
                    return flag;

                if ( this.expr.get_type() == type.BOOL ) {
                    if ( String(flag) == "true" ) {
                        let new_table = new SymbolTable(table, `While-${this.row}-${this.column}`);

                        for ( let item of this.instructions ) {
                            let instruction = item.interpret(tree, new_table);

                            if ( instruction instanceof Exception ) {
                                tree.get_errors().push(instruction);
                                tree.update_console(instruction.toString());
                            }

                            if ( instruction instanceof Continue ) {
                                break;
                            } else if ( instruction instanceof Break ) {
                                return null;
                            } else if ( instruction instanceof Return ) {
                                return instruction;
                            }
                        }
                    } else {
                        break;
                    }
                } else {
                    return new Exception("Semantic", `Expect a Boolean type expression. Not ${this.expr.get_type().name}`, this.row, this.column, table.get_name());
                }

                this.counter += 1;
            }

            if (this.counter >= 100000){
                throw "Infinity Loop in While";
            }

        } catch (error) {
            return new Exception("Semantic", "" + error, this.row, this.column, table.get_name());
        }
    }

    get_node() {
        let node = new Cst_Node("While");

        node.add_child("while");
        node.add_child("(");
        node.add_childs_node(this.expr.get_node());
        node.add_child(")");
        node.add_child("{");

        let instructions = new Cst_Node("Instructions");

        for(let item of this.instructions){
            instructions.add_childs_node(item.get_node());
        }
        node.add_childs_node(instructions);

        node.add_child("}");

        return node;
    }
    
    compile(table: SymbolTable, generator: Generator3D, tree: Tree): any {
        let continue_label = generator.newLabel();
        generator.setLabel(continue_label);
        let condition = this.expr.compile(table, generator, tree);
        // let new_env = new SymbolTable(table, "While-Env-3D");
        table.break_label = condition.false_label;
        table.continue_label = continue_label;

        generator.setLabel(condition.true_label);

        for (let inst of this.instructions ) {
            inst.compile(table, generator, tree);
        }
        generator.addGoTo(continue_label);
        generator.setLabel(condition.false_label);
    }
}