import Exception from "./Exception";
import Symbol from "./Symbol";
import {type} from './Type';

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