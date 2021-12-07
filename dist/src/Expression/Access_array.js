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
        _this.value = null;
        return _this;
    }
    Access_array.prototype.interpret = function (tree, table) {
        var array = this.id.interpret(tree, table);
        if (array instanceof Exception) {
            return array;
        }
        this.value = array.get_value();
        var positions = this.get_values(this.positions, tree, table);
        if (positions instanceof Exception) {
            return positions;
        }
        var value;
        var pos;
        var i = 0; //[1, 2];
        for (var _i = 0, _a = this.positions; _i < _a.length; _i++) { //[0][0]
            var item = _a[_i];
            i++; //1
            pos = item.interpret(tree, table);
            if (item.get_type() !== type.INT) {
                return new Exception("Semantic", "The index of array cannot be of type: ".concat(value.get_type(), " expected type: ").concat(type.INT), item.row, item.column);
            }
            if (i === 1) {
                console.log("Entra 1 vez");
                value = array.get_value()[pos];
            }
            else {
                console.log(pos);
                console.log(value);
                //value = value[pos];
                if (value instanceof Array) {
                    value = value[pos]; //1, undefined
                    console.log(value);
                }
                else {
                    value = undefined;
                }
                //value = undefined;
                console.log(value);
            }
            if (value === undefined) { //false
                console.log("entra?");
                return new Exception("Semantic", "The index: ".concat(item, " out of range"), item.row, item.column);
            }
        }
        console.log(value);
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
    return Access_array;
}(Instruction));
export { Access_array };
