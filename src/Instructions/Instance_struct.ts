import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Instance_struct extends Instruction {

    private id_struct: string;
    private list_values: Array<any>;
    private type: type;

    constructor(id_struct: string, list_values: Array<any>, row: number, column: number) {
        super(row, column);
        this.id_struct = id_struct;
        this.list_values = list_values;
        this.type = type.STRUCT;
    }

    interpret(tree: Tree, table: SymbolTable) {
        
        let struct = tree.get_struct(this.id_struct);

        if (struct !== null){

            if (struct.get_attributes().length !== this.list_values.length){
                return new Exception("Semantic", `${struct.get_attributes().length} parameters were expected and ${this.list_values.length} came`, this.row, this.column);
            }

            this.list_values.forEach((item, i) => {
                
                if (item instanceof Array){
                    if (struct?.get_attributes()[i].type === type.ARRAY){
                        let result = this.get_values(item, tree, table, struct.get_attributes()[i].sub_type);

                        if (result instanceof Exception){
                            return result;
                        }

                        struct.get_attributes()[i].value = result;
                    }
                }

            });

        } 

        return new Exception("Semantic", `The strcut with name: ${this.id_struct} doesn't exist.`, this.row, this.column);

    }

    private get_values(list_expression: any, tree: Tree, table: SymbolTable, type_array: type): any{

        let expression = [];

        if (list_expression instanceof Array){
            let value;
            for (let item of list_expression){
                value = this.get_values(item, tree, table, type_array);

                if (value instanceof Exception){
                    return value;
                }

                expression.push(value);
            }
        } else {
            
            let value = list_expression.interpret(tree, table);

            if (type_array !== list_expression.get_type()){
                return new Exception("Semantic", `The type: ${list_expression.get_type()} cannot assignet at array of type: ${type_array}`, list_expression.row, list_expression.column);
            }

            switch(list_expression.get_type()){
                case type.INT:
                    return parseInt(value);
                case type.DOUBLE:
                    console.log(parseFloat(value));
                    
                    return parseFloat(value);
                case type.BOOL:
                    return JSON.parse(value);
            }
        }

        return expression;
    }

    get_type(){
        return this.type;
    }

}