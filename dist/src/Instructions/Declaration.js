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
import { Access_struct } from "../Expression/Access_struct.js";
import { Identifier } from "../Expression/Identifier.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import { type } from "../SymbolTable/Type.js";
import { Primitive } from "../Expression/Primitive.js";
var Declaration = /** @class */ (function (_super) {
    __extends(Declaration, _super);
    function Declaration(id, type, row, column, expression) {
        if (expression === void 0) { expression = null; }
        var _this = _super.call(this, row, column) || this;
        _this.id = id;
        _this.type = type;
        _this.expression = expression;
        return _this;
    }
    Declaration.prototype.compile = function (table, generator) {
        if (this.expression == null) {
            var new_exp = void 0;
            switch (this.type) {
                case type.INT:
                    new_exp = new Primitive('0', type.INT, this.row, this.column);
                    this.expression = new_exp;
                    break;
                case type.DOUBLE:
                    new_exp = new Primitive('0.0', type.DOUBLE, this.row, this.column);
                    this.expression = new_exp;
                    break;
                case type.STRING:
                    new_exp = new Primitive('', type.STRING, this.row, this.column);
                    this.expression = new_exp;
                    break;
                case type.CHAR:
                    new_exp = new Primitive('', type.CHAR, this.row, this.column);
                    this.expression = new_exp;
                    break;
                case type.BOOL:
                    new_exp = new Primitive('true', type.STRING, this.row, this.column);
                    this.expression = new_exp;
                    break;
                default:
                    generator.addError("Iterator must be integer", Number(this.row), Number(this.column));
                    return;
            }
        }
        var value = this.expression.compile(table, generator);
        var new_var = table.get_table(this.get_id()[0]);
        var new_symbol = null;
        if (new_var === undefined) {
            var in_heap = (value.get_type() === type.STRING || value.get_type() === type.STRUCT || value.get_type() === type.ARRAY);
            new_symbol = new Symbol(this.id[0], value.get_type(), this.row, this.column, this.expression, undefined, in_heap, value.true_label, value.false_label);
            table.set_table(new_symbol);
        }
        // @ts-ignore
        var temp_pos = new_symbol.position;
        if (value.get_type() === type.BOOL) {
            this.valueBoolean(value, temp_pos, generator);
        }
        else
            generator.setStack(temp_pos, value.value);
    };
    Declaration.prototype.valueBoolean = function (value, temp_pos, generator) {
        var temp_label = generator.newLabel();
        generator.setLabel(value.true_label);
        generator.setStack(temp_pos, "1");
        generator.addGoTo(temp_label);
        generator.setLabel(value.false_label);
        generator.setStack(temp_pos, "0");
        generator.setLabel(temp_label);
    };
    Declaration.prototype.interpret = function (tree, table) {
        var symbol = null;
        var value = null;
        if (this.expression != null) {
            value = this.expression.interpret(tree, table);
            if (value instanceof Exception) {
                return value;
            }
            if (this.expression instanceof Identifier && this.expression.get_type() === type.STRUCT) {
                if (this.expression.get_value().get_id() !== this.id[1]) {
                    return new Exception("Semantic", "The type: ".concat(value.id, " cannot be assignment to variable of type: ").concat(this.id[1]), this.expression.row, this.expression.column);
                }
            }
            if (this.expression.get_type() === type.STRUCT && this.expression instanceof Access_struct) {
                if ( /*value.get_value().struct*/value.get_value() !== "null" && value.get_value().id !== this.id[1]) {
                    return new Exception("Semantic", "The type: ".concat(value.get_value().get_id(), " cannot be assignment to variable of type: ").concat(this.id[1]), this.expression.row, this.expression.column);
                }
                else if (value.get_value() === "null") {
                    value = { id: this.id[1], value: "null" };
                }
                else {
                    value = value.get_value();
                }
            }
            if (type.STRUCT === this.expression.get_type() &&
                !(this.expression instanceof Identifier || this.expression instanceof Access_struct)) {
                var struct = this.id[1];
                if (struct !== this.expression.get_id()) {
                    return new Exception("Semantic", "The type: ".concat(this.expression.get_id(), " cannot be assignment to variable of type: ").concat(struct), this.expression.row, this.expression.column);
                }
            }
            else if (this.expression.get_type() !== this.id[1]) {
                if (this.type === type.STRUCT && this.expression.get_type() === type.NULL) {
                    //No pasa nada :3
                    value = { id: this.id[1], value: "null" };
                }
                else {
                    if (this.expression.get_type() !== this.type) {
                        return new Exception("Semantic", "The type: ".concat(this.expression.get_type(), " cannot be assignment to variable of type: ").concat(this.type), this.expression.row, this.expression.column);
                    }
                }
            }
        }
        else {
            switch (this.type) {
                case type.INT:
                    value = "0";
                    break;
                case type.DOUBLE:
                    value = "0.0";
                    break;
                case type.STRING:
                    value = "null";
                    break;
                case type.CHAR:
                    value = '';
                    break;
                case type.BOOL:
                    value = "false";
                    break;
                case type.STRUCT:
                    value = "null";
                    break;
            }
        }
        var errors = [];
        var result;
        if (this.type !== type.STRUCT) {
            for (var _i = 0, _a = this.id; _i < _a.length; _i++) {
                var item = _a[_i];
                symbol = new Symbol(item, this.type, this.row, this.column, value);
                result = table.set_table(symbol);
                if (result instanceof Exception) {
                    errors.push(result);
                }
            }
        }
        else {
            symbol = new Symbol(this.id[0], this.type, this.row, this.column, value);
            result = table.set_table(symbol);
            if (result instanceof Exception) {
                return result;
            }
        }
        if (errors.length !== 0) {
            return errors;
        }
        return null;
    };
    Declaration.prototype.get_id = function () {
        return this.id;
    };
    Declaration.prototype.get_value = function () {
        return this.expression;
    };
    Declaration.prototype.get_type = function () {
        return this.type;
    };
    Declaration.prototype.get_node = function () {
        var node = new Cst_Node("Declaration");
        node.add_child(this.type);
        node.add_child(this.id);
        if (this.expression !== null) {
            node.add_child("=");
            node.add_childs_node(this.expression.get_node());
        }
        return node;
    };
    return Declaration;
}(Instruction));
export { Declaration };
