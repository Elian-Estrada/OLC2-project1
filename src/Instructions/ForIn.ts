import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";
import {type} from "../SymbolTable/Type.js";
import {Assignment} from "./Assignment.js";

export class ForIn extends Instruction {

    private firsExp: any;
    private secondExp: any;
    private instructions: Array<Instruction>;
    private counter: number;

    constructor(firstExp: any, secondExp: any,
                instructions: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.firsExp = firstExp;
        this.secondExp = secondExp;
        this.instructions = instructions;
        this.counter = 0;
    }

    interpret(tree: Tree, table: SymbolTable): any {

        let value_dec;
        let value_iterable;

        if ( this.firsExp != null ) {
            value_dec = this.firsExp.interpret(tree, table);

            if ( value_dec instanceof Exception )
                return value_dec;

            value_iterable = this.secondExp.interpret(tree, table);

            if ( value_iterable instanceof Exception )
                return value_iterable;

            if ( this.secondExp.get_type() == type.STRING ) {
                let new_table: SymbolTable = new SymbolTable(table, `ForIn-${this.row}-${this.column}`);
                this.firsExp.interpret(tree, new_table);

                for ( let item_dec of this.secondExp.value ) {

                    console.log(item_dec);
                    if ( this.instructions != null ) {
                        for ( let item_instr of this.instructions ) {
                            let instruction = item_instr.interpret(tree, new_table);

                            if ( instruction instanceof  Exception ) {
                                tree.get_errors().push(instruction);
                                tree.update_console(instruction.toString());
                            }

                            if ( instruction instanceof Continue )
                                break;

                            if ( instruction instanceof Break )
                                return null;

                            if ( instruction instanceof Return )
                                return instruction;

                            item_dec = instruction;
                            value_dec = item_dec;
                        }
                    }
                }
            }
        }
    }
}