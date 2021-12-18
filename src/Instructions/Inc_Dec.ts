import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import {Arithmetic_operator, type} from "../SymbolTable/Type.js";
import {Primitive} from "../Expression/Primitive.js";
import {Value} from "../Abstract/Value.js";
import {Arithmetic} from "../Expression/Arithmetic.js";

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


    get_node() {
        let node = new Cst_Node("Incremento_Decremento");

        node.add_childs_node(this.expression.get_node())
        
        return node;
    }
    
    compile(table: SymbolTable, generator: Generator3D) {
        // let exp = this.expression.compile(table, generator);

        if ( this.expression.operator === Arithmetic_operator.INC ) {
            let new_prim = new Primitive('1', type.INT, this.row, this.column);
            let new_symbol = new Arithmetic(this.expression.exp1, new_prim, Arithmetic_operator.ADDITION, this.row, this.column);
            let new_val = new_symbol.compile(table, generator);

            let value = table.get_table(this.expression.exp1.id);
            // @ts-ignore
            let temp_pos = value.pos;
            generator.setStack(temp_pos, new_val.value);

            return new Value(new_val.value, type.INT, false);
        }
        else if ( this.expression === Arithmetic_operator.DEC ) {
            let new_prim = new Primitive('1', type.INT, this.row, this.column);
            let new_symbol = new Arithmetic(this.expression.exp1, new_prim, Arithmetic_operator.SUBSTRACTION, this.row, this.column);
            let new_val = new_symbol.compile(table, generator);
            return new Value(new_val.value, type.INT, false);
        }
    }
}