import { Instruction } from "../Abstract/Instruction.js";
import Exception from "./Exception.js";
import SymbolTable from "./SymbolTable.js";

export default class Tree {

    private instructions: Array<Instruction>;
    private errors: Array<Exception>;
    private console: String;
    private global_table: SymbolTable|undefined;

    constructor(instructions: Array<Instruction>){
        this.instructions = instructions;
        this.console = "";
        this.errors = [];
    }

    public set_instructions(instructions: Array<Instruction>){
        this.instructions = instructions;
    }

    public get_instructions(): Array<Instruction>{
        return this.instructions;
    }

    public get_errors(): Array<Exception>{
        return this.errors;
    }

    public get_console(): String{
        return this.console;
    }

    public update_console(input: String, flag: Boolean = true){
        flag ? this.console += `${input}\n`: this.console += `${input}`;
    }

    public set_global_table(table: SymbolTable){
        this.global_table = table;
    }

    public get_global_table(): SymbolTable|undefined{
        return this.global_table;
    }

}