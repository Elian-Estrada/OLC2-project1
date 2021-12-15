import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Inc_Dec extends Instruction {

    private expression: any;
    private type: type;

    constructor(expression: any, row: number, column: number) {
        super(row, column);
        this.expression = expression;
        this.type = type.NULL;
    }

    interpret(tree: Tree, table: SymbolTable){

        let value = this.expression.interpret(tree, table);

        if (value instanceof Exception){
            return value;
        }

        this.type = this.expression.get_type();
        return value;
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        let node = new Cst_Node("Incremento_Decremento");

        node.add_childs_node(this.expression.get_node())
        
        return node;
    }
}