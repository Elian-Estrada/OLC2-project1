import { Instruction } from "../Abstract/Instruction.js";
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";
import {Generator3D} from "../Generator/Generator3D.js";
import {Value} from "../Abstract/Value.js";

export class Cos extends Function {

    private expression: any;

    constructor(expression: any, type: string, name: string, params: Array<any>,
        instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);
        this.expression = expression;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let value = this.expression.interpret(tree,table);

        if (value instanceof Exception){
            return value;
        }

        if (this.expression.get_type() !== type.INT && this.expression.get_type() !== type.DOUBLE){
            return new Exception("Semantic", `The expression: ${value} can be only type: int|doulbe`, this.expression.row, this.expression.column, table.get_name());
        }

        this.type = type.DOUBLE;
        return Math.cos((value * Math.PI) / 180);
    }

    compile(table: SymbolTable, generator: Generator3D, tree: Tree) {
        let exp = this.expression.compile(table, generator, tree);
        let temp = generator.addTemp();
        generator.cosOf(temp, exp.value);
        return new Value(temp, this.type, false);
    }
}