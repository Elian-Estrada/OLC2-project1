import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { Logical_operator, type } from "../SymbolTable/Type.js";
import {Value} from "../Abstract/Value.js";

export class Logical extends Instruction{

    private exp1: any;
    private exp2: any;
    private operator: Logical_operator;
    private type: type;
    private value: String;

    constructor(exp1: any, exp2: any, operator: Logical_operator, row: Number, column: Number) {
        super(row, column);
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.operator = operator;
        this.type = type.BOOL;
        this.value = "";
    }

    interpret(tree: Tree, table: SymbolTable){

        let left = this.exp1.interpret(tree, table);

        if (left instanceof Exception){
        }

        if (this.exp2 != null){

            let right = this.exp2.interpret(tree, table);
            
            if (right instanceof Exception){
                return right;
            }

            if (this.exp1.get_type() === type.BOOL && this.exp2.get_type() === type.BOOL){
                
                switch(this.operator){
                    case Logical_operator.AND:
                        this.value = String(JSON.parse(left) && JSON.parse(right)).toLowerCase();
                        
                        return this.value;
                    case Logical_operator.OR:
                        this.value = String(JSON.parse(left) || JSON.parse(right)).toLowerCase();
                        return this.value;
                }

            } else {
                return new Exception("Semantic", "This operators only work whit type boolean", this.row, this.column, table.get_name());
            }

        } else {
            if(this.exp1.get_type() == type.BOOL){
                this.value = String(! JSON.parse(left)).toLowerCase();
                return this.value;
            } else {
                return new Exception("Semantic", `The type: ${this.exp1.get_type()} does not work whit operator: ${this.operator}`, this.row, this.column, table.get_name());
            }
        }

    }

    compile(table: SymbolTable, generator: Generator3D): any {
        if( this.exp1.get_type() != type.BOOL ) {
            generator.addError("Variable not boolean", Number(this.row), Number(this.column));
            return;
        }

        let left = this.exp1.compile(table, generator);
        if ( left instanceof Exception )
            return left;

        let res = new Value(null, type.BOOL, false);

        if ( this.exp2 !== null ) {

            if ( this.exp2.get_type() !== type.BOOL ) {
                generator.addError("Variable not boolean", Number(this.row), Number(this.column));
                return;
            }

            let go_right = generator.newLabel();
            let left_temp = generator.addTemp();

            generator.setLabel(left.true_label);
            generator.addExpression(left_temp, '1', '', '');
            generator.addGoTo(go_right);

            generator.setLabel(left.false_label);
            generator.addExpression(left_temp, '0', '', '');
            generator.setLabel(go_right);

            let right = this.exp2.compile(table, generator);
            if ( right.get_type() != type.BOOL ) {
                generator.addError('Relational: Operator must be boolean', Number(this.row), Number(this.column));
                return ;
            }

            let goto_end = generator.newLabel();
            let right_temp = generator.addTemp();

            generator.setLabel(right.true_label);
            generator.addExpression(right_temp, '1', '', '');
            generator.addGoTo(goto_end);

            generator.setLabel(right.false_label);
            generator.addExpression(right_temp, '0', '', '');

            generator.setLabel(goto_end);
            this.checkLabels(generator, left);
            generator.addIf(left_temp, right_temp, this.operator, left.label_true);
            generator.addGoTo(left.label_false);

            res.true_label = left.label_true;
            res.false_label = left.label_false;
        }
        else {
            let temp = left.true_label;
            left.true_label = left.false_label;
            left.false_label = temp;

            res.true_label = left.true_label;
            res.false_label = left.false_label;
        }
        return res;
    }

    public checkLabels(generator: Generator3D, value: any) {
        value.label_true = generator.newLabel();
        value.label_false = generator.newLabel();
    }

    get_type(): type{
        return this.type;
    }

    get_node() {
        let node = new Cst_Node("Expression Logic");

        if (this.exp2 !== null){
            node.add_childs_node(this.exp1.get_node());
            node.add_child(this.operator);
            node.add_childs_node(this.exp2.get_node());
        } else {
            node.add_child("!");
            node.add_childs_node(this.exp1.get_node());
        }

        return node;
    }

    toString(): String{
        return String(this.value);
    }

}