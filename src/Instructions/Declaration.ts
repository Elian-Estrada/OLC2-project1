import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Access_struct } from "../Expression/Access_struct.js";
import { Identifier } from "../Expression/Identifier.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import {type} from "../SymbolTable/Type.js";
import {Struct} from "./Struct.js";

export class Declaration extends Instruction {
    compile(table: SymbolTable, generator: Generator3D) {
        let value = this.expression.compile(table, generator);
        let new_var = table.get_table(this.get_id()[0]);
        let new_symbol = null;
        if ( new_var === undefined ) {
            let in_heap = ( value.get_type() === type.STRING || value.get_type() === type.STRUCT || value.get_type() === type.ARRAY );
            new_symbol = new Symbol(this.id[0], value.get_type(), this.row, this.column, this.expression, undefined, in_heap, value.true_label, value.false_label);
            table.set_table(new_symbol);
        }

        // @ts-ignore
        let temp_pos = new_symbol.position;

        if ( value.get_type() === type.BOOL ) {
            this.valueBoolean(value, temp_pos, generator);
        } else
            generator.setStack(temp_pos, this.expression.value);
    }

    public valueBoolean(value: any, temp_pos: any, generator: Generator3D) {
        let temp_label = generator.newLabel();
        generator.setLabel(value.true_label);
        generator.setStack(temp_pos, "1");
        generator.addGoTo(temp_label);

        generator.setLabel(value.false_label);
        generator.setStack(temp_pos, "0");
        generator.setLabel(temp_label);
    }

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

            if (this.expression instanceof Identifier && this.expression.get_type() === type.STRUCT){
                if(this.expression.get_value().get_id() !== this.id[1]){
                    return new Exception("Semantic", `The type: ${value.id} cannot be assignment to variable of type: ${this.id[1]}`, this.expression.row, this.expression.column);
                }
                
                this.id.pop();
            }

            if (this.expression.get_type() === type.STRUCT && this.expression instanceof Access_struct){
                if (value.get_value().struct !== this.id[1]){
                    return new Exception("Semantic", `The type: ${value.get_value().struct} cannot be assignment to variable of type: ${this.id[1]}`, this.expression.row, this.expression.column);
                }
                value = value.get_value().value;

                this.id.pop();
            }

            if (type.STRUCT === this.expression.get_type() && 
                !(this.expression instanceof Identifier || this.expression instanceof Access_struct)){
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

        return null;

    }

    get_id(){
        return this.id;
    }

    get_value(){
        return this.expression;
    }

    get_node() {
        let node = new Cst_Node("Declaration");
        node.add_child(this.type);
        node.add_child(this.id);
        if (this.expression !== null){
            node.add_child("=");
            node.add_childs_node(this.expression.get_node());
        }

        return node;
    }

}