import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Push extends Function {

    private id: any;
    private expression: any;

    constructor(id: any, expression: any, type: string, name: string, params: Array<any>,
        instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);
        this.id = id;
        this.expression = expression;
    }

    interpret(tree: Tree, table: SymbolTable) {

        let symbol = this.id.interpret(tree, table);

        if (symbol instanceof Exception){
            return symbol;
        }
        
        let value = this.expression.interpret(tree,table);

        if (value instanceof Exception){
            return value;
        }

        if(symbol.get_type() === type.ARRAY && symbol.get_subtype() !== this.expression.get_type()){
            return new Exception("Semantic", `The type: ${this.expression.get_type()} cannot be assignment to array of type: ${symbol.get_subtype()}`, this.expression.row, this.expression.column, table.get_name());
        } else if (symbol.get_type() !== type.ARRAY) {
            return new Exception("Semantic", `This function is only for arrays`, this.id.row, this.id.column, table.get_name());
        }

        switch(this.expression.get_type()){
            case type.INT:
                value = parseInt(value);
                break;
            case type.DOUBLE:
                value = parseFloat(value);
                break;
            case type.BOOL:
                value = JSON.parse(value);
                break;
        }

        symbol.get_value().push(value);

        return null;
    }

    get_node(): Cst_Node {
        let node = new Cst_Node("Push");
        node.add_childs_node(this.id.get_node());
        node.add_child(".");
        node.add_child("push");
        node.add_child("(");
        node.add_childs_node(this.expression.get_node());
        node.add_child(")");

        return node;
    }

}