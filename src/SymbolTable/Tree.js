"use strict";
exports.__esModule = true;
var Tree = /** @class */ (function () {
    function Tree(instructions) {
        this.instructions = instructions;
        this.console = "";
        this.errors = [];
    }
    Tree.prototype.set_instructions = function (instructions) {
        this.instructions = instructions;
    };
    Tree.prototype.get_instructions = function () {
        return this.instructions;
    };
    Tree.prototype.get_errors = function () {
        return this.errors;
    };
    Tree.prototype.get_console = function () {
        return this.console;
    };
    Tree.prototype.update_console = function (input, flag) {
        if (flag === void 0) { flag = true; }
        flag ? this.console += "".concat(input, "\n") : this.console += "".concat(input);
    };
    Tree.prototype.set_global_table = function (table) {
        this.global_table = table;
    };
    Tree.prototype.get_global_table = function () {
        return this.global_table;
    };
    return Tree;
}());
exports["default"] = Tree;
