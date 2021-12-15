import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Access_array extends Instruction {

    private id: any;
    private positions: Array<any>;
    private expression: any;
    private values: any; 
    private value: any;
    private type: type;

    constructor(id: any, positions: Array<any>, expression: any, row: number, column: number) {
        super(row, column);
        this.id = id;
        this.positions = positions;
        this.expression = expression;
        this.values = [];
        this.value = null;
        this.type = type.NULL;
    }

    interpret(tree: Tree, table: SymbolTable){

        let array = this.id.interpret(tree, table);

        if (array instanceof Exception){
            return array;
        }

        if (array.get_type_array() !== type.ARRAY){
            return new Exception("Semantic", `The variable: ${array.get_id()} isn't an Array`, array.row, array.column);
        }


        let exp = null;
        if (this.expression !== null){
            exp = this.expression.interpret(tree, table);

            if (exp instanceof Exception){
                return exp;
            }
        }

        this.values = array.get_value();

        let result = this.get_values(this.positions, this.values, exp, array.get_subtype(), tree, table);

        if (result === null){
            return null;
        }

        if (result instanceof Exception){
            return result;
        }

        this.value = result;

        if (result instanceof Array){
            this.type = type.ARRAY;
            return this;
        } else {
            this.type = array.get_subtype();
            return this.value;
        }
    }

    get_values(positions: Array<any>, array: any, value: any, type_array: type, tree: Tree, table: SymbolTable): any{

        if (positions.length !== 0 && array !== undefined){

            if (value === null){

                let pos = positions[0].interpret(tree, table);

                if (pos instanceof Exception){
                    return pos;
                }

                if (positions[0].get_type() !== type.INT){
                    return new Exception("Semantic", `The index of array cannot be of type: ${positions[0].get_type()} expected type: ${type.INT}`, positions[0].row, positions[0].column);
                }

                return this.get_values(positions.slice(1), array[positions[0]], value, type_array, tree, table);
            }

            if (positions.length === 1 && array[positions[0]] !== undefined){

                if (this.expression.get_type() !== type_array){
                    return new Exception("Semantic", `The type: ${this.expression.get_type()} cannot be assignated at array of type: ${type_array}`, this.expression.row, this.expression.column);
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

                array[positions[0]] = value;

                return null;

            } else if (positions.length !== 1){
                return this.get_values(positions.slice(1), array[positions[0]], value, type_array, tree, table);
            } else {
                return new Exception("Semantic", "The index out of range", this.positions[this.positions.length - 1].row, this.positions[this.positions.length - 1].column);    
            }

        }

        if (array === undefined){
            return new Exception("Semantic", "The index out of range", this.positions[this.positions.length - 1].row, this.positions[this.positions.length - 1].column);
        }

        return array;

    }


    get_value(){
        return this.value;
    }

    get_type(){
        return this.type;
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        let node = new Cst_Node("Access Array");
        node.add_child(this.id);
        
        let positions = new Cst_Node("Expressions Array");

        for (let item of this.positions){
            positions.add_child("[");
            positions.add_childs_node(item.get_node());
            positions.add_child("]");
        }

        node.add_childs_node(positions);

        if (this.expression !== null){
            node.add_child("=");
            node.add_childs_node(this.expression.get_node());
        }

        return node;
    }

    toString(){
        return String(this.value);
    }
}