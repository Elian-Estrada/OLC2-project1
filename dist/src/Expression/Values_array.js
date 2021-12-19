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
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
var Values_array = /** @class */ (function (_super) {
    __extends(Values_array, _super);
    function Values_array(list_expression, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.type = type.ARRAY;
        _this.type_array = type.NULL;
        _this.list_expression = list_expression;
        _this.value = [];
        return _this;
    }
    Values_array.prototype.interpret = function (tree, table) {
        if (this.list_expression !== null) {
            var value = this.get_values(this.list_expression, tree, table);
            if (value instanceof Exception) {
                return value;
            }
            this.value = value;
            return this;
        }
    };
    Values_array.prototype.get_values = function (list_expression, tree, table) {
        var expression = [];
        if (list_expression instanceof Array) {
            var value = void 0;
            for (var _i = 0, list_expression_1 = list_expression; _i < list_expression_1.length; _i++) {
                var item = list_expression_1[_i];
                value = this.get_values(item, tree, table);
                if (value instanceof Exception) {
                    return value;
                }
                expression.push(value);
            }
        }
        else {
            var value = list_expression.interpret(tree, table);
            if (this.type_array === type.NULL) {
                this.type_array = list_expression.get_type();
            }
            if (this.type_array !== list_expression.get_type()) {
                return new Exception("Semantic", "The type: ".concat(list_expression.get_type(), " isn't like to: ").concat(this.type_array), list_expression.row, list_expression.column);
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
    Values_array.prototype.get_type = function () {
        return this.type;
    };
    Values_array.prototype.get_subtype = function () {
        return this.type_array;
    };
    Values_array.prototype.get_value = function () {
        return this.value;
    };
    Values_array.prototype.set_value = function (v) {
        this.value = v;
    };
    Values_array.prototype.compile = function (table, generator) {
    };
    Values_array.prototype.get_node = function () {
        return this.get_node_array(this.list_expression);
    };
    Values_array.prototype.get_node_array = function (list_nodes) {
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
    Values_array.prototype.toString = function () {
        return String(this.value);
    };
    return Values_array;
}(Instruction));
export { Values_array };
