import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Access_struct } from "../Expression/Access_struct.js";
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class TypeOf extends Function {

    private expression: any;

    constructor(expression: any, type: string, name: string, params: Array<any>,
        instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);
        this.expression = expression;
    }

    interpret(tree: Tree, table: SymbolTable) {
        
        let value = this.expression.interpret(tree, table);
        
        if (value instanceof Exception){
            return value;
        }
        
        if (value.type === type.STRUCT && value.value !== "null"){
            if (value instanceof Access_struct){
                value = value.get_value().id
            } else {
                value = value.id;
            }
        } else {

            value = this.expression.get_type();
        }

        this.type = type.STRING;

        return value;

    }

    get_node(): Cst_Node {
        let node = new Cst_Node("TypeOf");
        node.add_child("typeof");
        node.add_child("(");
        node.add_childs_node(this.expression.get_node());
        node.add_child(")");

        return node;
    }

}