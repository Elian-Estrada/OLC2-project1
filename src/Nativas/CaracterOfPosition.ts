import {Function} from "../Instructions/Function.js";
import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {type} from "../SymbolTable/Type.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";

export class CaracterOfPosition extends Function {

    private id: any;
    private n: any;

    constructor(id: any, n: any, type: string, name: string, params: Array<any>,
                instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);

        this.id = id
        this.n = n;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let id_founded = this.id.interpret(tree, table);
        if ( id_founded === null )
            return new Exception("Semantic", "Identifier not found in the current context", this.row, this.column, table.get_name());

        if ( this.id.get_type() !== type.STRING )
            return new Exception("Semantic", `The type ${id_founded.type} not valid for Length`, this.row, this.column, table.get_name());

        let n = this.n.interpret(tree, table);

        if (n instanceof Exception){
            return n;
        }

        if (this.n.get_type() !== type.INT){
            return new Exception("Semantic", `The expression can be only of type: int`, this.n.row, this.n.column, table.get_name());
        }

        if (n >= String(id_founded).length){
            return new Exception("Semantic", `The position: ${n} out of range`, this.row, this.column, table.get_name());
        }

        this.type = type.CHAR;
        return id_founded.charAt(n);
    }

    get_node(): Cst_Node {
        let node = new Cst_Node("CaracterOfPosition");
        node.add_childs_node(this.id.get_node());
        node.add_child(".");
        node.add_child("caracterOfPosition");
        node.add_child("(");
        node.add_childs_node(this.n.get_node());
        node.add_child(")");

        return node;
    }
}