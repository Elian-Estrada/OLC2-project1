import { Instruction } from "../Abstract/Instruction.js";
import { Struct } from "../Instructions/Struct.js";
import Exception from "./Exception.js";
import SymbolTable from "./SymbolTable.js";
import {Function} from "../Instructions/Function";

export default class Tree {

    private instructions: Array<Instruction>;
    private errors: Array<Exception>;
    private console: String;
    private global_table: SymbolTable|undefined;
    private functions: Array<Function>;
    private symbol_table: SymbolTable | null;
    private structs: Array<Struct>;
    private count: number;
    private dot: string;

    constructor(instructions: Array<Instruction>){
        this.instructions = instructions;
        this.console = "";
        this.errors = [];
        this.functions = [];
        this.symbol_table = null;
        this.structs = [];
        this.count = 0;
        this.dot = "";
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

    public get_function(name: string) {
        for ( let item of this.functions ) {
            if ( item.get_name() == name )
                return item;
        }
        return null;
    }

    public set_symbol_table(symbol_table: SymbolTable) {
        this.symbol_table = symbol_table;
    }

    public get_symbol_table() {
        return this.symbol_table;
    }

    public add_function (name: Function) {
        this.functions.push(name);
    }
    public get_struct(id: string){
        for (let item of this.structs){
            if (item.get_id() === id){
                return item;
            }
        }

        return null;
    }

    public get_all_structs(){
        return this.structs;
    }

    public add_struct(struct: Struct){
        this.structs.push(struct);
    }

    public get_all_functions(){
        return this.functions;
    }

    get_dot(root: any){
        this.dot = "";
        this.dot += `digraph {\nranksep="2";\nbgcolor = "#090B10";\nedge[color="#56cdff"];\nnode [style="filled" fillcolor = "#0F111A" fontcolor = "white" color = "#007acc"];\n`;
        this.dot += `n0[label="${root.get_value().replace("\"", "\\\"")}"];\n`;
        this.count = 1;
        this.travel_cst("n0", root);
        this.dot += "}";
        return this.dot;
    }

    travel_cst(id_root: any, node_root: any){
        for(let item of node_root.get_childs()){
            let name_child = `n${this.count}`;
            this.dot += `${name_child} [label = "${item.get_value().replace("\"", "\\\"")}"];\n`;
            this.dot += `${id_root} -> ${name_child};\n`;
            this.count++;
            this.travel_cst(name_child, item);
        }
    }
}