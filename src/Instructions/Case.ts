import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";

export class Case extends Instruction {

    private expr: any;
    private instructions: Array<Instruction>;

    constructor(expr: any, instructions: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.expr = expr;
        this.instructions = instructions;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        return this.expr.interpret(tree, table);
    }

    public get_instructions() {
        return this.instructions;
    }

    public get_value() {
        return this.expr;
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        let node = new Cst_Node("Case");
        node.add_child("case");
        node.add_childs_node(this.expr.get_node());
        node.add_child(":");

        let instructions = new Cst_Node("Instructions");
        for (let item of this.instructions){
            instructions.add_childs_node(item.get_node());
        }

        node.add_childs_node(instructions);

        return node;
    }
}