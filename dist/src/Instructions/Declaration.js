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
import { Access_struct } from "../Expression/Access_struct.js";
import { Identifier } from "../Expression/Identifier.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import { type } from "../SymbolTable/Type.js";
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
                this.id.pop();
            }
            if (this.expression.get_type() === type.STRUCT && this.expression instanceof Access_struct) {
                if (value.get_value().struct !== this.id[1]) {
                    return new Exception("Semantic", "The type: ".concat(value.get_value().struct, " cannot be assignment to variable of type: ").concat(this.id[1]), this.expression.row, this.expression.column);
                }
                value = value.get_value().value;
                this.id.pop();
            }
            if (type.STRUCT === this.expression.get_type() &&
                !(this.expression instanceof Identifier || this.expression instanceof Access_struct)) {
                var struct = this.id[1];
                if (struct !== this.expression.get_id()) {
                    return new Exception("Semantic", "The type: ".concat(this.expression.get_id(), " cannot be assignment to variable of type: ").concat(struct), this.expression.row, this.expression.column);
                }
                this.id.pop();
            }
            if (this.expression.get_type() !== this.type) {
                return new Exception("Semantic", "The type: ".concat(this.expression.get_type(), " cannot be assignment to variable of type: ").concat(this.type), this.expression.row, this.expression.column);
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
        for (var _i = 0, _a = this.id; _i < _a.length; _i++) {
            var item = _a[_i];
            symbol = new Symbol(item, this.type, this.row, this.column, value);
            result = table.set_table(symbol);
            if (result instanceof Exception) {
                errors.push(result);
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
    return Declaration;
}(Instruction));
export { Declaration };
