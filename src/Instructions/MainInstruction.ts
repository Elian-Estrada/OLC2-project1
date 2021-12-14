import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {Function} from "./Function.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";

export class MainInstruction extends Instruction {

    private instructions: Array<Instruction>;

    constructor(instructions: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.instructions = instructions;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let new_table = new SymbolTable(table, "Method_Main");
        tree.set_symbol_table(new_table);

        for ( let item of this.instructions ) {
            if ( item instanceof Function ) {
                let error = new Exception("Semantic", "The instruction func don't be into of method main", item.row, item.column);
                tree.get_errors().push(error);
                tree.update_console(error.toString());
            }

            let instruction = item.interpret(tree, new_table);
            
            // if ( instruction === undefined ){
            //     console.log("entro");    
            //     return;
            // }

            if ( instruction instanceof Exception ) {
                //let error = new Exception("Semantic", "The instruction Continue is loop instruction", item.row, item.column);
                tree.get_errors().push(instruction);
                tree.update_console(instruction.toString());
            }

            if ( instruction instanceof Break ) {
                let error = new Exception("Semantic", "The instruction Break is loop instruction", item.row, item.column);
                tree.get_errors().push(error);
                tree.update_console(error.toString());
            }

            if ( instruction instanceof Continue ) {
                let error = new Exception("Semantic", "The instruction Continue is loop instruction", item.row, item.column);
                tree.get_errors().push(error);
                tree.update_console(error.toString());
            }
        }

        console.log(new_table)
    }

    get_node() {
        let node = new Cst_Node("Main");
        return node;
    }
}