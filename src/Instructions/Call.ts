import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import {type} from "../SymbolTable/Type.js";

export class Call extends Instruction {

    private name: string;
    private params: Array<any>;
    private type: string | null;
    private value: string | null;

    constructor(name: string, params: Array<any>, row: number, col: number) {
        super(row, col);
        this.name = name;
        this.params = params;
        this.type = null;
        this.value = null;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let ob_function = tree.get_function(this.name);

        if ( ob_function == null )
            return new Exception("Semantic", `The function ${this.name} doesn't exists`, this.row, this.column);

        let new_table = new SymbolTable(tree.get_global_table(), `Function-${this.name}`);
        if ( ob_function.get_params().length == this.params.length ) {
            let count = 0;

            for ( let expression of this.params ) {
                let val_expression = expression.interpret(tree, table);

                if ( val_expression instanceof Error )
                    return val_expression;

                let expr_to_valuate = String( ob_function.get_params()[count].name ).toLowerCase();
                let table_res = null;
                /*switch (expr_to_valuate) {
                    case "length##param1":
                    case "round##param1":
                    case "truncate##param1":
                    case "type_of##param1":
                        let symbol = new Symbol(expr_to_valuate, expression.get_type(), this.row, this.column, val_expression);
                        table_res = new_table.set_table(symbol);

                        if ( table_res instanceof Exception )
                            return table_res;
                        break;
                }*/

                // console.log(ob_function.get_params()[count].type)
                if ( ob_function.get_params()[count].type == expression.get_type() ) {
                    if ( expression.get_type() === type.ARRAY ) {

                        let length_func = ob_function.get_params()[count].length;
                        let type_func = ob_function.get_params()[count].get_type();
                        if ( length_func !== val_expression.length )
                            return new Exception("Semantic", `Size dimension expected: ${length_func}, received: ${val_expression.length}`, this.row, this.column);

                        if ( type_func !== val_expression.get_type() )
                            return new Exception("Semantic", `The type: ${val_expression.get_type().name} is different to param type: ${type_func}`, this.row, this.column);
                    }

                    let name_func = String( ob_function.get_params()[count].name ).toLowerCase();
                    let symbol = new Symbol( name_func, expression.get_type(), this.row, this.column, val_expression );
                    table_res = new_table.set_table(symbol);

                    if ( table_res instanceof Exception )
                        return table_res;
                }
                else {
                    return new Exception("Semantic", `The type: ${expression.get_type().name} is different to param type: ${ob_function.get_params()[count].get_type()}`, this.row, this.column);
                }

                count += 1;
            }
        }
        let value = ob_function.interpret(tree, new_table);

        if ( value instanceof Exception )
            return value;

        this.type = ob_function.get_type();
        this.value = value;
        return value;
    }

    public get_type() {
        return this.type;
    }
}