import Exception from "./Exception.js";
var SymbolTable = /** @class */ (function () {
    function SymbolTable(prev, name) {
        if (name === void 0) { name = "Global"; }
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
                if (current_symbol.type === symbol.type) {
                    current_symbol.value = symbol.value;
                    return undefined;
                }
                else {
                    return new Exception("Semantic", "Cannot assign value of type: ".concat(symbol.type, " in a variable of type: ").concat((_a = current_table.table.get(symbol.id)) === null || _a === void 0 ? void 0 : _a.type), symbol.row, symbol.column);
                }
            }
            current_table = current_table.prev;
        }
        return new Exception("Semantic", "The id: ".concat(symbol.id, " doesn't exist in current context"), symbol.row, symbol.column);
    };
    SymbolTable.prototype.get_name = function () {
        return this.name;
    };
    return SymbolTable;
}());
export default SymbolTable;
