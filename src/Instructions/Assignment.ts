import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Access_struct } from "../Expression/Access_struct.js";
import { Identifier } from "../Expression/Identifier.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Assignment extends Instruction{

    private id: string;
    private expression: any;

    constructor(id: string, expression: any, row: number, column: number) {
        super(row, column);
        this.id = id;
        this.expression = expression;
    }

    interpret(tree: Tree, table: SymbolTable){

        let value = this.expression.interpret(tree, table);

        if (value instanceof Exception){
            return value;
        }

        if (this.expression.get_type() === type.ARRAY){
            //array implemented
            if (this.expression instanceof Access_struct){
                //do anything
            }

        }

        if (this.expression instanceof Identifier && this.expression.get_type() === type.STRUCT){
            value = value;
        }

        if (this.expression.get_type() === type.STRUCT && this.expression instanceof Access_struct){
            value = value.get_value().value;
        }

        let new_symbol = new Symbol(this.id, this.expression.get_type(), this.row, this.column, value);
        let result = table.update_table(new_symbol);

        if (result instanceof Exception){
            return result;
        }

        return undefined;

    }

    get_id(){
        return this.id;
    }

    get_expression(){
        return this.expression;
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        let node = new Cst_Node("Assignment");
        node.add_child(this.id);
        node.add_child("=");
        node.add_childs_node(this.expression.get_node());

        return node;
    }

}