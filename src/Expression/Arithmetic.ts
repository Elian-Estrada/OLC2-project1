import {Instruction} from "../Abstract/Instruction.js";
import {Arithmetic_operator, type} from "../SymbolTable/Type.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import {Identifier} from "./Identifier.js";

export class Arithmetic extends Instruction {

    private operator: string;
    private exp1: any;
    private exp2: any;
    private value: String;
    private type: type | null;
    private bool: object;

    constructor(exp1: Instruction, exp2: Instruction, operator: string, row: Number, column: Number) {
        super(row, column);
        this.operator = operator;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.value = "";
        this.type = null;
        this.bool = {
            true: true,
            false: false
        }
    }

    public interpret(tree: Tree, table: SymbolTable) {
        let left = this.exp1.interpret(tree, table);

        if ( left instanceof Exception )
            return left;

        if ( this.exp2 != null ) {
            let right = this.exp2.interpret(tree, table);

            if ( right instanceof  Exception )
                return right;

            switch ( this.operator ) {
                case Arithmetic_operator.ADDITION:
                    if ( this.exp1.get_type() === type.INT || this.exp1.get_type() === type.DOUBLE ) {
                        switch ( this.exp2.get_type() ) {
                            case type.INT:
                                this.exp1.get_type() === type.INT ? 
                                this.type = type.INT : 
                                this.type = type.DOUBLE;

                                this.exp1.get_type() === type.INT ? 
                                this.value = String(parseInt(left) + parseInt(right)) :  
                                this.value = String(parseFloat(left) + parseFloat(right));
                                return this.value;
                            case type.DOUBLE:
                                this.type = type.DOUBLE;
                                this.value = String(parseFloat(left) + parseFloat(right));
                                break;
                            case type.CHAR:
                                this.exp1.get_type() === type.INT ? 
                                this.type = type.INT : 
                                this.type = type.DOUBLE;
                                this.exp1.get_type() === type.INT ? 
                                this.value = String(parseInt(left) + right.charCodeAt(0)) :  
                                this.value = String(parseFloat(left) + right.charCodeAt(0));
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} \n cannot be operated with type: INTEGER`, this.row, this.column);
                        }
                    }

                    else if(this.exp1.get_type() === type.CHAR){
                        switch(this.exp2.get_type()){
                            case type.INT:
                            case type.DOUBLE:
                                this.exp2.get_type() === type.INT ? 
                                this.type = type.INT : 
                                this.type = type.DOUBLE;
                                this.exp2.get_type() === type.INT ? 
                                this.value = String(parseInt(right) + left.charCodeAt(0)) :  
                                this.value = String(parseFloat(right) + left.charCodeAt(0));
                                break;
                            case type.CHAR:
                                this.type = type.INT;
                                this.value = String(left.charCodeAt() + right.charCodeAt());
                                break;
                        }
                    }

                    else if ( this.exp1.get_type() === type.STRING ||
                                this.exp1.get_type() === type.BOOL ||
                                this.exp1.get_type() === type.NULL ) {
                        return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} \n cannot  be operated with type: ${this.exp1.get_type().toString()}`, this.row, this.column);
                    }
            }

            switch ( this.operator ) {
                case Arithmetic_operator.SUBSTRACTION:
                case Arithmetic_operator.MULTIPLICATION:
                case Arithmetic_operator.DIVISION:
                case Arithmetic_operator.MODULS:
                    if ( this.exp1.get_type() === type.INT ) {
                        switch ( this.exp2.get_type() ) {
                            case type.INT:
                                this.type = type.INT;
                                this.value = this.operation(parseInt(left), parseInt(right), this.operator);
                                break;
                            case type.DOUBLE:
                                this.type = type.DOUBLE;
                                this.value = this.operation(parseFloat(left), parseFloat(right), this.operator);
                                break;
                            case type.CHAR:
                                this.type = type.CHAR;
                                this.value = this.operation(parseInt(left), right.charCodeAt(0), this.operator);
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} \n cannot be operated with type: INTEGER`, this.row, this.column);
                        }
                    }

                    else if ( this.exp1.get_type() === type.DOUBLE ) {
                        switch ( this.exp2.get_type() ) {
                            case type.INT:
                            case type.DOUBLE:
                                this.type = type.DOUBLE;
                                this.value = this.operation(parseFloat(left), parseFloat(right), this.operator);
                                break;
                            case type.CHAR:
                                this.type = type.INT;
                                this.value = this.operation(parseInt(left), right.charCodeAt(0), this.operator);
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} \n cannot be operated with type: DOUBLE`, this.row, this.column);
                        }
                    }

