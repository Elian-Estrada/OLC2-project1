import { Values_array } from "../Expression/Values_array.js";
import { Declaration_array } from "../Instructions/Declaration_array.js";
import Exception from "./Exception.js";
import Symbol from "./Symbol.js";
import {type} from './Type.js';

export let variables = [];

export default class SymbolTable {

    private size: number;
    private name: String;
    private table: Map<String, Symbol>;
    private prev: SymbolTable|undefined;

    constructor(prev?: SymbolTable, name: String = "Global") {
        this.size = 0;
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
        this.size += 1;

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
                if (symbol.value === "null"){
                    switch(current_symbol.type){
                        case type.STRUCT:
                            //symbol.environment = current_symbol.environment;
                            current_symbol.value = symbol.value;
                            return undefined;
                        case type.STRING:
                        case type.CHAR:
                            current_symbol.value = symbol.value;
                            return undefined;
                        default:
                            return new Exception("Semantic", `The type: ${type.NULL} cannot assignment to variable of type: ${current_symbol.type}`, symbol.row, symbol.column);
                    }
                }
                if (current_symbol.type === symbol.type && current_symbol.type !== type.STRUCT){
                    if (current_symbol.value instanceof Declaration_array){
                        if (symbol.value instanceof Values_array){
                            if (current_symbol.value.get_subtype() === symbol.value.get_subtype()){
                                current_symbol.value.set_value(symbol.value.get_value());
                                return undefined;
                            }else {
                                return new Exception("Semantic", `Cannot assign value of type: ${symbol.value.get_subtype()} in a variable of type: ${current_symbol.value.get_subtype()}`, symbol.row, symbol.column);
                            }
                        }
                    }
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