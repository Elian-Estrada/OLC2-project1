import {Instruction} from "../Abstract/Instruction.js";
import {Arithmetic_operator, type} from "../SymbolTable/Type.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import Exception from "../SymbolTable/Exception.js";

export class Arithmetic {

    private operator: string;
    private exp1: any;
    private exp2: any;
    private value: number | null;
    private row: Number;
    private col: Number;
    private type: type | null;
    private bool: object;

    constructor(exp1: Instruction, exp2: Instruction, operator: string, row: Number, col: Number) {
        this.operator = operator;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.value = null;
        this.row = row;
        this.col = col;
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

            if ( this.operator == Arithmetic_operator.ADDITION ) {
                if ( this.exp1.get_type() == type.INT ) {
                    if ( this.exp2.get_type() == type.INT ) {
                        this.type = type.INT;
                        this.value = parseInt(left) + parseInt(right);
                    }
                    else if ( this.exp2.get_type() == type.DOUBLE ) {
                        this.type = type.DOUBLE;
                        this.value = parseFloat(left) + parseFloat(right);
                    }
                    else if ( this.exp2.get_type() == type.STRING ) {
                        this.type = type.STRING;
                        this.value = left.toString() + right;
                    }
                    else if ( this.exp2.get_type() == type.CHAR ) {
                        this.type = type.INT;
                        this.value = parseInt(this.exp1) + parseInt(this.exp2.charCodeAt(0));
                    }
                    else {
                        return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: INTEGER`, this.row, this.col);
                    }
                }

                else if ( this.exp1.get_type() == type.DOUBLE ) {
                    if ( this.exp2.get_type() == type.INT || this.exp2.get_type() == type.DOUBLE ) {
                        this.type = type.DOUBLE;
                        this.value = parseFloat(left) + parseFloat(right);
                    }
                    else if ( this.exp2.get_type() == type.STRING ) {
                        this.type = type.STRING;
                        this.value = left.toString() + right;
                    }
                    else if ( this.exp2.get_type() == type.CHAR ) {
                        this.type = type.DOUBLE;
                        this.value = parseFloat(this.exp1) + parseFloat(this.exp2.charCodeAt(0));
                    }
                    else {
                        return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: DOUBLE`, this.row, this.col);
                    }
                }

                else if ( this.exp1.get_type() == type.BOOL ) {
                    if ( this.exp2.get_type() == type.STRING ) {
                        this.type = type.STRING;
                        this.value = left.toString() + right;
                    }
                    else {
                        return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: BOOL`, this.row, this.col);
                    }
                }

                else if ( this.exp1.get_type() == type.CHAR ) {
                    if ( this.exp2.get_type() == type.INT ) {
                        this.type = type.INT;
                        this.value = parseInt(this.exp1.charCodeAt(0)) + parseInt(this.exp2);
                    }
                    else if ( this.exp2.get_type() == type.DOUBLE ) {
                        this.type = type.DOUBLE;
                        this.value = parseFloat(this.exp1.charCodeAt(0)) + parseFloat(this.exp2);
                    }
                    else if ( this.exp2.get_type() == type.CHAR ) {
                        this.type = type.CHAR;
                        this.value = parseInt(this.exp1.charCodeAt(0)) + parseInt(this.exp2.charCodeAt(0));
                    }
                    else if ( this.exp2.get_type() == type.STRING ) {
                        this.type = type.STRING;
                        this.value = this.exp1.toString() + this.exp2;
                    }
                    else {
                        return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: CHAR`, this.row, this.col);
                    }
                }

                else if ( this.exp1.get_type() == type.STRING ) {
                    switch (this.exp2.get_type()) {
                        case type.INT:
                        case type.DOUBLE:
                        case type.BOOL:
                        case type.CHAR:
                        case type.STRING:
                            this.value = this.exp1.toString() + this.exp2.toString();
                            break;
                        default:
                            return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: STRING`, this.row, this.col);
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