                    else if ( this.exp1.get_type() === type.CHAR ) {
                        switch ( this.exp2.get_type() ) {
                            case type.INT:
                                this.type = type.INT;
                                this.value = this.operation(left.charCodeAt(0), parseInt(right), this.operator);
                                break;
                            case type.DOUBLE:
                                this.type = type.DOUBLE;
                                this.value = this.operation(parseFloat(left.charCodeAt(0)), parseFloat(right), this.operator);
                                break;
                            case type.CHAR:
                                this.type = type.INT;
                                this.value = this.operation(left.charCodeAt(0), right.charCodeAt(0), this.operator);
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} \n cannot be operated with type: CHAR`, this.row, this.column);
                        }
                    }
            }
            
        } else {
            let symbol: Symbol | null = null;
            console.log(this.operator);
            
            switch ( this.operator ) {
                case Arithmetic_operator.SUBSTRACTION:
                    switch ( this.exp1.get_type() ) {
                        case type.INT:
                            this.type = type.INT;
                            this.value = String(- parseInt(left));
                            break;
                        case type.DOUBLE:
                            this.type = type.DOUBLE;
                            this.value = String(- parseFloat(left));
                            break
                        default:
                            return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} \n cannot be operated with operator -`, this.row, this.column);
                    }
                    break;
                case Arithmetic_operator.INC:
                case Arithmetic_operator.DEC:
                    if (this.exp1 instanceof Identifier){
                        switch (this.exp1.get_type()){
                            case type.INT:
                                left = parseInt(left);
                                break;
                            case type.DOUBLE:
                                left = parseFloat(left);
                                break;
                            default:
                                return new Exception("Semantic", `The type: ${this.exp1.get_type()} \n cannot be operated whit operator: ${this.operator}`, this.row, this.column);
                        }

                        console.log(left);
                        

                        if (this.operator === Arithmetic_operator.INC){
                            symbol = new Symbol(this.exp1.get_id(), this.exp1.get_type(), this.row, this.column, String(left + 1));
                        }else {
                            symbol = new Symbol(this.exp1.get_id(), this.exp1.get_type(), this.row, this.column, String(left - 1));
                        }

                        console.log(symbol);
                        
                        let result = table.update_table(symbol);

                        console.log(result);
                        
                        if (result instanceof Exception){
                            return result;
                        }

                        this.type = this.exp1.get_type();
                        this.value = symbol.value;

                        return this.value;
                    }
                default:
                    return new Exception("Semantic", `Invalid operator: ${this.operator.toString()}`, this.row, this.column);
            }
        }
        return this.value;
    }

    operation(op1: any, op2: any, op: Arithmetic_operator): String{
        switch(op){
            case Arithmetic_operator.MULTIPLICATION:
                return String(op1 * op2);
            case Arithmetic_operator.SUBSTRACTION:
                return String(op1 - op2);
            case Arithmetic_operator.MODULS:
                return String(op1 % op2);
            case Arithmetic_operator.DIVISION:
                return String(op1 / op2);
            default:
                return "";
        }
    }

    public get_type(): type | null {
        return this.type;
    }

    toString(): String {
        return this.value;
    }
}