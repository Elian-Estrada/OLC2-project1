import { Instruction } from "../Abstract/Instruction.js";
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";
import {Generator3D} from "../Generator/Generator3D.js";
import {Value} from "../Abstract/Value.js";

export class Pow extends Function {

    private exp1: any;
    private exp2: any;

    constructor(exp1: any, exp2: any, type: string, name: string, params: Array<any>,
                instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);

        this.exp1 = exp1;
        this.exp2 = exp2;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let base = this.exp1.interpret(tree, table);

        if (base instanceof Exception){
            return base;
        }

        let pow = this.exp2.interpret(tree, table);

        if (pow instanceof Exception){
            return pow;
        }

        if (this.exp1.get_type() !== type.INT && this.exp1.get_type() !== type.DOUBLE){
            return new Exception("Semanitc", `The base: ${base} can only be of type int|double`, this.exp1.row, this.exp1.column, table.get_name());
        }

        if (this.exp2.get_type() !== type.INT){
            return new Exception("Semantic", `The pow: ${pow} can only be of type int`, this.exp2.row, this.exp2.column, table.get_name());
        }

        this.type = this.exp1.get_type();
        return base ** pow;
    }

    public compile(table: SymbolTable, generator: Generator3D, tree: Tree) {

        let left_value = this.exp1.compile(table, generator, tree);
        let right_value = this.exp2.compile(table, generator, tree);

        generator.powerTo();
        let param_temp = generator.addTemp();
        generator.addExpression(param_temp, 'P', table.get_size(), '+');

        // base
        generator.addExpression(param_temp, param_temp, '1', '+');
        generator.setStack(param_temp, left_value.value);

        // exponente
        generator.addExpression(param_temp, param_temp, '1', '+');
        generator.setStack(param_temp, right_value.value);

        generator.newEnv(table.get_size());
        generator.callFunc('powerTo');
        let temp = generator.addTemp();
        generator.getStack(temp, 'P');
        generator.setEnv(table.get_size());

        return new Value(temp, type.INT, true);
    }
}