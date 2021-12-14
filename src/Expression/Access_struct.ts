import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Access_struct extends Instruction{

    private list_ids: Array<any>;
    private expression: any;
    private positions: Array<any>;
    private type: type;
    private value: any;

    constructor(list_ids: Array<any>, expression: any, positions:Array<any>, row: number, column: number){
        super(row, column);
        this.list_ids = list_ids;
        this.expression = expression;
        this.positions = positions;
        this.type = type.NULL;
        this.value = null;
    }

    interpret(tree: Tree, table: SymbolTable) {
        
        let struct = table.get_table(this.list_ids[0]);

        if (struct === undefined){
            return new Exception("Semantic", `The variable: ${this.list_ids[0]} doesn't in the current context`, this.row, this.column);
        }

        if (struct.type !== type.STRUCT){
            return new Exception("Semantic", `The variable: ${struct.id} isn't struct`, struct.row, struct.column);
        }

        let exp:any = null;

        if (this.expression !== null){
            exp = this.expression.interpret(tree, table);

            if (exp instanceof Exception){
                return exp;
            }
        }
        
        let value = struct.value;

        if (value === "null"){
            this.type = type.NULL
            this.value = "null";
            return this.value;
        }
        
        let result = this.for_attributes(this.list_ids.slice(1), value.get_attributes(), exp, tree, table);

        if (result instanceof Exception){
            return result;
        }

        if (result === null){
            return null;
        }

        this.value = result;

        switch(this.type){
            case type.ARRAY:
                return this;
            case type.STRUCT:
                return this;
            default:
                return this.value;
        }
        
    }

    private for_attributes(ids: any, attributes: any, exp: any, tree: Tree, table: SymbolTable): any{

        if (ids.length !== 0){
            for (let item of attributes){
                if (ids[0] === item.id) {
                    if (item.type === type.STRUCT 
                        && ids.length !== 0 
                        && item.value !== "null"){
                        if (ids.length === 1 && exp === null){
                            this.type = type.STRUCT;
                            return item;
                        }else if (ids.length > 1){
                            return this.for_attributes(ids.slice(1), item.value.get_attributes(), exp, tree, table)    
                        }
                    }

                    if (this.positions !== null && item.type === type.ARRAY){
                        let result = this.get_values(this.positions, item.value, exp, item.sub_type, tree, table);
                        
                        if (result instanceof Exception){
                            return result;
                        }

                        if (result === null){
                            return result;
                        }

                        if (result instanceof Array){
                            this.type = item.type;
                        } else {
                            this.type = item.sub_type;
                        }

                        return result;
                    } else if (item.type !== type.ARRAY && this.positions !== null){
                        return new Exception("Semantic", `The attribute: ${item.id} isn't ${type.ARRAY}`, item.row, item.column);
                    }

                    if (exp !== null && this.expression.get_type() === item.type){
                        if (this.expression.get_type() === item.type && !(this.expression instanceof Access_struct)){
                            item.value = exp;
                            return null;
                        }

                        if (this.expression instanceof Access_struct){
                            console.log(item.value);
                            
                            item.value = exp.get_value().value;
                            console.log(item);
                            
                            return null;
                        }

                        return new Exception("Semantic", `The type: ${this.expression.get_type()} cannot assignment at attribute of type: ${item.type}`, this.expression.row, this.expression.column);
                    }

                    this.type = item.type;

                    if (item.type === type.STRUCT){
                        return item;
                    }

                    return item.value;
                }
            }

            return new Exception("Semantic", `The attribute: ${ids[0]} doesn't exist`, this.row, this.column);
        }
        
    }

    private get_values(positions: Array<any>, array: any, value: any, type_array: type, tree: Tree, table: SymbolTable): any{

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

    get_type(){
        return this.type;
    }

    get_value(){
        return this.value;
    }

    get_node() {
        
    }

}