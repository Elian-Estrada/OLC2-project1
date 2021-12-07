import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

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
                return new Exception("Semantic", `The type: ${list_expression.get_type()} cannot assignet at array of type: ${this.type_array}`, this.row, this.column);
            }

            return value;
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
}