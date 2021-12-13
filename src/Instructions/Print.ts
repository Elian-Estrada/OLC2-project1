import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";

export class Print extends Instruction {

    private expression: any;
    private flag: boolean;

    constructor(expression: any, row: number, col: number, flag:boolean = true) {
        super(row, col);
        this.expression = expression;
        this.flag = flag;
    }
    
    public interpret(tree: Tree, table: SymbolTable) {
        let value = this.expression.interpret(tree, table);

        if ( value instanceof Exception )
            return value;

        if ( value === null )
            return new Exception("Semantic", "Error 'void' type not allowed here", this.row, this.column);
        
        if ( this.expression.get_type() == type.ARRAY ) {
            
            value = JSON.stringify(value.get_value());
            
        } else if (this.expression.get_type() === type.STRUCT){
            
            if (this.expression.get_value().value === "null"){
                value = `${this.expression.get_value().struct}(null)`;
            } else {
                
                value = this.print_struct(this.expression.get_value());
                
            }

        }
        else if ( this.expression.get_type() == type.NULL ) {
            return new Exception("Semantic", "Null Pointer Exception", this.row, this.column);
        }

        tree.update_console(`${ value }`, this.flag);
    }

    print_struct(struct: any){

        if (struct.value === "null"){

            return `null`

        } else {

            if (struct.value !== undefined){
                struct = struct.value;
            }

            let params = `${struct.id}(`;
            for(let item of struct.attributes){
                if (item.type === type.STRUCT){
                    params += this.print_struct(item) + ",";
                } else if(item.type === type.ARRAY){
                    console.log(item.value);
                    
                    params += JSON.stringify(item.value) + ","
                } else {
                    params += item.value + ",";
                }

            }

            return params.slice(0, params.length - 1) + ")";

        }

    }
}