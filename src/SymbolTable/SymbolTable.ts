import Exception from "./Exception.js";
import Symbol from "./Symbol.js";
import {type} from './Type.js';

export let variables = [];

export default class SymbolTable {

    private name: String;
    private table: Map<String, Symbol>;
    private prev: SymbolTable|undefined;

    constructor(prev?: SymbolTable, name: String = "Global") {
        this.name = name;
        this.prev = prev;
        this.table = new Map<String, Symbol>();
    }

    public set_table(symbol: Symbol){
        if (this.table.has(symbol.id)){
            return new Exception("Semantic", `The variable ${symbol.id} already definited`, symbol.row, symbol.column);
        }

        symbol.environment = this.name;
        this.table.set(symbol.id, symbol);

        return undefined;
    }

    public get_table(id: String){

        let current_table: SymbolTable|undefined = this;

        while(current_table != undefined){
            if (current_table.table.has(id)){
                return current_table.table.get(id);
            }

            current_table = current_table.prev;
        }

        return undefined;
    }

    update_table(symbol: Symbol){
        let current_table: SymbolTable | undefined = this;

        while(current_table !== undefined){
            if (current_table.table.has(symbol.id)){
                let current_symbol: any = current_table.table.get(symbol.id);
                if (current_symbol.type === symbol.type && current_symbol.type !== type.STRUCT){
                    current_symbol.value = symbol.value;
                    return undefined;
                } else if (current_symbol.type === symbol.type && current_symbol.value.id === symbol.value.id) {
                    current_symbol.value = symbol.value
                    return undefined;
                } else {
                    return new Exception("Semantic", `Cannot assign value of type: ${symbol.type} in a variable of type: ${current_table.table.get(symbol.id)?.type}`, symbol.row, symbol.column);
                }
            }
            
            current_table = current_table.prev;
        }

        return new Exception("Semantic", `The id: ${symbol.id} doesn't exist in current context`, symbol.row, symbol.column);
    }

    get_name(){
        return this.name;
    }

}