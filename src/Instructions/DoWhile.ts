import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {type} from "../SymbolTable/Type.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";


export class DoWhile extends Instruction {

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
        let flag2 = false;
        try {
            
            while (true && this.counter < 100000) {
                let flag = this.expr.interpret(tree, table);
    
                if ( flag instanceof Exception )
                    return flag;
    
                if ( this.expr.get_type() == type.BOOL ) {
                    if ( String(flag) == "true" || !flag2 ) {
                        let new_table = new SymbolTable(table, `DoWhile-${this.row}-${this.column}`);
    
                        for ( let item of this.instructions ) {
                            let inst = item.interpret(tree, new_table);
    
                            if ( inst instanceof Exception ) {
                                tree.get_errors().push(inst);
                                tree.update_console(inst.toString());
                            }
    
                            if ( inst instanceof Continue ) {
                                break;
                            } else if ( inst instanceof Break ) {
                                return null;
                            } else if ( inst instanceof Return ) {
                                return inst;
                            }
                        }
                        flag2 = true;
                    } else {
                        break;
                    }
                } else {
                    return new Exception("Semantic", `Expect a Boolean type expression. Not ${this.expr.get_type().name}`, this.row, this.column);
                }
                this.counter += 1;
            }
    
            if (this.counter >= 100000){
                throw "Infinity Loop in Do-While";
            }

        } catch (error) {
            return new Exception("Semantic", "" + error, this.row, this.column);
        }
    }
}