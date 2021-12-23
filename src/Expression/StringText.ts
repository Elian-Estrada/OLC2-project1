import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {String_operator, type} from "../SymbolTable/Type.js";
import {Cst_Node} from "../Abstract/Cst_Node.js";
import {Generator3D} from "../Generator/Generator3D.js";
import {Value} from "../Abstract/Value.js";
import {Primitive} from "./Primitive.js";

export class StringText extends Instruction {

    compile(table: SymbolTable, generator: Generator3D, tree: Tree) {
        let operation = this.operator;

        if ( operation === String_operator.CONCAT ) {
            if ( this.exp1.get_type() === type.STRING && this.exp2.get_type() === type.STRING ) {
                let left = this.exp1.compile(table, generator, tree);
                let right = this.exp2.compile(table, generator, tree);
                generator.concatString();
                let paramTemp = generator.addTemp();
                generator.addExpression(paramTemp, 'P', table.get_size(), '+');

                // Valor izquierda
                generator.addExpression(paramTemp, paramTemp, '1', '+');
                generator.setStack(paramTemp, left.value);

                // Valor derecha
                generator.addExpression(paramTemp, paramTemp, '1', '+');
                generator.setStack(paramTemp, right.value);

                generator.newEnv(table.get_size());
                generator.callFunc('concatString');
                let temp = generator.addTemp();

                generator.getStack(temp, 'P');
                generator.setEnv(table.get_size());

                let ret_val = new Value(temp, type.STRING, true);
                ret_val.size = left.size + right.size;
                return ret_val;
            }
            else {
                let new_val = this.exp1.toString() + this.exp2.value.toString();
                let new_prim = new Primitive(new_val, type.STRING, this.row, this.column);
                let exp = new_prim.compile(table, generator, tree);
                let ret_val = new Value(exp.value, type.STRING, true);
                ret_val.size = exp.size;
                return ret_val;
            }
        }
        else if ( operation === String_operator.REPETITION ) {
            let left = this.exp1.compile(table, generator, tree);
            let right = this.exp2.compile(table, generator, tree);
            generator.repString();
            let param_temp = generator.addTemp();
            generator.addExpression(param_temp, 'P', table.get_size(), '+');

            generator.addExpression(param_temp, param_temp, '1', '+');
            generator.setStack(param_temp, left.value);

            generator.addExpression(param_temp, param_temp, '1', '+');
            generator.setStack(param_temp, right.value);

            generator.newEnv(table.get_size());
            generator.callFunc('repetitionStr');

            let temp = generator.addTemp();
            generator.getStack(temp, 'P');
            generator.setEnv(table.get_size());

            let ret_val = new Value(temp, type.STRING, true);
            ret_val.size = parseInt(left.size) * parseInt(right.value);

            return ret_val;
        }
    }

    private operator: string;
    private exp1: any;
    private exp2: any;
    private value: string;
    private type: type | null;

    constructor(exp1: Instruction, exp2: Instruction, operator: string, row: number, col: number) {
        super(row, col);
        this.operator = operator;
        this.exp1 = exp1;
        this.exp2 = exp2;
        // @ts-ignore
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
                        case type.ARRAY:
                        case type.NULL:
                            if ( this.exp2.get_type() == type.STRING ) {
                                this.type = type.STRING;
                                this.value = left.toString() + right.toString();
                            } else
                                return new Exception("Semantic", `The type: ${this.exp1.get_type()} \n cannot be concatenated whit type: ${this.exp2.get_type()}`, this.row, this.column, table.get_name());
                            break;
                    }

                    if ( this.exp1.get_type() == type.STRING ) {
                        switch ( this.exp2.get_type() ) {
                            case type.INT:
                            case type.DOUBLE:
                            case type.BOOL:
                            case type.CHAR:
                            case type.STRING:
                            case type.ARRAY:
                            case type.NULL:
                                this.type = type.STRING;
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception("Semantic", `The type ${this.exp2.get_type().toString()} cannot be operated with type: STRING`, this.row, this.column, table.get_name());
                        }
                    }
                    break;
                case String_operator.REPETITION:
                    if ( this.exp1.get_type() === type.STRING && this.exp2.get_type() === type.INT ) {
                        this.type = type.STRING;
                        this.value = left.repeat(right);
                    } else {
                        return new Exception("Semantic", `This operation cannot be performed`, this.row, this.column, table.get_name());
                    }
                    break;
            }
        }
        return this.value;
    }

    operation(op1: any, op2: any, op: String_operator): String{
        switch(op){
            case String_operator.CONCAT:
                // @ts-ignore
                return String(op1 + op2);
            case String_operator.REPETITION:
                // @ts-ignore
                return String(op1.repeat(op2));
            default:
                // @ts-ignore
                return "";
        }
    }

    public get_type(): type | null {
        return this.type;
    }

    get_node() {
        let node = new Cst_Node("Concat");

        node.add_childs_node(this.exp1.get_node());
        node.add_child(this.operator);
        node.add_childs_node(this.exp2.get_node());

        return node;
    }

    toString(): string {
        // @ts-ignore
        return String(this.value);
    }
}