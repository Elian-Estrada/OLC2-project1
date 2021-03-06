import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Access_struct } from "../Expression/Access_struct.js";
import { Identifier } from "../Expression/Identifier.js";
import { Values_array } from "../Expression/Values_array.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Assignment extends Instruction{

    private id: string;
    private expression: any;

    constructor(id: string, expression: any, row: number, column: number) {
        super(row, column);
        this.id = id;
        this.expression = expression;
    }

    interpret(tree: Tree, table: SymbolTable){

        let value = this.expression.interpret(tree, table);
        console.log(value);
        

        if (value instanceof Exception){
            return value;
        }

        if (this.expression.get_type() === type.ARRAY){
            //array implemented
            if (this.expression instanceof Access_struct){
                //do anything
            }

        }

        if (this.expression instanceof Identifier && this.expression.get_type() === type.STRUCT){
            value = value;
        }

        if (this.expression.get_type() === type.STRUCT && this.expression instanceof Access_struct){
            //value = value.get_value().value;
            value = value.get_value();
        }

        let new_symbol = new Symbol(this.id, this.expression.get_type(), this.row, this.column, value);
        let result = table.update_table(new_symbol);

        if (result instanceof Exception){
            return result;
        }

        return undefined;

    }

    get_id(){
        return this.id;
    }

    get_expression(){
        return this.expression;
    }


    get_node() {
        let node = new Cst_Node("Assignment");
        node.add_child(this.id);
        node.add_child("=");
        node.add_childs_node(this.expression.get_node());

        return node;
    }
    
    compile(table: SymbolTable, generator: Generator3D, tree: Tree): any {
        let val = this.expression.compile(table, generator, tree);
        let new_var = table.get_table(this.get_id());
        // @ts-ignore
        table.update_table(new_var);

        if ( val.get_type() === type.BOOL ) {
            // @ts-ignore
            this.valueBoolean(val, new_var.position, generator);
        } else {

            let index = -1;
            // @ts-ignore
            const symbols = JSON.parse(localStorage.getItem("symbol"));
            symbols.forEach((item: any, i: number) => {
                if ( this.get_id() === item._id ) {
                    index = i;
                }

                if ( index !== -1 ) {
                    // @ts-ignore
                    symbols[index].size = val.size;
                }
            });
            localStorage.setItem('symbol', JSON.stringify(symbols));

            // @ts-ignore
            generator.setStack(new_var.position, val.value);
        }
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
}