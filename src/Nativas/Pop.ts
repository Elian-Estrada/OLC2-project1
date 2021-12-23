import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";
 
export class Pop extends Function {
    private id: any;

    constructor(id: any, expression: any, type: string, name: string, params: Array<any>,
        instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);
        this.id = id;
    }

    interpret(tree: Tree, table: SymbolTable) {
        
        let symbol = this.id.interpret(tree, table);

        if (symbol instanceof Exception){
            return symbol;
        }

        if (symbol.get_type() !== type.ARRAY){
            return new Exception("Semantic", `This function is only for arrays`, this.id.row, this.id.column, table.get_name());
        }

        this.type = symbol.get_subtype();
        return symbol.get_value().pop();

    }

    get_node(): Cst_Node {
        let node = new Cst_Node("Pop");
        node.add_childs_node(this.id.get_node());
        node.add_child(".");
        node.add_child("pop");
        node.add_child("(");
        node.add_child(")");

        return node;
    }
}