import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import { type } from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";
import {Value} from "../Abstract/Value.js";

export class Identifier extends Instruction {

    private id: string;
    private type: type;
    private value: string | any;

    constructor(id: string, row: number, col: number) {
        super(row, col);
        this.id = id;
        this.value = "null";
        this.type = type.NULL;
    }

    public interpret(tree: Tree, table: SymbolTable): any {
        
        let symbol = table.get_table(this.id);
        

        if (symbol == undefined){
            return new Exception("Semantic", `The id: ${this.id} doesn't exist in current context`, this.row, this.column, table.get_name());
        }

        this.type = symbol.type;
        this.value = symbol.value;

        return this.value;
    }

    get_type(){
        return this.type;
    }

    get_id(){
        return this.id;
    }

    get_value(){
        return this.value;
    }

    get_node() {
        let node = new Cst_Node("Identifier");
        node.add_child(this.id);

        return node;
    }

    toString(): String{
        return String(this.value);
    }

    compile(table: SymbolTable, generator: Generator3D, tree: Tree): any {
        let value = table.get_table(this.id);
        if ( value === null ) {
            // @ts-ignore
            generator.addError(`Variable not exists ${this.id}`, this.row, this.column);
            return;
        }

        let temp = generator.addTemp();
        let temp_pos;
        // @ts-ignore
        if ( value.id != undefined ) {
            // @ts-ignore
            temp_pos = value.position;

            // @ts-ignore
            if ( value.environment !== 'Global' ) {
                temp_pos = generator.addTemp();
                // @ts-ignore
                generator.addExpression(temp_pos, 'P', value.position-1, '+');
            }
        }

        generator.getStack(temp, temp_pos);

        // @ts-ignore
        if ( value.type !== type.BOOL ) {
            // @ts-ignore
            return new Value(temp, value?.type, true);
        }

        this.checkLabels(generator, value);
        // @ts-ignore
        generator.addIf(temp, '1', '==', value.label_true);
        // @ts-ignore
        generator.addGoTo(value.label_false);

        let val_return = new Value(null, type.BOOL, false);
        // @ts-ignore
        val_return.true_label = value.label_true;
        // @ts-ignore
        val_return.false_label = value.label_false;
        return val_return;
    }

    public checkLabels(generator: Generator3D, value: any) {
        value.label_true = generator.newLabel();
        value.label_false = generator.newLabel();
    }
}