import {Instruction} from "../Abstract/Instruction.js";
import {Arithmetic_operator, type} from "../SymbolTable/Type.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import Exception from "../SymbolTable/Exception.js";

export class Arithmetic extends Instruction {

    private operator: string;
    private exp1: any;
    private exp2: any;
    private value: number | null;
    private type: type | null;
    private bool: object;

    constructor(exp1: Instruction, exp2: Instruction, operator: string, row: Number, column: Number) {
        super(row, column);
        this.operator = operator;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.value = null;
        this.type = null;
        this.bool = {
            true: true,
            false: false
        }
    }

    public interpret(tree: Tree, table: SymbolTable) {
        let left = this.exp1.interpret(tree, table);

        if ( left instanceof Error )
            return left;

        if ( this.exp2 != null ) {
            let right = this.exp2.interpret(tree, table);

            if ( right instanceof  Error )
                return right;

            switch ( this.operator ) {
                case Arithmetic_operator.ADDITION:
                    if ( this.exp1.getType() === type.INT ) {
                        switch ( this.exp2.getType() ) {
                            case type.INT:
                                this.value = parseInt(left) + parseInt(right)
                                break;
                            case type.DOUBLE:
                                this.value = parseFloat(left) + parseFloat(right);
                                break;
                            case type.CHAR:
                                this.value = parseInt(left) + right.charCodeAt(0);
                                break;
                            case type.STRING:
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: INTEGER`, this.row, this.column);
                        }
                    }

                    else if ( this.exp1.getType() === type.STRING ) {
                        switch ( this.exp2.getType() ) {
                            case type.INT:
                            case type.DOUBLE:
                            case type.CHAR:
                            case type.STRING:
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: STRING`, this.row, this.column);
                        }
                    }

                    else if ( this.exp1.getType() === type.BOOL ) {
                        switch ( this.exp2.getType() ) {
                            case type.STRING:
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: BOOLEAN`, this.row, this.column);
                        }
                    }
            }

            switch ( this.operator ) {
                case Arithmetic_operator.SUBSTRACTION:
                case Arithmetic_operator.MULTIPLICATION:
                case Arithmetic_operator.DIVISION:
                case Arithmetic_operator.MODULS:
                    if ( this.exp1.getType() === type.INT ) {
                        switch ( this.exp2.getType() ) {
                            case type.INT:
                                this.value = parseInt(left) + parseInt(right)
                                break;
                            case type.DOUBLE:
                                this.value = parseFloat(left) + parseFloat(right);
                                break;
                            case type.CHAR:
                                this.value = parseInt(left) + right.charCodeAt(0);
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: INTEGER`, this.row, this.column);
                        }
                    }

                    else if ( this.exp1.getType() === type.DOUBLE ) {
                        switch ( this.exp2.getType() ) {
                            case type.INT:
                            case type.DOUBLE:
                                this.value = parseFloat(left) + parseFloat(right);
                                break;
                            case type.CHAR:
                                this.value = parseInt(left) + right.charCodeAt(0);
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: DOUBLE`, this.row, this.column);
                        }
                    }

                    else if ( this.exp1.getType() === type.CHAR ) {
                        switch ( this.exp2.get_type() ) {
                            case type.INT:
                                this.value = left.charCodeAt(0) - parseInt(right);
                                break;
                            case type.DOUBLE:
                                this.value = parseFloat(left.charCodeAt(0)) - parseFloat(right);
                                break;
                            case type.CHAR:
                                this.value = left.charCodeAt(0) - right.charCodeAt(0);
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: CHAR`, this.row, this.column);
                        }
                    }
            }
        }

        return this.value;
    }

    public get_type(): type | null {
        return this.type;
    }
}