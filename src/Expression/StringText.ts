import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {String_operator, type} from "../SymbolTable/Type.js";

export class StringText extends Instruction {

    private operator: string;
    private exp1: any;
    private exp2: any;
    private value: String;
    private type: type | null;

    constructor(exp1: Instruction, exp2: Instruction, operator: string, row: number, col: number) {
        super(row, col);
        this.operator = operator;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.value = "";
        this.type = null;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let left = this.exp1.interpret(tree, table);

        if ( left instanceof Exception )
            return left;

        if ( this.exp2 != null ) {
            let right = this.exp2.interpret(tree, table);

            if ( right instanceof  Exception )
                return right;

            switch ( this.operator ) {
                case String_operator.CONCAT:
                    switch ( this.exp1.get_type() ) {
                        case type.INT:
                        case type.DOUBLE:
                        case type.BOOL:
                        case type.CHAR:
                        case type.NULL:
                            if ( this.exp2.get_type() == type.STRING ) {
                                this.type = type.STRING;
                                this.value = left.toString() + right.toString();
                            } else
                                return new Exception("Semantic", `The type: ${this.exp1.get_type()} \n cannot be concatenated whit type: ${this.exp2.get_type()}`, this.row, this.column);
                            break;
                    }

                    if ( this.exp1.get_type() == type.STRING ) {
                        switch ( this.exp2.get_type() ) {
                            case type.INT:
                            case type.DOUBLE:
                            case type.BOOL:
                            case type.CHAR:
                            case type.STRING:
                            case type.NULL:
                                this.type = type.STRING;
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: STRING`, this.row, this.column);
                        }
                    }
                    break;
                case String_operator.REPETITION:
                    if ( this.exp1.get_type() === type.STRING && this.exp2.get_type() === type.INT ) {
                        this.type = type.STRING;
                        this.value = left.repeat(right);
                    } else {
                        return new Exception("Semantic", `This operation cannot be performed`, this.row, this.column);
                    }
                    break;
            }
        }
        return this.value;
    }

    operation(op1: any, op2: any, op: String_operator): String{
        switch(op){
            case String_operator.CONCAT:
                return String(op1 + op2);
            case String_operator.REPETITION:
                return String(op1.repeat(op2));
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