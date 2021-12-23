import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";
import {Value} from "../Abstract/Value.js";

export class Access_array extends Instruction {

    private id: any;
    private positions: Array<any>;
    private expression: any;
    private values: any; 
    private value: any;
    private type: type;
    private sub_type: type;

    constructor(id: any, positions: Array<any>, expression: any, row: number, column: number) {
        super(row, column);
        this.id = id;
        this.positions = positions;
        this.expression = expression;
        this.values = [];
        this.value = null;
        this.type = type.NULL;
        this.sub_type = type.NULL;
    }

    interpret(tree: Tree, table: SymbolTable){

        let array = this.id.interpret(tree, table);

        if (array instanceof Exception){
            return array;
        }

        if (array.get_type() !== type.ARRAY){
            return new Exception("Semantic", `The variable: ${array.get_id()} isn't an Array`, array.row, array.column, table.get_name());
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
            this.sub_type = array.get_subtype();
            return this;
        } else {
            this.type = array.get_subtype();
            return this.value;
        }
    }

    get_values(positions: Array<any>, array: any, value: any, type_array: type, tree: Tree, table: SymbolTable): any{

        if (positions.length !== 0 && array !== undefined){

            let pos = positions[0].interpret(tree, table);
            if (value === null){

                if (pos instanceof Exception){
                    return pos;
                }

                if (positions[0].get_type() !== type.INT){
                    return new Exception("Semantic", `The index of array cannot be of type: ${positions[0].get_type()} expected type: ${type.INT}`, positions[0].row, positions[0].column, table.get_name());
                }

                return this.get_values(positions.slice(1), array[pos], value, type_array, tree, table);
            }

            if (positions.length === 1 && array[pos] !== undefined){

                if (this.expression.get_type() !== type_array){
                    return new Exception("Semantic", `The type: ${this.expression.get_type()} cannot be assignated at array of type: ${type_array}`, this.expression.row, this.expression.column, table.get_name());
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

                array[pos] = value;

                return null;

            } else if (positions.length !== 1){
                return this.get_values(positions.slice(1), array[pos], value, type_array, tree, table);
            } else {
                return new Exception("Semantic", "The index out of range", this.positions[this.positions.length - 1].row, this.positions[this.positions.length - 1].column, table.get_name());    
            }

        }

        if (array === undefined){
            return new Exception("Semantic", "The index out of range", this.positions[this.positions.length - 1].row, this.positions[this.positions.length - 1].column, table.get_name());
        }

        return array;

    }


    get_value(){
        return this.value;
    }

    get_type(){
        return this.type;
    }

    get_subtype(){
        return this.sub_type;
    }

    compile(table: SymbolTable, generator: Generator3D, tree: Tree) {
        let value = table.get_table(this.id.get_id());

        let temp_move = generator.addTemp();
        let temp_result = generator.addTemp();
        let val_ret = new Value(null, null, false);
        let exit_label = generator.newLabel();
        let init_size = generator.addTemp();
        let aux_index = generator.addTemp();

        // @ts-ignore
        let temp_pos = String(value.position);
        // @ts-ignore
        if ( value.environment !== 'Global' ) {
            temp_pos = generator.addTemp();
            // @ts-ignore
            generator.addExpression(temp_pos, 'P', value.position, '+');
        }

        generator.getStack(temp_move, temp_pos);
        generator.addExpression(temp_move, temp_move, '1', '+');

        if ( this.values.length === 1 ) {
            let index_val = this.positions[0].compile(table, generator, tree);
            let temp_aux = temp_move;

            generator.addExpression(temp_aux, temp_aux, this.getIndex(generator, index_val), '+');

            generator.getHeap(temp_result, temp_move);
            // @ts-ignore
            return new Value(temp_result, type.INT, true);
        } else {
            let temp_aux = generator.addTemp();

            let index_val = this.positions[0].compile(table, generator, tree);
            temp_aux = temp_move;

            temp_move = generator.addTemp();
            generator.getHeap(temp_move, temp_aux);

            generator.addExpression(temp_move, temp_move, '1', '+');
            generator.addExpression(temp_move, temp_move, this.getIndex(generator, index_val), '+');

            generator.getHeap(temp_result, temp_move);
            generator.setLabel(exit_label);
            return new Value(temp_result, type.INT, true);
        }
    }

    public getIndex(generator: Generator3D, index: Value) {
        let new_val;
        if ( index.is_temp ) {
            new_val = index.value;
            generator.addExpression(new_val, index.value, '1', '-');
        } else {
            new_val = index.value - 1;
        }

        return new_val;
    }

    verifyError(generator: Generator3D, index: number, uppLim: any, tem_res: any, exit_label: string) {
        let label_error = generator.newLabel();
        let label_continue = generator.newLabel();
        let temp_size = generator.addTemp();
        let temp_index = generator.addTemp();
        generator.addExpression(temp_index, index, '', '');
        generator.getHeap(temp_size, uppLim);

        generator.addIf(temp_index, '1', '<', label_error);
        generator.addIf(temp_index, temp_size, '>', label_error);
        generator.addGoTo(label_continue);

        generator.setLabel(label_error);
        generator.printError();
        generator.addExpression(tem_res, '-1', '','');

        generator.addGoTo(exit_label);
        generator.setLabel(label_continue);
    }

    get_node() {
        let node = new Cst_Node("Access Array");
        node.add_childs_node(this.id.get_node());
        
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