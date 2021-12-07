import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {Continue} from "./Continue.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";
import {type} from "../SymbolTable/Type.js";
import {Assignment} from "./Assignment.js";
import Symbol from "../SymbolTable/Symbol.js";
import {Identifier} from "../Expression/Identifier.js";
import {Declaration} from "./Declaration.js";

export class ForIn extends Instruction {

    private firsExp: Identifier;
    private secondExp: any;
    private instructions: Array<Instruction>;
    private counter: number;

    constructor(identifier: Identifier, secondExp: any,
                instructions: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.firsExp = identifier;
        this.secondExp = secondExp;
        this.instructions = instructions;
        this.counter = 0;
    }

    interpret(tree: Tree, table: SymbolTable): any {

        console.log("Start")
        let value_dec;
        let value_iterable;

        if ( this.firsExp != null ) {
            value_iterable = this.secondExp.interpret(tree, table);
            console.log(`Interpretando la expresion ${value_iterable}`)

            if ( value_iterable instanceof Exception ) {
                return value_iterable;
            }

            if ( this.secondExp.get_type() == type.STRING ) {
                console.log("Verificando tipos " + this.secondExp.get_type())
                let new_table: SymbolTable = new SymbolTable(table, `ForIn-${this.row}-${this.column}`);
                /* Hacer nueva declaration */
                // @ts-ignore
                let new_var = new Declaration([this.firsExp.toString()], type.STRING, this.row, this.column, null);
                console.log(new_var);
                console.log(new_table)

                let res_dec = new_var.interpret(tree, new_table);
                console.log(`Interpretando la declaracion ${res_dec}`)

                for ( let item_dec of value_iterable ) {
                    console.log(`Valor de la iteracion: ${item_dec}`)
                    let new_symbol = new Symbol(new_var.get_id()[0], type.STRING, this.row, this.column, item_dec);
                    console.log(new_symbol)

                    let res_new_table = new_table.update_table(new_symbol);
                    console.log(res_new_table);
                    if ( res_new_table instanceof  Exception )
                        return res_new_table;

                    if ( this.instructions != null ) {
                        for ( let item_instr of this.instructions ) {
                            let instruction = item_instr.interpret(tree, new_table);
                            if ( instruction instanceof  Exception ) {
                                tree.get_errors().push(instruction);
                                tree.update_console(instruction.toString());

                            }
                            if ( instruction instanceof Continue ) {
                                break;

                            }
                            if ( instruction instanceof Break ) {
                                return null;

                            }
                            if ( instruction instanceof Return ) {
                                return instruction;

                            }
                            item_dec = instruction;
                            value_dec = item_dec;
                        }
                    }
                }
            }
        }
    }
}