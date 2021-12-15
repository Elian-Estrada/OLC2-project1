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
        if (array.get_type_array() !== type.ARRAY) {
            return new Exception("Semantic", "The variable: ".concat(array.get_id(), " isn't an Array"), array.row, array.column);
        }
        var exp = null;
        if (this.expression !== null) {
            exp = this.expression.interpret(tree, table);
            if (exp instanceof Exception) {
                return exp;
            }
        }
        this.values = array.get_value();
        var result = this.get_values(this.positions, this.values, exp, array.get_subtype(), tree, table);
        if (result === null) {
            return null;
        }
        if (result instanceof Exception) {
            return result;
        }
        this.value = result;
        if (result instanceof Array) {
            this.type = type.ARRAY;
            return this;
        }
        else {
            this.type = array.get_subtype();
            return this.value;
        }
    };
    Access_array.prototype.get_values = function (positions, array, value, type_array, tree, table) {
        if (positions.length !== 0 && array !== undefined) {
            if (value === null) {
                var pos = positions[0].interpret(tree, table);
                if (pos instanceof Exception) {
                    return pos;
                }
                if (positions[0].get_type() !== type.INT) {
                    return new Exception("Semantic", "The index of array cannot be of type: ".concat(positions[0].get_type(), " expected type: ").concat(type.INT), positions[0].row, positions[0].column);
                }
                return this.get_values(positions.slice(1), array[positions[0]], value, type_array, tree, table);
            }
            if (positions.length === 1 && array[positions[0]] !== undefined) {
                if (this.expression.get_type() !== type_array) {
                    return new Exception("Semantic", "The type: ".concat(this.expression.get_type(), " cannot be assignated at array of type: ").concat(type_array), this.expression.row, this.expression.column);
                }
                switch (this.expression.get_type()) {
                    case type.INT:
                        value = parseInt(value);
                        break;
                    case type.DOUBLE:
                        value = parseFloat(value);
                        break;
                    case type.BOOL:
                        value = JSON.parse(value);
                        break;
                }
                array[positions[0]] = value;
                return null;
            }
            else if (positions.length !== 1) {
                return this.get_values(positions.slice(1), array[positions[0]], value, type_array, tree, table);
            }
            else {
                return new Exception("Semantic", "The index out of range", this.positions[this.positions.length - 1].row, this.positions[this.positions.length - 1].column);
            }
        }
        if (array === undefined) {
            return new Exception("Semantic", "The index out of range", this.positions[this.positions.length - 1].row, this.positions[this.positions.length - 1].column);
        }
        return array;
    };
    Access_array.prototype.get_value = function () {
        return this.value;
    };
    Access_array.prototype.get_type = function () {
        return this.type;
    };
    Access_array.prototype.get_node = function () {
        var node = new Cst_Node("Access Array");
        node.add_child(this.id);
        var positions = new Cst_Node("Expressions Array");
        for (var _i = 0, _a = this.positions; _i < _a.length; _i++) {
            var item = _a[_i];
            positions.add_child("[");
            positions.add_childs_node(item.get_node());
            positions.add_child("]");
        }
        node.add_childs_node(positions);
        if (this.expression !== null) {
            node.add_child("=");
            node.add_childs_node(this.expression.get_node());
        }
        return node;
    };
    Access_array.prototype.toString = function () {
        return String(this.value);
    };
    return Access_array;
}(Instruction));
export { Access_array };
