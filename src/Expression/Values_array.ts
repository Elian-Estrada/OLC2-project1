import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Values_array extends Instruction{

    private type: type;
    private type_array: type;
    private list_expression: Array<any>;
    private value: Array<any>;

    constructor(list_expression: Array<any>, row: number, column: number){
        super(row, column);
        this.type = type.ARRAY;
        this.type_array = type.NULL;
        this.list_expression = list_expression;
        this.value = [];
    }

    interpret(tree: Tree, table: SymbolTable) {
        
        if (this.list_expression !== null){

            let value = this.get_values(this.list_expression, tree, table);

            if (value instanceof Exception){
                return value;
            }

            this.value = value;

            return this;
        }

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

            if (this.type_array === type.NULL){
                this.type_array = list_expression.get_type();
            }

            if (this.type_array !== list_expression.get_type()){
                return new Exception("Semantic", `The type: ${list_expression.get_type()} isn't like to: ${this.type_array}`, list_expression.row, list_expression.column);
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

    get_type(){
        return this.type;
    }

    get_subtype(){
        return this.type_array;
    }

    get_value(){
        return this.value;
    }

}