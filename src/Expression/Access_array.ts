import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Access_array extends Instruction {

    private id: any;
    private positions: Array<any>;
    private expression: any;
    private value: any; 

    constructor(id: any, positions: Array<any>, expression: any, row: number, column: number) {
        super(row, column);
        this.id = id;
        this.positions = positions;
        this.expression = expression;
        this.value = null;
    }

    interpret(tree: Tree, table: SymbolTable){

        let array = this.id.interpret(tree, table);

        if (array instanceof Exception){
            return array;
        }

        this.value = array.get_value();

        let positions = this.get_values(this.positions, tree, table);

        if (positions instanceof Exception){
            return positions;
        }

        let value: any;
        let pos: any;
        let i = 0;                          //[1, 2];
        for (let item of this.positions){        //[0][0]
            i++;    //1

            pos = item.interpret(tree, table);
            
            if (item.get_type() !== type.INT){
                return new Exception("Semantic", `The index of array cannot be of type: ${value.get_type()} expected type: ${type.INT}`, item.row, item.column);
            }


            if (i === 1){
                console.log("Entra 1 vez");
                
                value = array.get_value()[pos];
            } else {
                console.log(pos);
                console.log(value);
                //value = value[pos];
                if (value instanceof Array){
                    value = value[pos];    //1, undefined
                    console.log(value);
                    
                } else {
                    value = undefined;
                }

                //value = undefined;
                console.log(value);
                
            }

            if (value === undefined){ //false
                console.log("entra?");
                
                return new Exception("Semantic", `The index: ${item} out of range`, item.row, item.column);
            }
        }

        console.log(value);
        

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

}