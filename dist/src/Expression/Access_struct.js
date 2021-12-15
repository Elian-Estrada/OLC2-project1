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
var Access_struct = /** @class */ (function (_super) {
    __extends(Access_struct, _super);
    function Access_struct(list_ids, expression, positions, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.list_ids = list_ids;
        _this.expression = expression;
        _this.positions = positions;
        _this.type = type.NULL;
        _this.value = null;
        return _this;
    }
    Access_struct.prototype.interpret = function (tree, table) {
        var struct = table.get_table(this.list_ids[0]);
        if (struct === undefined) {
            return new Exception("Semantic", "The variable: ".concat(this.list_ids[0], " doesn't in the current context"), this.row, this.column);
        }
        if (struct.type !== type.STRUCT) {
            return new Exception("Semantic", "The variable: ".concat(struct.id, " isn't struct"), struct.row, struct.column);
        }
        var exp = null;
        if (this.expression !== null) {
            exp = this.expression.interpret(tree, table);
            if (exp instanceof Exception) {
                return exp;
            }
        }
        var value = struct.value;
        if (value === "null") {
            this.type = type.NULL;
            this.value = "null";
            return this.value;
        }
        var result = this.for_attributes(this.list_ids.slice(1), value.get_attributes(), exp, tree, table);
        if (result instanceof Exception) {
            return result;
        }
        if (result === null) {
            return null;
        }
        this.value = result;
        switch (this.type) {
            case type.ARRAY:
                return this;
            case type.STRUCT:
                return this;
            default:
                return this.value;
        }
    };
    Access_struct.prototype.for_attributes = function (ids, attributes, exp, tree, table) {
        if (ids.length !== 0) {
            for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
                var item = attributes_1[_i];
                if (ids[0] === item.id) {
                    if (item.type === type.STRUCT
                        && ids.length !== 0
                        && item.value !== "null") {
                        if (ids.length === 1 && exp === null) {
                            this.type = type.STRUCT;
                            return item;
                        }
                        else if (ids.length > 1) {
                            return this.for_attributes(ids.slice(1), item.value.get_attributes(), exp, tree, table);
                        }
                    }
                    if (this.positions !== null && item.type === type.ARRAY) {
                        var result = this.get_values(this.positions, item.value, exp, item.sub_type, tree, table);
                        if (result instanceof Exception) {
                            return result;
                        }
                        if (result === null) {
                            return result;
                        }
                        if (result instanceof Array) {
                            this.type = item.type;
                        }
                        else {
                            this.type = item.sub_type;
                        }
                        return result;
                    }
                    else if (item.type !== type.ARRAY && this.positions !== null) {
                        return new Exception("Semantic", "The attribute: ".concat(item.id, " isn't ").concat(type.ARRAY), item.row, item.column);
                    }
                    if (exp !== null && this.expression.get_type() === item.type) {
                        if (this.expression.get_type() === item.type && !(this.expression instanceof Access_struct)) {
                            item.value = exp;
                            return null;
                        }
                        if (this.expression instanceof Access_struct) {
                            console.log(item.value);
                            item.value = exp.get_value().value;
                            console.log(item);
                            return null;
                        }
                        return new Exception("Semantic", "The type: ".concat(this.expression.get_type(), " cannot assignment at attribute of type: ").concat(item.type), this.expression.row, this.expression.column);
                    }
                    this.type = item.type;
                    if (item.type === type.STRUCT) {
                        return item;
                    }
                    return item.value;
                }
            }
            return new Exception("Semantic", "The attribute: ".concat(ids[0], " doesn't exist"), this.row, this.column);
        }
    };
    Access_struct.prototype.get_values = function (positions, array, value, type_array, tree, table) {
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
    Access_struct.prototype.get_type = function () {
        return this.type;
    };
    Access_struct.prototype.get_value = function () {
        return this.value;
    };
    Access_struct.prototype.compile = function (table, generator) {
    };
    Access_struct.prototype.get_node = function () {
        var node = new Cst_Node("Access_Struct");
        node.add_child(this.list_ids[0]);
        var attributes = new Cst_Node("Attributes");
        var attribute;
        for (var _i = 0, _a = this.list_ids.slice(1); _i < _a.length; _i++) {
            var item = _a[_i];
            attributes.add_child(".");
            attribute = new Cst_Node("Attribute");
            attribute.add_child(item);
            attributes.add_childs_node(attribute);
        }
        node.add_childs_node(attributes);
        if (this.positions !== null) {
            var positions = new Cst_Node("Positions");
            var position = void 0;
            for (var _b = 0, _c = this.positions; _b < _c.length; _b++) {
                var item = _c[_b];
                position = new Cst_Node("Position");
                position.add_child("[");
                position.add_childs_node(item.get_node());
                position.add_child("]");
                positions.add_childs_node(position);
            }
            node.add_childs_node(positions);
        }
        if (this.expression != null) {
            node.add_child("=");
            node.add_childs_node(this.expression.get_node());
        }
        return node;
    };
    return Access_struct;
}(Instruction));
export { Access_struct };
