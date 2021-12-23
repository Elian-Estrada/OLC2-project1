import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Pow extends Function {

    private exp1: any;
    private exp2: any;

    constructor(exp1: any, exp2: any, type: string, name: string, params: Array<any>,
                instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);

        this.exp1 = exp1;
        this.exp2 = exp2;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let base = this.exp1.interpret(tree, table);

        if (base instanceof Exception){
            return base;
        }

        let pow = this.exp2.interpret(tree, table);

        if (pow instanceof Exception){
            return pow;
        }

        if (this.exp1.get_type() !== type.INT && this.exp1.get_type() !== type.DOUBLE){
            return new Exception("Semanitc", `The base: ${base} can only be of type int|double`, this.exp1.row, this.exp1.column, table.get_name());
        }

        if (this.exp2.get_type() !== type.INT){
            return new Exception("Semantic", `The pow: ${pow} can only be of type int`, this.exp2.row, this.exp2.column, table.get_name());
        }

        this.type = this.exp1.get_type();
        return base ** pow;
    }

    get_node(): Cst_Node {
        let node = new Cst_Node("Pow");
        node.add_child("pow");
        node.add_child("(");
        node.add_childs_node(this.exp1.get_node());
        node.add_child(",");
        node.add_childs_node(this.exp2.get_node());
        node.add_child(")");

        return node;
    }

}