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
var Access_array = /** @class */ (function (_super) {
    __extends(Access_array, _super);
    function Access_array(id, positions, expression, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.id = id;
        _this.positions = positions;
        _this.expression = expression;
        _this.values = [];
        _this.value = null;
        _this.type = type.NULL;
        return _this;
    }
    Access_array.prototype.interpret = function (tree, table) {
        var array = this.id.interpret(tree, table);
        if (array instanceof Exception) {
            return array;
        }
        this.values = array.get_value();
        var value;
        var pos;
        var i = 0;
        var result;
        for (var _i = 0, _a = this.positions; _i < _a.length; _i++) {
            var item = _a[_i];
            i++;
            pos = item.interpret(tree, table);
            if (item.get_type() !== type.INT) {
                return new Exception("Semantic", "The index of array cannot be of type: ".concat(value.get_type(), " expected type: ").concat(type.INT), item.row, item.column);
            }
            if (i === 1) {
                value = array.get_value()[pos];
            }
            else {
                if (value instanceof Array) {
                    if (this.expression !== null && i == this.positions.length) {
                        result = this.expression.interpret(tree, table);
                        if (result instanceof Exception) {
                            return result;
                        }
                        if (this.expression.get_type() !== array.get_subtype()) {
                            return new Exception("Semantic", "The type: ".concat(this.expression.get_type(), " cannot be assignated at array of type: ").concat(array.get_subtype()), this.expression.row, this.expression.column);
                        }
                        value[pos] = result;
                        console.log(value);
                        break;
                    }
                    value = value[pos];
                }
                else {
                    value = undefined;
                }
            }
            if (value === undefined) {
                return new Exception("Semantic", "The index: ".concat(item, " out of range"), item.row, item.column);
            }
        }
        this.type = array.get_subtype();
        this.value = value;
        return value;
    };
    Access_array.prototype.get_values = function (positions, tree, table) {
        var values = [];
        if (positions instanceof Array) {
            var value = void 0;
            for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
                var item = positions_1[_i];
                value = this.get_values(item, tree, table);
                if (value instanceof Exception) {
                    return value;
                }
                values.push(value);
            }
        }
        else {
            var value = positions.interpret(tree, table);
            if (positions.get_type() !== type.INT) {
                return new Exception("Semantic", "The index of array cannot be of type: ".concat(value.get_type(), " expected type: ").concat(type.INT), positions.row, positions.column);
            }
            return value;
        }
        return values;
    };
    Access_array.prototype.get_value = function () {
        return this.value;
    };
    Access_array.prototype.get_type = function () {
        return this.type;
    };
    return Access_array;
}(Instruction));
export { Access_array };
