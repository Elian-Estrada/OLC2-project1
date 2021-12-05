import Exception from "./Exception.js";
import Symbol from "./Symbol.js";
import {type} from './Type.js';

export default class SymbolTable {

    private name: String;
    private table: Map<String, Symbol>;
    private prev: SymbolTable|undefined;

    constructor(prev?: SymbolTable, name: String = "Global") {
        this.name = name;
        this.prev = prev;
        this.table = new Map<String, Symbol>();
    }


}