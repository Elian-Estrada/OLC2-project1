import { Values_array } from "../Expression/Values_array.js";
import { Declaration_array } from "../Instructions/Declaration_array.js";
import Exception from "./Exception.js";
import { type } from './Type.js';
export var variables = [];
var SymbolTable = /** @class */ (function () {
    function SymbolTable(prev, name) {
        if (name === void 0) { name = "Global"; }
        this.size = 0;
        this.name = name;
        this.prev = prev;
        this.table = new Map();
    }
    SymbolTable.prototype.set_table = function (symbol) {
        if (this.table.has(symbol.id)) {
            return new Exception("Semantic", "The variable ".concat(symbol.id, " already definited"), symbol.row, symbol.column);
        }
        symbol.environment = this.name;
        this.table.set(symbol.id, symbol);
        this.size += 1;
        return undefined;
    };
    SymbolTable.prototype.get_table = function (id) {
        var current_table = this;
        while (current_table != undefined) {
            if (current_table.table.has(id)) {
                return current_table.table.get(id);
            }
            current_table = current_table.prev;
        }
        return undefined;
    };
    SymbolTable.prototype.update_table = function (symbol) {
        var _a;
        var current_table = this;
        while (current_table !== undefined) {
            if (current_table.table.has(symbol.id)) {
                var current_symbol = current_table.table.get(symbol.id);
                console.log(symbol);
                console.log(current_symbol);
                if (symbol.value === "null") {
                    switch (current_symbol.type) {
                        case type.STRUCT:
                            //symbol.environment = current_symbol.environment;
                            console.log(current_symbol);
                            console.log(symbol);
                            current_symbol.value = { id: current_symbol.value.id, value: "null" };
                            return undefined;
                        case type.STRING:
                        case type.CHAR:
                            current_symbol.value = symbol.value;
                            return undefined;
                        default:
                            return new Exception("Semantic", "The type: ".concat(type.NULL, " cannot assignment to variable of type: ").concat(current_symbol.type), symbol.row, symbol.column);
                    }
                }
                if (current_symbol.type === symbol.type && current_symbol.type !== type.STRUCT) {
                    if (current_symbol.value instanceof Declaration_array) {
                        if (symbol.value instanceof Values_array) {
                            if (current_symbol.value.get_subtype() === symbol.value.get_subtype()) {
                                current_symbol.value.set_value(symbol.value.get_value());
                                return undefined;
                            }
                            else {
                                return new Exception("Semantic", "Cannot assign value of type: ".concat(symbol.value.get_subtype(), " in a variable of type: ").concat(current_symbol.value.get_subtype()), symbol.row, symbol.column);
                            }
                        }
                    }
                    current_symbol.value = symbol.value;
                    return undefined;
                }
                else if (current_symbol.type === symbol.type && current_symbol.value.id === symbol.value.id) {
                    current_symbol.value = symbol.value;
                    return undefined;
                }
                else if (symbol.value.type === current_symbol.type) {
                    if (current_symbol.value.id === symbol.type) {
                        current_symbol.value = symbol.value;
                        return undefined;
                    }
                    else {
                        return new Exception("Semantic", "The vairiable: ".concat(current_symbol.id, " isn't at type: ").concat(symbol.type), symbol.row, symbol.column);
                    }
                }
                else if (current_symbol.value.id !== symbol.value.id) {
                    return new Exception("Semantic", "Cannot assign value of type: ".concat(symbol.value.id, " in a variable of type: ").concat(current_symbol.value.id), symbol.row, symbol.column);
                }
                else {
                    return new Exception("Semantic", "Cannot assign value of type: ".concat(symbol.type, " in a variable of type: ").concat((_a = current_table.table.get(symbol.id)) === null || _a === void 0 ? void 0 : _a.type), symbol.row, symbol.column);
                }
            }
            current_table = current_table.prev;
        }
        return new Exception("Semantic", "The id: ".concat(symbol.id, " doesn't exist in current context"), symbol.row, symbol.column);
    };
    SymbolTable.prototype.increment_size = function () {
        this.size += 1;
    };
    SymbolTable.prototype.get_name = function () {
        return this.name;
    };
    SymbolTable.prototype.get_size = function () {
        return this.size;
    };
    return SymbolTable;
}());
export default SymbolTable;
