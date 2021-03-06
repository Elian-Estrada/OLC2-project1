import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Generator3D } from "../Generator/Generator3D.js";
import { Call } from "../Instructions/Call.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Access_struct extends Instruction{

    private list_ids: Array<any>;
    private expression: any;
    private positions: Array<any>;
    private type: type;
    private sub_type: type;
    private value: any;

    constructor(list_ids: Array<any>, expression: any, positions:Array<any>, row: number, column: number){
        super(row, column);
        this.list_ids = list_ids;
        this.expression = expression;
        this.positions = positions;
        this.type = type.NULL;
        this.sub_type = type.NULL;
        this.value = null;
    }

    interpret(tree: Tree, table: SymbolTable) {
        
        let struct = table.get_table(this.list_ids[0]);

        if (struct === undefined){
            return new Exception("Semantic", `The variable: ${this.list_ids[0]} doesn't in the current context`, this.row, this.column, table.get_name());
        }

        if (struct.type !== type.STRUCT){
            return new Exception("Semantic", `The variable: ${struct.id} isn't struct`, struct.row, struct.column, table.get_name());
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
                            return item.value;
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
                            this.sub_type = item.sub_type;
                        } else {
                            this.type = item.sub_type;
                        }

                        return result;
                    } else if (item.type !== type.ARRAY && this.positions !== null){
                        return new Exception("Semantic", `The attribute: ${item.id} isn't ${type.ARRAY}`, item.row, item.column, table.get_name());
                    }

                    if (this.expression instanceof Call){
                        
                        if (exp.id == item.struct){
                            item.value = exp;
                            return null;
                        } 

                        return new Exception("Semantic", `The attribute: ${item.id} isn't ${exp.id}`, item.row, item.column, table.get_name());
                    }
                    
                    if (exp !== null && this.expression.get_type() === item.type){
                        if (this.expression.get_type() === item.type && !(this.expression instanceof Access_struct)){
                            item.value = exp;
                            return null;
                        }

                        if (this.expression instanceof Access_struct){
                            
                            //item.value = exp.get_value().value;
                            item.value = exp.get_value();
                            
                            return null;
                        }

                        return new Exception("Semantic", `The type: ${this.expression.get_type()} cannot assignment at attribute of type: ${item.type}`, this.expression.row, this.expression.column, table.get_name());
                    }

                    this.type = item.type;

                    if (item.type === type.STRUCT){
                        return item.value;
                    }

                    if (item.type === type.ARRAY){
                        this.sub_type = item.sub_type;
                    }

                    return item.value;
                }
            }

            return new Exception("Semantic", `The attribute: ${ids[0]} doesn't exist`, this.row, this.column, table.get_name());
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
                    return new Exception("Semantic", `The index of array cannot be of type: ${positions[0].get_type()} expected type: ${type.INT}`, positions[0].row, positions[0].column, table.get_name());
                }

                return this.get_values(positions.slice(1), array[positions[0]], value, type_array, tree, table);
            }

            if (positions.length === 1 && array[positions[0]] !== undefined){

                if (this.expression.get_type() !== type_array){
                    return new Exception("Semantic", `The type: ${this.expression.get_type()} cannot be assignated at array of type: ${type_array}`, this.expression.row, this.expression.column, table.get_name());
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
                return new Exception("Semantic", "The index out of range", this.positions[this.positions.length - 1].row, this.positions[this.positions.length - 1].column, table.get_name());    
            }

        }

        if (array === undefined){
            return new Exception("Semantic", "The index out of range", this.positions[this.positions.length - 1].row, this.positions[this.positions.length - 1].column, table.get_name());
        }

        return array;

    }

    get_type(){
        return this.type;
    }

    get_subtype(){
        return this.sub_type;
    }

    get_value(){
        return this.value;
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        let node = new Cst_Node("Access_Struct");
        node.add_child(this.list_ids[0]);
        
        let attributes = new Cst_Node("Attributes");
        let attribute;
        for (let item of this.list_ids.slice(1)){
            attributes.add_child(".");
            attribute = new Cst_Node("Attribute");
            attribute.add_child(item);

            attributes.add_childs_node(attribute);
        }

        node.add_childs_node(attributes);

        if (this.positions !== null){
            let positions = new Cst_Node("Positions");
            let position;
            for (let item of this.positions){
                position = new Cst_Node("Position");
                position.add_child("[");
                position.add_childs_node(item.get_node());
                position.add_child("]");

                positions.add_childs_node(position);
            }

            node.add_childs_node(positions);
        }

        if (this.expression != null){

            node.add_child("=");
            node.add_childs_node(this.expression.get_node());
        }

        return node;
    }

}