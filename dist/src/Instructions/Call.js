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
import { Declaration_array } from "./Declaration_array.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Access_struct } from "../Expression/Access_struct.js";
import { Value } from "../Abstract/Value.js";
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
        try {
            var ob_function = tree.get_function(this.name);
            var struct_1 = JSON.parse(JSON.stringify(tree.get_struct(this.name)));
            if (ob_function !== null && ob_function !== undefined) {
                var new_table = new SymbolTable(tree.get_global_table(), "Function-".concat(this.name));
                if (ob_function.get_params().length == this.params.length) {
                    var count = 0;
                    var table_res = null;
                    for (var _i = 0, _a = this.params; _i < _a.length; _i++) {
                        var expression = _a[_i];
                        if (expression instanceof Array) {
                            var param = ob_function.get_params()[count];
                            if (param.type !== type.ARRAY) {
                                return new Exception("Semantic", "The type: ".concat(type.ARRAY, " is different at parameter of type: ").concat(param.type), param.row, param.column);
                            }
                            var array = new Declaration_array(param.name, param.sub_type, null, expression, param.row, param.column);
                            var result = array.interpret(tree, new_table);
                            if (result instanceof Exception) {
                                return result;
                            }
                            count++;
                            continue;
                        }
                        var val_expression = expression.interpret(tree, table);
                        if (val_expression instanceof Exception)
                            return val_expression;
                        // for ( let param of ob_function.get_params() ) {
                        //     // console.log(expression.get_type())
                        //     if ( expression.get_type() !== param.type ) {
                        //         return new Exception("Semantic", "Different type of parameter data", expression.row, expression.column);
                        //     }
                        //     break;
                        // }
                        if (expression.get_type() === type.STRUCT && val_expression instanceof Access_struct) {
                            val_expression = val_expression.get_value();
                        }
                        // console.log(ob_function.get_params()[count].type)
                        if (ob_function.get_params()[count].type == expression.get_type()) {
                            if (expression.get_type() === type.ARRAY) {
                                var type_func = ob_function.get_params()[count].sub_type;
                                if (type_func !== val_expression.get_subtype())
                                    return new Exception("Semantic", "The type: ".concat(val_expression.get_type(), " is different to param type: ").concat(type_func), ob_function.get_params()[count].row, ob_function.get_params()[count].column);
                            }
                            var name_func = String(ob_function.get_params()[count].name);
                            var symbol = new Symbol(name_func, expression.get_type(), this.row, this.column, val_expression);
                            table_res = new_table.set_table(symbol);
                            if (table_res instanceof Exception)
                                return table_res;
                        }
                        else {
                            return new Exception("Semantic", "The type: ".concat(expression.get_type(), " is different to param type: ").concat(ob_function.get_params()[count].type), this.row, this.column);
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
            else if (struct_1 !== null) {
                struct_1 = __assign(__assign({}, struct_1), { get_attributes: function () {
                        return this.attributes;
                    }, get_type: function () {
                        return this.type;
                    }, get_id: function () {
                        return this.id;
                    } });
                if (struct_1.get_attributes().length !== this.params.length) {
                    return new Exception("Semantic", "".concat(struct_1.get_attributes().length, " parameters were expected and ").concat(this.params.length, " came"), this.row, this.column);
                }
                var result = this.params.forEach(function (item, i) {
                    if (item instanceof Array) {
                        if ((struct_1 === null || struct_1 === void 0 ? void 0 : struct_1.get_attributes()[i].type) === type.ARRAY) {
                            var result_1 = _this.get_values(item, tree, table, struct_1.get_attributes()[i].sub_type);
                            if (result_1 instanceof Exception) {
                                tree.get_errors().push(result_1);
                                tree.update_console(result_1.toString());
                            }
                            else {
                                struct_1.get_attributes()[i].value = result_1;
                            }
                        }
                        else {
                            var error = new Exception("Semantic", "The attribute: ".concat(struct_1 === null || struct_1 === void 0 ? void 0 : struct_1.get_attributes()[i].id, " isn't an array."), _this.row, _this.column);
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
                            if ((struct_1 === null || struct_1 === void 0 ? void 0 : struct_1.get_attributes()[i].type) === type.ARRAY) {
                                var result_2;
                                if (struct_1.get_attributes()[i].sub_type !== value.get_subtype()) {
                                    result_2 = new Exception("Semantic", "The type: ".concat(value.get_subtype(), " cannot assignet at array of type: ").concat(struct_1.get_attributes()[i].sub_type), item.row, item.column);
                                }
                                if (result_2 instanceof Exception) {
                                    tree.get_errors().push(result_2);
                                    tree.update_console(result_2.toString());
                                    return;
                                }
                                struct_1.get_attributes()[i].value = value.get_value();
                            }
                            else {
                                var error = new Exception("Semantic", "The attribute: ".concat(struct_1 === null || struct_1 === void 0 ? void 0 : struct_1.get_attributes()[i].id, " isn't an array."), _this.row, _this.column);
                                tree.get_errors().push(error);
                                tree.update_console(error.toString());
                            }
                        }
                        else {
                            if (struct_1.get_attributes()[i].type !== item.get_type() && struct_1.get_attributes()[i].type !== type.STRUCT) {
                                var error = new Exception("Semantic", "The type: ".concat(item.get_type(), " cannot assignet at attribute of type: ").concat(struct_1.get_attributes()[i].type), item.row, item.column);
                                tree.get_errors().push(error);
                                tree.update_console(error.toString());
                                return;
                            }
                            else if (struct_1.get_attributes()[i].type === type.STRUCT) {
                                if (item.type !== type.NULL && struct_1.get_attributes()[i].struct !== value.get_id()) {
                                    var error = new Exception("Semantic", "The type: ".concat(value.get_id(), " cannot assignet at attribute of type: ").concat(struct_1.get_attributes()[i].struct), item.row, item.column);
                                    tree.get_errors().push(error);
                                    tree.update_console(error.toString());
                                    return;
                                }
                            }
                            struct_1.get_attributes()[i].value = value;
                        }
                    }
                });
                this.type = type.STRUCT;
                this.value = struct_1;
                return this.value;
            }
            else {
                return new Exception("Semantic", "The function ".concat(this.name, " doesn't exists"), this.row, this.column);
            }
        }
        catch (error) {
            console.log(error);
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
    Call.prototype.compile = function (table, generator, tree) {
        var func = tree.get_symbol_table();
        if (func != null) {
            var param_values = [];
            var size = generator.keepTemps(table);
            var temp = generator.addTemp();
            generator.addExpression(temp, 'P', table.get_size() + 1, '+');
            var aux = 0;
            generator.newEnv(table.get_size());
            generator.callFunc(func.get_name());
            generator.getStack(temp, 'P');
            generator.setEnv(table.get_size());
            // @ts-ignore
            generator.recoverTemps(table, size);
            var ret_val = new Value(temp, func.type, true);
            if (ret_val.get_type() == type.BOOL) {
                var temp_label = generator.newLabel();
                var temp_label2 = generator.newLabel();
                generator.addIf(temp, 1, '==', temp_label);
                generator.addGoTo(temp_label2);
                ret_val.true_label = temp_label;
                ret_val.false_label = temp_label2;
            }
            return ret_val;
        }
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
