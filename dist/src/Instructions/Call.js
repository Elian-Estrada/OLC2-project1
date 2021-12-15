var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Instruction } from "../Abstract/Instruction.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import { type } from "../SymbolTable/Type.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
var Call = /** @class */ (function (_super) {
    __extends(Call, _super);
    function Call(name, params, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.name = name;
        _this.params = params;
        _this.type = null;
        _this.value = null;
        return _this;
    }
    Call.prototype.interpret = function (tree, table) {
        var _this = this;
        var ob_function = tree.get_function(this.name);
        var struct = JSON.parse(JSON.stringify(tree.get_struct(this.name)));
        console.log(ob_function);
        if (ob_function !== null && ob_function !== undefined) {
            var new_table = new SymbolTable(tree.get_global_table(), "Function-".concat(this.name));
            if (ob_function.get_params().length == this.params.length) {
                var count = 0;
                for (var _i = 0, _a = this.params; _i < _a.length; _i++) {
                    var expression = _a[_i];
                    var val_expression = expression.interpret(tree, table);
                    if (val_expression instanceof Error)
                        return val_expression;
                    for (var _b = 0, _c = ob_function.get_params(); _b < _c.length; _b++) {
                        var param = _c[_b];
                        // console.log(expression.get_type())
                        if (expression.get_type() !== param.type) {
                            return new Exception("Semantic", "Different type of parameter data", expression.row, expression.column);
                        }
                        break;
                    }
                    var table_res = null;
                    // console.log(ob_function.get_params()[count].type)
                    if (ob_function.get_params()[count].type == expression.get_type()) {
                        if (expression.get_type() === type.ARRAY) {
                            var length_func = ob_function.get_params()[count].length;
                            var type_func = ob_function.get_params()[count].get_type();
                            if (length_func !== val_expression.length)
                                return new Exception("Semantic", "Size dimension expected: ".concat(length_func, ", received: ").concat(val_expression.length), this.row, this.column);
                            if (type_func !== val_expression.get_type())
                                return new Exception("Semantic", "The type: ".concat(val_expression.get_type().name, " is different to param type: ").concat(type_func), this.row, this.column);
                        }
                        var name_func = String(ob_function.get_params()[count].name).toLowerCase();
                        var symbol = new Symbol(name_func, expression.get_type(), this.row, this.column, val_expression);
                        table_res = new_table.set_table(symbol);
                        if (table_res instanceof Exception)
                            return table_res;
                    }
                    else {
                        return new Exception("Semantic", "The type: ".concat(expression.get_type().name, " is different to param type: ").concat(ob_function.get_params()[count].get_type()), this.row, this.column);
                    }
                    count += 1;
                }
            }
            var value = ob_function.interpret(tree, new_table);
            if (value instanceof Exception)
                return value;
            this.type = ob_function.get_type();
            this.value = value;
            return value;
        }
        else if (struct !== null) {
            struct = __assign(__assign({}, struct), { get_attributes: function () {
                    return this.attributes;
                }, get_type: function () {
                    return this.type;
                }, get_id: function () {
                    return this.id;
                } });
            if (struct.get_attributes().length !== this.params.length) {
                return new Exception("Semantic", "".concat(struct.get_attributes().length, " parameters were expected and ").concat(this.params.length, " came"), this.row, this.column);
            }
            var result = this.params.forEach(function (item, i) {
                if (item instanceof Array) {
                    if ((struct === null || struct === void 0 ? void 0 : struct.get_attributes()[i].type) === type.ARRAY) {
                        var result_1 = _this.get_values(item, tree, table, struct.get_attributes()[i].sub_type);
                        if (result_1 instanceof Exception) {
                            tree.get_errors().push(result_1);
                            tree.update_console(result_1.toString());
                        }
                        else {
                            struct.get_attributes()[i].value = result_1;
                        }
                    }
                    else {
                        var error = new Exception("Semantic", "The attribute: ".concat(struct === null || struct === void 0 ? void 0 : struct.get_attributes()[i].id, " isn't an array."), _this.row, _this.column);
                        tree.get_errors().push(error);
                        tree.update_console(error.toString());
                    }
                }
                else {
                    var value = item.interpret(tree, table);
                    if (value instanceof Exception) {
                        tree.get_errors().push(value);
                        tree.update_console(value.toString());
                        return;
                    }
                    if (item.get_type() === type.ARRAY) {
                        if ((struct === null || struct === void 0 ? void 0 : struct.get_attributes()[i].type) === type.ARRAY) {
                            var result_2;
                            if (struct.get_attributes()[i].sub_type !== value.get_subtype()) {
                                result_2 = new Exception("Semantic", "The type: ".concat(value.get_subtype(), " cannot assignet at array of type: ").concat(struct.get_attributes()[i].sub_type), item.row, item.column);
                            }
                            if (result_2 instanceof Exception) {
                                tree.get_errors().push(result_2);
                                tree.update_console(result_2.toString());
                                return;
                            }
                            struct.get_attributes()[i].value = value.get_value();
                        }
                        else {
                            var error = new Exception("Semantic", "The attribute: ".concat(struct === null || struct === void 0 ? void 0 : struct.get_attributes()[i].id, " isn't an array."), _this.row, _this.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                        }
                    }
                    else {
                        if (struct.get_attributes()[i].type !== item.get_type() && struct.get_attributes()[i].type !== type.STRUCT) {
                            var error = new Exception("Semantic", "The type: ".concat(item.get_type(), " cannot assignet at attribute of type: ").concat(struct.get_attributes()[i].type), item.row, item.column);
                            tree.get_errors().push(error);
                            tree.update_console(error.toString());
                            return;
                        }
                        else if (struct.get_attributes()[i].type === type.STRUCT) {
                            if (item.type !== type.NULL && struct.get_attributes()[i].struct !== value.get_id()) {
                                var error = new Exception("Semantic", "The type: ".concat(value.get_id(), " cannot assignet at attribute of type: ").concat(struct.get_attributes()[i].struct), item.row, item.column);
                                tree.get_errors().push(error);
                                tree.update_console(error.toString());
                                return;
                            }
                        }
                        struct.get_attributes()[i].value = value;
                    }
                }
            });
            this.type = type.STRUCT;
            this.value = struct;
            return this.value;
        }
        else {
            return new Exception("Semantic", "The function ".concat(this.name, " doesn't exists"), this.row, this.column);
        }
    };
    Call.prototype.get_values = function (list_expression, tree, table, type_array) {
        var expression = [];
        if (list_expression instanceof Array) {
            var value = void 0;
            for (var _i = 0, list_expression_1 = list_expression; _i < list_expression_1.length; _i++) {
                var item = list_expression_1[_i];
                value = this.get_values(item, tree, table, type_array);
                if (value instanceof Exception) {
                    return value;
                }
                expression.push(value);
            }
        }
        else {
            var value = list_expression.interpret(tree, table);
            if (type_array !== list_expression.get_type()) {
                return new Exception("Semantic", "The type: ".concat(list_expression.get_type(), " cannot assignet at array of type: ").concat(type_array), list_expression.row, list_expression.column);
            }
            switch (list_expression.get_type()) {
                case type.INT:
                    return parseInt(value);
                case type.DOUBLE:
                    return parseFloat(value);
                case type.BOOL:
                    return JSON.parse(value);
                default:
                    return value;
            }
        }
        return expression;
    };
    Call.prototype.get_type = function () {
        return this.type;
    };
    Call.prototype.get_id = function () {
        return this.name;
    };
    Call.prototype.compile = function (table, generator) {
    };
    Call.prototype.get_node = function () {
        var node = new Cst_Node("Call Function");
        node.add_child(this.name);
        node.add_child("(");
        var parameters = new Cst_Node("Parameters");
        for (var _i = 0, _a = this.params; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item instanceof Array) {
                parameters.add_childs_node(this.get_node_array(item));
            }
            else {
                parameters.add_childs_node(item.get_node());
            }
        }
        node.add_childs_node(parameters);
        node.add_child(")");
        return node;
    };
    Call.prototype.get_node_array = function (list_nodes) {
        var value;
        if (list_nodes instanceof Array) {
            value = new Cst_Node("Values Array");
            value.add_child("[");
            for (var _i = 0, list_nodes_1 = list_nodes; _i < list_nodes_1.length; _i++) {
                var item = list_nodes_1[_i];
                value.add_childs_node(this.get_node_array(item));
            }
            value.add_child("]");
        }
        else {
            return list_nodes.get_node();
        }
        return value;
    };
    return Call;
}(Instruction));
export { Call };
