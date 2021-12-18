import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {Declaration} from "./Declaration.js";
import Exception from "../SymbolTable/Exception.js";
import {type} from "../SymbolTable/Type.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";

export class For extends Instruction {
    compile(table: SymbolTable, generator: Generator3D) {
        generator.addComment("----FOR CYCLE----");

        let value = this.condition.compile(table, generator);

        if ( value.type == type.STRING ) {
            let variable = this
        }
    }

    private init: Instruction;
    private condition: any;
    private step: Instruction;
    private counter: number;
    private instructions: Array<Instruction>;

    constructor(init: Instruction, condition: any, step: Instruction,
                instructions: Array<Instruction>, row: number, col:number) {
        super(row, col);
        this.init = init;
        this.condition = condition;
        this.step = step;
        this.instructions = instructions;
        this.counter = 0;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        if ( !(typeof null in ( this.init ))
            || !(typeof null in ( this.condition ))
            || !(typeof null in ( this.step )) ) {

            let new_table = undefined;
            let declare_flag = false;
            let start = null;

            if (this.init instanceof Declaration) {
                new_table = new SymbolTable(table, `Init_For-${this.row}-${this.column}`);
                declare_flag = true;
                start = this.init.interpret(tree, new_table);
            } else {
                start = this.init.interpret(tree, table);
            }

            if (start instanceof Exception)
                return start;

            try {
                
                while (true && this.counter < 100000) {
                    let flag = null;
                    if ( new_table == null ) {
                        flag = this.condition.interpret(tree, table)
                    } else {
                        flag = this.condition.interpret(tree, new_table);
                    }
    
                    if ( flag instanceof Exception )
                        return flag;
    
                    if ( this.condition.get_type() == type.BOOL ) {
                        if ( String(flag) == "true" ) {
    
                            if ( !JSON.parse( String(declare_flag) ) ) {
                                new_table = new SymbolTable(table, `For-${this.row}-${this.column}`);
                            }
                            else {
                                new_table = new SymbolTable(new_table, `For-${this.row}-${this.column}`);
                            }
    
                            if ( this.instructions != null ) {
                                for ( let item of this.instructions ) {
                                    let instruction = item.interpret(tree, new_table);
    
                                    if ( instruction instanceof  Exception ) {
                                        tree.get_errors().push(instruction);
                                        tree.update_console(instruction.toString());
                                    }
    
                                    if ( instruction instanceof Continue )
                                        break;
    
                                    if ( instruction instanceof Break )
                                        return null;
    
                                    if ( instruction instanceof Return )
                                        return instruction;
                                }
    
                                let step = this.step.interpret(tree, new_table);
    
                                if ( step instanceof Exception )
                                    return step;
                            }
                        } else {
                            break;
                        }
                    } else {
                        return new Exception("Semantic", `Expect a Boolean type expression`, this.row, this.column);
                    }
                    this.counter += 1;
                }
    
                if (this.counter >= 100000){
                    throw "Infinity Loop in For"
                }

            } catch (error) {
                return new Exception("Semantic", "" + error, this.row, this.column);
            }

        } else {
            return new Exception("Semantic", "Expression Expected", this.row, this.column);
        }
    }

    get_node() {
        let node = new Cst_Node("For");
        node.add_child("for");
        node.add_child("(");
        node.add_childs_node(this.init.get_node());
        node.add_child(";");
        node.add_childs_node(this.condition.get_node());
        node.add_child(";");
        node.add_childs_node(this.step.get_node());
        node.add_child(")");
        node.add_child("{");
        
        let instructions = new Cst_Node("Instructions");

        for (let item of this.instructions){
            instructions.add_childs_node(item.get_node());
        }

        node.add_childs_node(instructions);
        node.add_child("}");

        return node;
    }
}