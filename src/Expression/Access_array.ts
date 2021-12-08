import { Instruction } from "../Abstract/Instruction.js";
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

        this.values = array.get_value();

        let value: any;
        let pos: any;
        let i = 0;
        let result;
        for (let item of this.positions){
            i++;

            pos = item.interpret(tree, table);
            
            if (item.get_type() !== type.INT){
                return new Exception("Semantic", `The index of array cannot be of type: ${value.get_type()} expected type: ${type.INT}`, item.row, item.column);
            }


            if (i === 1){
                value = array.get_value()[pos];
            } else {

                if (value instanceof Array){

                    if (this.expression !== null && i == this.positions.length){
                        result = this.expression.interpret(tree, table);

                        if (result instanceof Exception){
                            return result;
                        }

                        if (this.expression.get_type() !== array.get_subtype()){
                            return new Exception("Semantic", `The type: ${this.expression.get_type()} cannot be assignated at array of type: ${array.get_subtype()}`, this.expression.row, this.expression.column);
                        }

                        switch(this.expression.get_type()){
                            case type.INT:
                                result = parseInt(result);
                            case type.DOUBLE:
                                result = parseFloat(result);
                            case type.BOOL:
                                result = JSON.parse(result);
                        }

                        value[pos] = result;     
                        
                        break;
                    }                    

                    value = value[pos];
                    
                } else {
                    value = undefined;
                }
            }

            if (value === undefined){
                return new Exception("Semantic", `The index: ${item} out of range`, item.row, item.column);
            }
        }

        this.type = array.get_subtype();
        
        this.value = value;
        return value;
    }

    get_values(positions: any, tree: Tree, table: SymbolTable): any{

        let values = []

        if (positions instanceof Array){
            
            let value;

            for (let item of positions){
                
                value = this.get_values(item, tree, table);
                
                if (value instanceof Exception){
                    return value;
                }

                values.push(value);
            }
        } else {
            
            let value = positions.interpret(tree, table);
            
            if (positions.get_type() !== type.INT){
                return new Exception("Semantic", `The index of array cannot be of type: ${value.get_type()} expected type: ${type.INT}`, positions.row, positions.column);
            }

            return value;
        }

        return values;

    }


    get_value(){
        return this.value;
    }

    get_type(){
        return this.type;
    }
}