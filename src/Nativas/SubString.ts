import {Function} from "../Instructions/Function.js";
import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {type} from "../SymbolTable/Type.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";

export class SubString extends Function {

    private id: any;
    private from: any;
    private to: any;

    constructor(id: any, from: any, to: any, type: string, name: string, params: Array<any>,
                instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);

        this.id = id;
        this.from = from;
        this.to = to;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let id_founded = this.id.interpret(tree, table);
        if ( id_founded === null )
            return new Exception("Semantic", "Identifier not found in the current context", this.row, this.column, table.get_name());

        if ( this.id.get_type() !== type.STRING )
            return new Exception("Semantic", `The type ${id_founded.type} not valid for Length`, this.row, this.column, table.get_name());

        let from = this.from.interpret(tree, table);

        if (from instanceof Exception){
            return from;
        }

        if (this.from.get_type() !== type.INT){
            return new Exception("Semantic", `The expression can be only of type: int`, this.from.row, this.from.column, table.get_name());
        }

        if (from > id_founded.length || from < 0){
            return new Exception("Semantic", `The index: ${from} out of range`, this.from.row, this.from.column, table.get_name());
        }

        let to = this.to.interpret(tree, table);

        if (to instanceof Exception){
            return to;
        }

        if (this.to.get_type() !== type.INT){
            return new Exception("Semantic", `The expression can be only of type: int`, this.to.row, this.to.column, table.get_name());
        }

        // @ts-ignore
        to = parseInt(to) + 1;
        
        if (to > id_founded.length){
            return new Exception("Semantic", `The index: ${to - 1} out of range`, this.row, this.column, table.get_name());
        }

        this.type = type.STRING;
        return id_founded.substring(from, to);
    }

    get_node(): Cst_Node {
        let node = new Cst_Node("SubString");
        node.add_childs_node(this.id.get_node());
        node.add_child(".");
        node.add_child("subString");
        node.add_child("(");
        node.add_childs_node(this.from.get_node());
        node.add_child(",");
        node.add_childs_node(this.to.get_node());
        node.add_child(")");

        return node;
    }
}