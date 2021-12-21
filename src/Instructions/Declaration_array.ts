import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";
import {Access_array} from "../Expression/Access_array";
import {Primitive} from "../Expression/Primitive";
import {Value} from "../Abstract/Value";

export class Declaration_array extends Instruction {

    private type: type;
    private type_array: type;
    private id: string;
    private expression: any;
    private list_expression: Array<any>;
    private flag: boolean;
    private value: Array<any>;

    constructor(id: string, type_array: type, expression: any, list_extpression: Array<any>, row: number, column: number, flag: boolean = true) {
        super(row, column);
        this.id = id;
        this.type = type.ARRAY
        this.type_array = type_array;
        this.expression = expression;
        this.list_expression = list_extpression;
        this.flag = flag;
        this.value = [];
    }

    interpret(tree: Tree, table: SymbolTable){

        let symbol = null;
        

        if (this.expression === null){

            let value = this.get_values(this.list_expression, tree, table);
            
            if (value instanceof Exception){
                return value
            }

            this.value = value

            symbol = new Symbol(this.id, type.ARRAY, this.row, this.column, this);

        } else {

            let array = this.expression.interpret(tree, table);

            if (array instanceof Exception){
                return array;
            }

            if (!(array instanceof Declaration_array)){
                return new Exception("Semantic", `Assignated only arrays`, this.row, this.column);
            }
            
            if (this.type_array !== array.get_subtype()){
                
                return new Exception("Semantic", `The type: ${array.get_subtype()} cannot assignated to array of type: ${this.type_array}`, this.row, this.column);
            }

            let value;

            if (this.flag) {
                value = array;
            }else {
                value = JSON.parse(JSON.stringify(array));
                value = {...value,
                    get_subtype(): any{
                        return this.type_array;
                    },
                    get_value(): any{
                        return this.value;
                    },
                    set_value(value: Array<any>){
                        this.value = value;
                    },
                    get_type(): any{
                        return this.type;
                    },
                    get_id(): any{
                        return this.id;
                    }

                };
            }

            symbol = new Symbol(this.id, this.type, this.row, this.column, value);

        }

        let result = table.set_table(symbol);

        if (result instanceof Exception){
            return result;
        }

        return null;

    }

    private get_values(list_expression: any, tree: Tree, table: SymbolTable): any{

        let expression = [];

        if (list_expression instanceof Array){
            let value;
            for (let item of list_expression){
                value = this.get_values(item, tree, table)

                if (value instanceof Exception){
                    return value;
                }

                expression.push(value);
            }
        } else {
            
            let value = list_expression.interpret(tree, table);

            if (this.type_array !== list_expression.get_type()){
                return new Exception("Semantic", `The type: ${list_expression.get_type()} cannot assignet at array of type: ${this.type_array}`, list_expression.row, list_expression.column);
            }

            switch(list_expression.get_type()){
                case type.INT:
                    return parseInt(value);
                case type.DOUBLE:
                    return parseFloat(value);
                case type.BOOL:
                    return JSON.parse(value);
                default:
                    return value;
            }
        }

        return expression;
    }

    get_value(){
        return this.value;
    }

    set_value(value: Array<any>){
        this.value = value;
    }

    get_subtype(){
        return this.type_array;
    }

    get_type(){
        return this.type;
    }

    get_id(){
        return this.id;
    }

    compile(table: SymbolTable, generator: Generator3D) {
        generator.addComment("-----KEEP ARRAY-----");
        let temp = generator.addTemp();
        let temp_move = generator.addTemp();

        generator.addExpression(temp, 'H', '', '');
        generator.addExpression(temp_move, 'H', '', '');
        generator.addExpression('H', 'H', table.get_size() + 1, '+');
        generator.setHeap(temp_move, table.get_size());

        generator.addExpression(temp_move, temp_move, '1', '+');

        for ( let expr of this.list_expression ) {
            let value = expr.compile(table, generator);

            if ( value instanceof Primitive )
                this.type = value.get_type();

            generator.setHeap(temp_move, value.value);
            generator.addExpression(temp_move, temp_move, '1', '+');
        }

        generator.addComment("----END ARRAY-----");
        let val_ret = new Value(temp, type.ARRAY, true);
        val_ret.type_array = this.type;

        return val_ret;
    }

    get_node() {
        let node = new Cst_Node("Declaration Array");

        node.add_child(this.type_array);
        node.add_child("[");
        node.add_child("]");
        node.add_child(this.id);
        node.add_child("=");

        if (this.expression === null){
            node.add_childs_node(this.get_node_array(this.list_expression));
        }

        if (this.expression !== null){
            node.add_childs_node(this.expression.get_node());
        }

        return node;
    }

    get_node_array(list_nodes: any){
        let value;
        if (list_nodes instanceof Array){
            value = new Cst_Node("Values Array");
            value.add_child("[");
            for (let item of list_nodes){
                value.add_childs_node(this.get_node_array(item));
            }
            value.add_child("]");
        } else {
            return list_nodes.get_node();
        }

        return value;
    }
}