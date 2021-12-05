import { Instruction } from "../Abstract/Instruction";
import { type, Relational_operator } from "../SymbolTable/Type";
import Exception from "../SymbolTable/Exception";
import Tree from "../SymbolTable/Tree";
import SymbolTable from "../SymbolTable/SymbolTable";

export class Relational extends Instruction{


    private exp1: any;
    private exp2: any;
    private operator: Relational_operator;
    private type: type;
    private value: String;
    private isBool: {};


    constructor(exp1: any, exp2: any, operator: Relational_operator, row: Number, column: Number) {
        super(row, column);
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.operator = operator;
        this.type = type.BOOL;
        this.value = "";
        this.isBool = {"true": true, "false": false};
    }

    interpret(tree: Tree, table: SymbolTable) {
        //bool == bool -> si
        //bool != bool -> si
        //String == String -> si
        //STring != String -> si
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
                                    return this.to_lower(left, right, this.operator);
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
                        default:
                            return new Exception("Semantic", `The type: ${this.exp1.get_type()} cannot be operated whit operator: ${this.operator}`, this.row, this.column);

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
                return String(op1 == op2).toLowerCase();
            case Relational_operator.UNEQUAL:
                return String(op1 != op2).toLowerCase();
            case Relational_operator.GREATER:
                return String(op1 > op2).toLowerCase();
            case Relational_operator.GREATEREQUAL:
                return String(op1 >= op2).toLowerCase();
            case Relational_operator.LESS:
                return String(op1 < op2).toLowerCase();
            case Relational_operator.LESSEQUAL:
                return String(op1 <= op2).toLowerCase();
        }

    }


    get_type(): type {
        return this.type;
    }

    toString(): String{
        return this.value;
    }
}