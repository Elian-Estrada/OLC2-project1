import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import {type} from "../SymbolTable/Type.js";
import {Generator3D} from "../Generator/Generator3D.js";
import {Value} from "../Abstract/Value.js";

export class Primitive extends Instruction {

    private type: type;
    private value: String;

    constructor(value: String, type: type, row: Number, column: Number) {
        super(row, column);
        this.type = type;
        this.value = value;
    }

    interpret(tree: Tree, table: SymbolTable){
        return this.value;
    }

    get_value() {
        return this.value;
    }

    get_type(): type{
        return this.type;
    }

    set_type(type: type){
        this.type = type;
    }

    get_node() {
        let node = new Cst_Node("Primitive");
        node.add_child(this.value);
        return node;
    }

    toString(): String {
        return String(this.value);
    }

    compile(table: SymbolTable, generator: Generator3D, tree: Tree): any {
        if ( this.type === type.INT || this.type === type.DOUBLE ) {
            return new Value(this.value, this.type, false);
        }
        else if ( this.type === type.STRING || this.type == type.CHAR ) {
            let ret_temp = generator.addTemp();
            generator.addExpression(ret_temp, 'H', '', '');

            let counter = 0;
            for ( let char of String(this.value) ) {
                generator.setHeap('H', char.charCodeAt(0));
                generator.nextHeap();
                counter += 1;
            }

            generator.setHeap('H', -1);
            generator.nextHeap();

            let ret_val = new Value(ret_temp, type.STRING, true);
            ret_val.size = counter;
            return ret_val;
        }
        else if ( this.type === type.BOOL ) {
            let res = new Value(this.value, this.type, false);
            let new_value = this.checkLabels(generator, res);

            if ( new_value.value === 'true' ) {
                generator.addGoTo(new_value.true_label);
                generator.addGoTo(new_value.false_label);
            } else {
                generator.addGoTo(new_value.false_label);
                generator.addGoTo(new_value.true_label);
            }

            res.true_label = new_value.true_label;
            res.false_label = new_value.false_label;

            return res;
        }
        else {
            return new Value(this.value, this.type, false);
        }
    }

    public checkLabels(generator: Generator3D, value: any) {
        if ( value.true_label === '' ) {
            value.true_label = generator.newLabel();
        }

        if ( value.false_label === '' ) {
            value.false_label = generator.newLabel();
        }

        return value;
    }
}