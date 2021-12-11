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
import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
var Instance_struct = /** @class */ (function (_super) {
    __extends(Instance_struct, _super);
    function Instance_struct(id_struct, list_values, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.id_struct = id_struct;
        _this.list_values = list_values;
        _this.type = type.STRUCT;
        return _this;
    }
    Instance_struct.prototype.interpret = function (tree, table) {
        var _this = this;
        var struct = tree.get_struct(this.id_struct);
        if (struct !== null) {
            if (struct.get_attributes().length !== this.list_values.length) {
                return new Exception("Semantic", "".concat(struct.get_attributes().length, " parameters were expected and ").concat(this.list_values.length, " came"), this.row, this.column);
            }
            this.list_values.forEach(function (item, i) {
                if (item instanceof Array) {
                    if ((struct === null || struct === void 0 ? void 0 : struct.get_attributes()[i].type) === type.ARRAY) {
                        var result = _this.get_values(item, tree, table, struct.get_attributes()[i].sub_type);
                        if (result instanceof Exception) {
                            return result;
                        }
                        struct.get_attributes()[i].value = result;
                    }
                }
            });
        }
        return new Exception("Semantic", "The strcut with name: ".concat(this.id_struct, " doesn't exist."), this.row, this.column);
    };
    Instance_struct.prototype.get_values = function (list_expression, tree, table, type_array) {
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
                    console.log(parseFloat(value));
                    return parseFloat(value);
                case type.BOOL:
                    return JSON.parse(value);
            }
        }
        return expression;
    };
    Instance_struct.prototype.get_type = function () {
        return this.type;
    };
    return Instance_struct;
}(Instruction));
export { Instance_struct };
