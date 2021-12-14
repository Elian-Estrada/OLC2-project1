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
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import { type } from "../SymbolTable/Type.js";
var Declaration_array = /** @class */ (function (_super) {
    __extends(Declaration_array, _super);
    function Declaration_array(id, type_array, expression, list_extpression, row, column, flag) {
        if (flag === void 0) { flag = true; }
        var _this = _super.call(this, row, column) || this;
        _this.id = id;
        _this.type = type.ARRAY;
        _this.type_array = type_array;
        _this.expression = expression;
        _this.list_expression = list_extpression;
        _this.flag = flag;
        _this.value = [];
        return _this;
    }
    Declaration_array.prototype.interpret = function (tree, table) {
        var symbol = null;
        if (this.expression === null) {
            var value = this.get_values(this.list_expression, tree, table);
            if (value instanceof Exception) {
                return value;
            }
            this.value = value;
            symbol = new Symbol(this.id, type.ARRAY, this.row, this.column, this);
        }
        else {
            var array = this.expression.interpret(tree, table);
            if (array instanceof Exception) {
                return array;
            }
            if (!(array instanceof Declaration_array)) {
                return new Exception("Semantic", "Assignated only arrays", this.row, this.column);
            }
            if (this.type_array !== array.get_subtype()) {
                return new Exception("Semantic", "The type: ".concat(array.get_subtype(), " cannot assignated to array of type: ").concat(this.type_array), this.row, this.column);
            }
            var value = void 0;
            if (this.flag) {
                value = array;
            }
            else {
                value = JSON.parse(JSON.stringify(array));
                value = __assign(__assign({}, value), { get_subtype: function () {
                        return this.type_array;
                    }, get_value: function () {
                        return this.value;
                    }, set_value: function (value) {
                        this.value = value;
                    }, get_type_array: function () {
                        return this.type;
                    }, get_id: function () {
                        return this.id;
                    } });
            }
            symbol = new Symbol(this.id, this.type, this.row, this.column, value);
        }
        var result = table.set_table(symbol);
        if (result instanceof Exception) {
            return result;
        }
        return null;
    };
    Declaration_array.prototype.get_values = function (list_expression, tree, table) {
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
            if (this.type_array !== list_expression.get_type()) {
                return new Exception("Semantic", "The type: ".concat(list_expression.get_type(), " cannot assignet at array of type: ").concat(this.type_array), list_expression.row, list_expression.column);
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
    Declaration_array.prototype.get_value = function () {
        return this.value;
    };
    Declaration_array.prototype.set_value = function (value) {
        this.value = value;
    };
    Declaration_array.prototype.get_subtype = function () {
        return this.type_array;
    };
    Declaration_array.prototype.get_type_array = function () {
        return this.type;
    };
    Declaration_array.prototype.get_id = function () {
        return this.id;
    };
    return Declaration_array;
}(Instruction));
export { Declaration_array };
