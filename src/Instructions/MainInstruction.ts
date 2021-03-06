import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {Function} from "./Function.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break.js";
import {Generator3D} from "../Generator/Generator3D.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Push } from "../Nativas/Push.js";
import { Pop } from "../Nativas/Pop.js";
import { ToUpperCase } from "../Nativas/ToUpperCase.js";
import { ToLowerCase } from "../Nativas/ToLowerCase.js";
import { Length } from "../Nativas/Length.js";
import { CaracterOfPosition } from "../Nativas/CaracterOfPosition.js";
import { SubString } from "../Nativas/SubString.js";
import { Parse } from "../Nativas/Parse.js";
import { Graficar_ts } from "../Nativas/Graficar_ts.js";

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
            
            if ( item instanceof Function 
                && !(item instanceof Push)
                && !(item instanceof Pop)
                && !(item instanceof ToUpperCase)
                && !(item instanceof ToLowerCase)
                && !(item instanceof Length)
                && !(item instanceof CaracterOfPosition)
                && !(item instanceof SubString)
                && !(item instanceof Parse)
                && !(item instanceof Graficar_ts)
                ) {
                let error = new Exception("Semantic", "The instruction func don't be into of method main", item.row, item.column, new_table.get_name());
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
                let error = new Exception("Semantic", "The instruction Break is loop instruction", item.row, item.column, new_table.get_name());
                tree.get_errors().push(error);
                tree.update_console(error.toString());
            }

            if ( instruction instanceof Continue ) {
                let error = new Exception("Semantic", "The instruction Continue is loop instruction", item.row, item.column, new_table.get_name());
                tree.get_errors().push(error);
                tree.update_console(error.toString());
            }
        }
    }

    compile(table: SymbolTable, generator: Generator3D, tree: Tree): any {
        /*let generator_aux = new Generator3D();
        let generator = generator_aux.get_instance();*/
        generator.addComment("----COMPILE----");

        if ( this.instructions.length > 0 ) {
            for ( let item of this.instructions ) {
                // @ts-ignore
                if ( item === ';' ) {
                    generator.add_print("c", "char", 10);
                } else {
                    item.compile(table, generator, tree);
                }
            }
        }


        return generator.get_code();

    }
    
    get_node() {
        let node = new Cst_Node("Main");

        node.add_child("void");
        node.add_child("main");
        node.add_child("(");
        node.add_child(")");
        node.add_child("{");

        let instructions = new Cst_Node("Instructios");

        for (let item of this.instructions){
            instructions.add_childs_node(item.get_node());
        }
        node.add_childs_node(instructions);

        node.add_child("}");
        return node;
    }
}