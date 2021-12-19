import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {Generator3D} from "../Generator/Generator3D.js";

export class ExpressionIterable extends Instruction {

    private exp1: Instruction;
    private exp2: Instruction;

    constructor(exp1: Instruction, exp2: Instruction, row: number, col: number) {
        super(row, col);
        this.exp1 = exp1;
        this.exp2 = exp2;
    }

    compile(table: SymbolTable, generator: Generator3D, tree: Tree): any {
        let val1 = this.exp1.compile(table, generator, tree);
        let val2 = this.exp2.compile(table, generator, tree);
        let lis_aux = [];
        lis_aux.push(val1);
        lis_aux.push(val2);

        return lis_aux;
    }

    get_node(): any {
    }

    interpret(tree: Tree, table: SymbolTable): any {
    }

}