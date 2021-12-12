var Tree = /** @class */ (function () {
    function Tree(instructions) {
        this.instructions = instructions;
        this.console = "";
        this.errors = [];
        this.functions = [];
        this.symbol_table = null;
        this.structs = [];
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
    Tree.prototype.get_function = function (name) {
        for (var _i = 0, _a = this.functions; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.get_name() == name)
                return item;
        }
        return null;
    };
    Tree.prototype.set_symbol_table = function (symbol_table) {
        this.symbol_table = symbol_table;
    };
    Tree.prototype.get_symbol_table = function () {
        return this.symbol_table;
    };
    Tree.prototype.add_function = function (name) {
        this.functions.push(name);
    };
    Tree.prototype.get_struct = function (id) {
        for (var _i = 0, _a = this.structs; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.get_id() === id) {
                return item;
            }
        }
        return null;
    };
    Tree.prototype.get_all_structs = function () {
        return this.structs;
    };
    Tree.prototype.add_struct = function (struct) {
        this.structs.push(struct);
    };
    Tree.prototype.get_all_functions = function () {
        return this.functions;
    };
    return Tree;
}());
export default Tree;
