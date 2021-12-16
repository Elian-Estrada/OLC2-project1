import {Instruction} from "../Abstract/Instruction.js";
import {Relational_operator, type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";
import {Value} from "../Abstract/Value.js";

export class Relational extends Instruction {
    compile(table: SymbolTable, generator: Generator3D) {

        let left = this.exp1.compile(table, generator);
        if ( left instanceof Exception )
            return left;

        let right = null;
        let res = new Value(null, type.BOOL, false);
        let operator = this.operator;

        if ( left.type != type.BOOL ) {
            right = this.exp2.compile(table, generator);

            if ( left.type == type.INT ) {
                switch ( right.type ) {
                    case type.INT:
                    case type.DOUBLE:
                        this.checkLabels(generator, left);
                        generator.addIf(left.value, right.value, operator, left.label_true);
                        generator.addGoTo(left.label_false);
                }
            }

            if ( left.type == type.STRING && right.type == type.STRING ) {
                generator.compareString();
                let param_temp = generator.addTemp();
                generator.addExpression(param_temp, 'P', table.get_size(), '+');

                generator.addExpression(param_temp, param_temp, '1', '+');
                generator.setStack(param_temp, left.value);

                generator.addExpression(param_temp, param_temp, '1', '+');
                generator.setStack(param_temp, right.value);

                generator.newEnv(table.get_size());
                generator.callFunc('compareStr');

                let temp = generator.addTemp();
                generator.getStack(temp, 'P');
                generator.setEnv(table.get_size());

                let true_label = generator.newLabel();
                let false_label = generator.newLabel();

                if ( this.operator == Relational_operator.EQUAL ) {
                    generator.addIf(temp, '0', '==', false_label);
                    generator.addGoTo(true_label);

                    let res = new Value(temp, type.BOOL, true);
                    res.true_label = true_label;
                    res.false_label = false_label;

                    return res;
                }

                if ( this.operator == Relational_operator.UNEQUAL ) {
                    generator.addIf(temp, '0', '!=', false_label);
                    generator.addGoTo(true_label);

                    let res = new Value(temp, type.BOOL, true);
                    res.true_label = true_label;
                    res.false_label = false_label;

                    return res;
                }
            }
        } else {
            let goto_right = generator.newLabel();
            let left_temp = generator.addTemp();

            generator.setLabel(left.true_label);
            generator.addExpression(left_temp, '1', '', '');
            generator.addGoTo(goto_right);

            generator.setLabel(left.false_label);
            generator.addExpression(left_temp, '0', '', '');
            generator.setLabel(goto_right);

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
        }

        res.true_label = left.label_true;
        res.false_label = left.label_false;
        return res;
    }

    public checkLabels(generator: Generator3D, value: any) {
        value.label_true = generator.newLabel();
        value.label_false = generator.newLabel();
    }

    private exp1: any;
    private exp2: any;
    private operator: Relational_operator;
    private type: type;
    private value: String;


    constructor(exp1: any, exp2: any, operator: Relational_operator, row: Number, column: Number) {
        super(row, column);
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.operator = operator;
        this.type = type.BOOL;
        this.value = "";
    }

    interpret(tree: Tree, table: SymbolTable) {
        //bool == bool -> si
        //bool != bool -> si
        //String == String -> si
        //String != String -> si
        //array == array -> si
        //array != array -> si
        //int y double -> si
        //int y char -> si
        //char y double -> si


        if (this.exp1 !== undefined && this.exp2 !== undefined){

            let left = this.exp1.interpret(tree, table);

            if (left instanceof Exception){
                return left;
            }

            let right = this.exp2.interpret(tree, table);

            if (right instanceof Exception){
                return right;
            }

            switch(this.operator){
                case Relational_operator.EQUAL:
                case Relational_operator.UNEQUAL:

                    switch(this.exp1.get_type()){
                        case type.INT:
                        case type.DOUBLE:

                            switch(this.exp2.get_type()){
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(parseFloat(left), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(parseFloat(left), right.charCodeAt(), this.operator);
                                default:
                                    return new Exception("Semantic", `The type: ${this.exp2.get_type()} cannot be operated whit type: ${this.exp1.get_type()}`, this.row, this.column);
                            }
                        case type.CHAR:
                            
                            switch(this.exp2.get_type()){
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(left.charCodeAt(), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", `The type: ${this.exp2.get_type()} cannot be operated whit type: ${this.exp1.get_type()}`, this.row, this.column);
                            }
                        case type.STRING:
                            switch(this.exp2.get_type()){
                                case type.STRING:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", `The type: ${this.exp2.get_type()} cannot be operated whit type: ${type.STRING}`, this.row, this.column);
                            }
                        case type.BOOL:
                            switch(this.exp2.get_type()){
                                case type.BOOL:
                                    return this.to_lower(JSON.parse(left), JSON.parse(right), this.operator);
                                default:
                                    return new Exception("Semantic", `The type: ${this.exp2.get_type()} cannot be operated whit type: ${type.BOOL}`, this.row, this.column);
                            }
                        case type.ARRAY:
                            switch(this.exp2.get_type()){
                                case type.ARRAY:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", `The type: ${this.exp2.get_type()} cannot be operated whit type: ${type.ARRAY}`, this.row, this.column)
                            }
                        case type.STRUCT:
                            
                            switch(this.exp2.get_type()){
                                case type.NULL:
                                    return this.to_lower(left.get_value(), right, this.operator);
                                case type.STRUCT:
                                    return this.to_lower(left.get_value(), right.get_value(), this.operator);
                                default:
                                    return new Exception("Semantic", `The type: ${this.exp2.get_type()} cannot be operated whit type: ${type.STRUCT}`, this.exp2.row, this.exp2.column);
                            }
                        case type.NULL:
                            switch(this.exp2.get_type()){
                                case type.NULL:
                                    return this.to_lower(left, right, this.operator);
                                case type.STRUCT:
                                    return this.to_lower(left, right.get_value(), this.operator);
                                case type.STRING:
                                    return this.to_lower(left, right, this.operator);
                                case type.CHAR:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", `The type: ${this.exp2.get_type()} cannot be operated whit type: ${type.NULL}`, this.exp2.row, this.exp2.column);
                            }
                        default:
                            return new Exception("Semantic", `The type: ${this.exp1.get_type()} cannot be operated whit operator: ${this.operator}`, this.exp1.row, this.exp2.row);

                    }
                case Relational_operator.GREATER:
                case Relational_operator.GREATEREQUAL:
                case Relational_operator.LESS:
                case Relational_operator.LESSEQUAL:

                    switch(this.exp1.get_type()){
                        case type.INT:
                        case type.DOUBLE:
                            switch(this.exp2.get_type()){
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(parseFloat(left), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(parseFloat(left), right.charCodeAt(), this.operator);
                                default:
                                    return new Exception("Semantic", `The type: ${this.exp2.get_type()} cannot be operated whit type: ${this.exp1.get_type()}`, this.row, this.column);    
                            }
                        case type.CHAR:
                            switch(this.exp2.get_type()){
                                case type.INT:
                                case type.DOUBLE:
                                    return this.to_lower(left.charCodeAt(), parseFloat(right), this.operator);
                                case type.CHAR:
                                    return this.to_lower(left, right, this.operator);
                                default:
                                    return new Exception("Semantic", `The type: ${this.exp2.get_type()} cannot be operated whit type: ${this.exp1.get_type()}`, this.row, this.column);
                            }
                        default:
                            return new Exception("Semantic", `The type: ${this.exp1.get_type()} cannot be operated whit operator: ${this.operator}`, this.row, this.column);
                    }
            }

        } else {
            return new Exception("Semantic", "Expression Expected", this.row, this.column);
        }

    }


    to_lower(op1: any, op2: any, operator: Relational_operator){

        switch(operator){
            case Relational_operator.EQUAL:
                
                this.value = String(op1 == op2).toLowerCase();
                return this.value
            case Relational_operator.UNEQUAL:
                this.value = String(op1 != op2).toLowerCase();
                return this.value
            case Relational_operator.GREATER:
                this.value = String(op1 > op2).toLowerCase();
                return this.value
            case Relational_operator.GREATEREQUAL:
                this.value = String(op1 >= op2).toLowerCase();
                return this.value
            case Relational_operator.LESS:
                this.value = String(op1 < op2).toLowerCase();
                return this.value
            case Relational_operator.LESSEQUAL:
                this.value = String(op1 <= op2).toLowerCase();
                return this.value
        }

    }


    get_type(): type {
        return this.type;
    }

    get_node() {
        let node = new Cst_Node("Expression Relational");
        node.add_childs_node(this.exp1.get_node());
        node.add_child(this.operator);
        node.add_childs_node(this.exp2.get_node());

        return node;
    }

    toString(): String{
        return String(this.value);
    }
}