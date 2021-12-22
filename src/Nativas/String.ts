import {Cst_Node} from "../Abstract/Cst_Node.js";
import {Instruction} from "../Abstract/Instruction.js";
import {Function} from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import {type} from "../SymbolTable/Type.js";
import {Generator3D} from "../Generator/Generator3D.js";
import {Value} from "../Abstract/Value.js";
import {Primitive} from "../Expression/Primitive.js";

export class String extends Function {

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

        if (this.expression.get_type() === type.STRUCT){
            value = this.print_struct(this.expression);
        } else {
            if (this.expression.get_type() === type.ARRAY){
                value = JSON.stringify(value.get_value()).toString();
            }
            
            value = JSON.stringify(value);
        }

        this.type = type.STRING;
        
        return value;

    }

    print_struct(struct: any){
        
        if (struct.value === "null"){

            return `null`

        } else {

            if (struct.value !== undefined){
                struct = struct.value;
            }

            let params = `${struct.id}(`;
            for(let item of struct.attributes){
                if (item.type === type.STRUCT){
                    params += this.print_struct(item) + ",";
                } else if(item.type === type.ARRAY){
                    
                    params += JSON.stringify(item.value) + ","
                } else {
                    params += item.value + ",";
                }

            }

            return params.slice(0, params.length - 1) + ")";

        }

    }

    get_node(): Cst_Node {
        let node = new Cst_Node("String");
        node.add_child("string");
        node.add_child("(");
        node.add_childs_node(this.expression.get_node());
        node.add_child(")");

        return node;
    }

    compile(table: SymbolTable, generator: Generator3D, tree: Tree) {
        let new_val = this.expression.value.toString();
        let new_prim = new Primitive(new_val, type.STRING, this.row, this.column);
        let val_ret = new_prim.compile(table, generator, tree);
        return new Value(val_ret.value, type.STRING, false);
    }
}