import {Function} from "../Instructions/Function.js";
import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";

export class CaracterOfPosition extends Function {

    constructor(type: string, name: string, params: Array<any>,
                instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);
    }
}