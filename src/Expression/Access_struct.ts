import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Access_struct extends Instruction{

    private list_ids: Array<any>;
    private expression: any;
    private type: type;
    private value: any;

    constructor(list_ids: Array<any>, expression: any, row: number, column: number){
        super(row, column);
        this.list_ids = list_ids;
        this.expression = expression;
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

        let result = this.for_attributes(this.list_ids.slice(1), value.get_attributes(), exp);
        
        if (result instanceof Exception){
            return result;
        }

        if (result === null){
            return null;
        }

        this.value = result;

        return this.value;
        
    }

    private for_attributes(ids: any, attributes: any, exp: any): any{

        if (ids.length !== 0){
            for (let item of attributes){
                if (ids[0] === item.id) {
                    if (item.type === type.STRUCT && ids.length !== 0 && item.value !== "null"){
                        return this.for_attributes(ids.slice(1), item.value.get_attributes(), exp)
                    }

                    if (exp !== null && this.expression.get_type() === item.type){
                        if (this.expression.get_type() === item.type){
                            item.value = exp;
                            return null;
                        }
                        return new Exception("Semantic", `The type: ${this.expression.get_type()} cannot assignment at attribute of type: ${item.type}`, this.expression.row, this.expression.column);
                    }

                    this.type = item.type;
                    return item.value;
                }
            }
        }
    }

    get_type(){
        return this.type;
    }

    get_value(){
        return this.value;
    }

}