import { Instruction } from "../Abstract/Instruction.js";
import { Identifier } from "../Expression/Identifier";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";
import { Struct } from "./Struct.js";

export class Declaration extends Instruction {

    private id: Array<String>;
    private type: type;
    private expression: any;

    constructor(id: Array<String>, type: type, row: number, column: number, expression: any = null) {
        super(row, column);
        this.id = id;
        this.type = type;
        this.expression = expression;
    }

    interpret(tree: Tree, table: SymbolTable){

        let symbol = null;
        let value = null;

        if (this.expression != null){
            value = this.expression.interpret(tree, table);

            if (value instanceof Exception){
                return value;
            }

            if (type.STRUCT === this.expression.get_type()){
                let struct = this.id[1];
                if (struct !== this.expression.get_id()){
                    return new Exception("Semantic", `The type: ${this.expression.get_id()} cannot be assignment to variable of type: ${struct}`, this.expression.row, this.expression.column);
                }
                this.id.pop();
            }

            if (this.expression.get_type() !== this.type){
                return new Exception("Semantic", `The type: ${this.expression.get_type()} cannot be assignment to variable of type: ${this.type}`, this.expression.row, this.expression.column);
            }

        } else {
            switch(this.type){
                case type.INT: 
                    value = "0";
                    break;
                case type.DOUBLE:
                    value = "0.0"
                    break;
                case type.STRING:
                    value = "null";
                    break;
                case type.CHAR:
                    value = '';
                    break;
                case type.BOOL:
                    value = "false";
                    break;
                case type.STRUCT:
                    value = "null";
                    break;
            }
        }

        let errors = [];
        let result;

        for (let item of this.id) {
            symbol = new Symbol(item, this.type, this.row, this.column, value);

            result = table.set_table(symbol);

            if (result instanceof Exception){
                errors.push(result);
            }
        }

        if (errors.length !== 0){
            return errors;
        }

        return undefined;

    }

    get_id(){
        return this.id;
    }

    get_value(){
        return this.expression;
    }

}