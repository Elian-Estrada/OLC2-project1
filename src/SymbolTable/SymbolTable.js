"use strict";
exports.__esModule = true;
var SymbolTable = /** @class */ (function () {
    function SymbolTable(prev, name) {
        if (name === void 0) { name = "Global"; }
        this.name = name;
        this.prev = prev;
        this.table = new Map();
    }
    return SymbolTable;
}());
exports["default"] = SymbolTable;
