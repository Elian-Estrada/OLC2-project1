import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";

export class Case extends Instruction {

    private expr: any;
    private instructions: Array<Instruction>;

    constructor(expr: any, instructions: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.expr = expr;
        this.instructions = instructions;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        return this.expr.interpret(tree, table);
    }

    public get_instructions() {
        return this.instructions;
    }

    public get_value() {
        return this.expr;
    }
}