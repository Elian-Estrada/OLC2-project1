import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";

export class ForIn extends Instruction {

    private firsExp: any;
    private secondExp: Array<Instruction>;
    private instructions: Array<Instruction>;
    private counter: number;

    constructor(firstExp: any, secondExp: Array<Instruction>,
                instructions: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.firsExp = firstExp;
        this.secondExp = secondExp;
        this.instructions = instructions;
        this.counter = 0;
    }

    interpret(tree: Tree, table: SymbolTable): any {

    }
}