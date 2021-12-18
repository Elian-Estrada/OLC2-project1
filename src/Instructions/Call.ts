import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import {type} from "../SymbolTable/Type.js";
import { Declaration_array } from "./Declaration_array.js";
import { Struct } from "./Struct.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";
import { Access_struct } from "../Expression/Access_struct.js";

export class Call extends Instruction {

    private name: string;
    private params: Array<any>;
    private type: string | null;
    private value: string | Struct | null;

    constructor(name: string, params: Array<any>, row: number, col: number) {
        super(row, col);
        this.name = name;
        this.params = params;
        this.type = null;
        this.value = null;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        try{
            let ob_function = tree.get_function(this.name);
            let struct:any = JSON.parse(JSON.stringify(tree.get_struct(this.name)));

            if ( ob_function !== null && ob_function !== undefined){

                let new_table = new SymbolTable(tree.get_global_table(), `Function-${this.name}`);
                if ( ob_function.get_params().length == this.params.length ) {
                    let count = 0;
                    let table_res = null;
                    for ( let expression of this.params ) {

                        if (expression instanceof Array){
                            let param = ob_function.get_params()[count];
                            if(param.type !== type.ARRAY){
                                return new Exception("Semantic", `The type: ${type.ARRAY} is different at parameter of type: ${param.type}`, param.row, param.column);
                            }

                            let array = new Declaration_array(param.name, param.sub_type, null, expression, param.row, param.column);

                            let result = array.interpret(tree, new_table);

                            if (result instanceof Exception){
                                return result;
                            }
                            
                            count++;

                            continue;
                        }

                        let val_expression = expression.interpret(tree, table);
                        
                        if ( val_expression instanceof Error )
                            return val_expression;

                        // for ( let param of ob_function.get_params() ) {
                        //     // console.log(expression.get_type())
                        //     if ( expression.get_type() !== param.type ) {
                        //         return new Exception("Semantic", "Different type of parameter data", expression.row, expression.column);
                        //     }
                        //     break;
                        // }

                        if (expression.get_type() === type.STRUCT && val_expression instanceof Access_struct){
                            val_expression = val_expression.get_value();
                        }

                        // console.log(ob_function.get_params()[count].type)
                        if ( ob_function.get_params()[count].type == expression.get_type() ) {
                            if ( expression.get_type() === type.ARRAY ) {
                                let type_func = ob_function.get_params()[count].sub_type;

                                if ( type_func !== val_expression.get_subtype() )
                                    return new Exception("Semantic", `The type: ${val_expression.get_type()} is different to param type: ${type_func}`, ob_function.get_params()[count].row, ob_function.get_params()[count].column);
                            }

                            let name_func = String( ob_function.get_params()[count].name );
                            let symbol = new Symbol( name_func, expression.get_type(), this.row, this.column, val_expression );
                            table_res = new_table.set_table(symbol);

                            if ( table_res instanceof Exception )
                                return table_res;
                        }
                        else {
                            return new Exception("Semantic", `The type: ${expression.get_type()} is different to param type: ${ob_function.get_params()[count].get_type()}`, this.row, this.column);
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
            } else if (struct !== null) {

                struct = {...struct,
                    get_attributes(){
                        return this.attributes
                    },
                    get_type(){
                        return this.type;
                    },
                    get_id(){
                        return this.id;
                    }
                }

                if (struct.get_attributes().length !== this.params.length){
                    return new Exception("Semantic", `${struct.get_attributes().length} parameters were expected and ${this.params.length} came`, this.row, this.column);
                }

                let result:any = this.params.forEach((item, i) => {

                    if (item instanceof Array){
                        if (struct?.get_attributes()[i].type === type.ARRAY){
                            let result = this.get_values(item, tree, table, struct.get_attributes()[i].sub_type);

                            if (result instanceof Exception){
                                tree.get_errors().push(result);
                                tree.update_console(result.toString());
                            } else {
                                struct.get_attributes()[i].value = result;
                            }
                        } else {

                            let error = new Exception("Semantic", `The attribute: ${struct?.get_attributes()[i].id} isn't an array.`, this.row, this.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                        }
                    } else {
                        
                        let value = item.interpret(tree, table);
                        
                        if (value instanceof Exception){
                            tree.get_errors().push(value);
                            tree.update_console(value.toString());
                            return;
                        }

                        if (item.get_type() === type.ARRAY){
                            if (struct?.get_attributes()[i].type === type.ARRAY){

                                let result;
                                if (struct.get_attributes()[i].sub_type !== value.get_subtype()){
                                    result = new Exception("Semantic", `The type: ${value.get_subtype()} cannot assignet at array of type: ${struct.get_attributes()[i].sub_type}`, item.row, item.column);
                                }

                                if (result instanceof Exception){
                                    tree.get_errors().push(result);
                                    tree.update_console(result.toString());
                                    return;
                                }

                                struct.get_attributes()[i].value = value.get_value();
                                
                            } else {

                                let error = new Exception("Semantic", `The attribute: ${struct?.get_attributes()[i].id} isn't an array.`, this.row, this.column);
                                tree.get_errors().push(error);
                                tree.update_console(error.toString());
                            }
                        } else {

                            if (struct.get_attributes()[i].type !== item.get_type() && struct.get_attributes()[i].type !== type.STRUCT){
                                let error = new Exception("Semantic", `The type: ${item.get_type()} cannot assignet at attribute of type: ${struct.get_attributes()[i].type}`, item.row, item.column)
                                tree.get_errors().push(error);
                                tree.update_console(error.toString());
                                return;
                            } else if (struct.get_attributes()[i].type === type.STRUCT) {
                                
                                if (item.type !== type.NULL && struct.get_attributes()[i].struct !== value.get_id()){
                                    let error = new Exception("Semantic", `The type: ${value.get_id()} cannot assignet at attribute of type: ${struct.get_attributes()[i].struct}`, item.row, item.column)
                                    tree.get_errors().push(error);
                                    tree.update_console(error.toString());
                                    return;
                                }
                            }

                            struct.get_attributes()[i].value = value;
                        }

                    }

                });

                this.type = type.STRUCT;
                this.value = struct;

                return this.value;

            }else {
                return new Exception("Semantic", `The function ${this.name} doesn't exists`, this.row, this.column);
            }
        } catch (error){
            console.log(error);
        }
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
                    return parseFloat(value);
                case type.BOOL:
                    return JSON.parse(value);
                default:
                    return value;
            }
        }

        return expression;
    }

    public get_type() {
        return this.type;
    }

    public get_id(){
        return this.name;
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        let node = new Cst_Node("Call Function");
        node.add_child(this.name);
        node.add_child("(");
        let parameters = new Cst_Node("Parameters");
        for (let item of this.params){
            if (item instanceof Array){
                parameters.add_childs_node(this.get_node_array(item));
            } else {
                parameters.add_childs_node(item.get_node());     
            }
            
        }
        node.add_childs_node(parameters);
        node.add_child(")");

        return node;
    }

    get_node_array(list_nodes: any){
        let value;
        if (list_nodes instanceof Array){
            value = new Cst_Node("Values Array");
            value.add_child("[");
            for (let item of list_nodes){
                value.add_childs_node(this.get_node_array(item));
            }
            value.add_child("]");
        } else {
            return list_nodes.get_node();
        }

        return value;
    }
}