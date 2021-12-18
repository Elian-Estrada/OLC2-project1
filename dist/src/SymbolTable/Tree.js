var Tree = /** @class */ (function () {
    function Tree(instructions) {
        this.instructions = instructions;
        this.console = "";
        this.errors = [];
        this.functions = [];
        this.symbol_table = null;
        this.structs = [];
        this.count = 0;
        this.dot = "";
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
    Tree.prototype.get_dot = function (root) {
        this.dot = "";
        this.dot += "digraph {\nranksep=\"2\";\nbgcolor = \"#090B10\";\nedge[color=\"#56cdff\"];\nnode [style=\"filled\" fillcolor = \"#0F111A\" fontcolor = \"white\" color = \"#007acc\"];\n";
        this.dot += "n0[label=\"".concat(root.get_value().replace("\"", "\\\""), "\"];\n");
        this.count = 1;
        this.travel_cst("n0", root);
        this.dot += "}";
        return this.dot;
    };
    Tree.prototype.travel_cst = function (id_root, node_root) {
        for (var _i = 0, _a = node_root.get_childs(); _i < _a.length; _i++) {
            var item = _a[_i];
            var name_child = "n".concat(this.count);
            this.dot += "".concat(name_child, " [label = \"").concat(item.get_value().replace("\"", "\\\""), "\"];\n");
            this.dot += "".concat(id_root, " -> ").concat(name_child, ";\n");
            this.count++;
            this.travel_cst(name_child, item);
        }
    };
    return Tree;
}());
export default Tree;
