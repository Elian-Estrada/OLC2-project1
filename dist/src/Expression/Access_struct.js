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
var Access_struct = /** @class */ (function (_super) {
    __extends(Access_struct, _super);
    function Access_struct(list_ids, expression, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.list_ids = list_ids;
        _this.expression = expression;
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
        var result = this.for_attributes(this.list_ids.slice(1), value.get_attributes(), exp);
        if (result instanceof Exception) {
            return result;
        }
        if (result === null) {
            return null;
        }
        this.value = result;
        return this.value;
    };
    Access_struct.prototype.for_attributes = function (ids, attributes, exp) {
        if (ids.length !== 0) {
            for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
                var item = attributes_1[_i];
                if (ids[0] === item.id) {
                    if (item.type === type.STRUCT && ids.length !== 0 && item.value !== "null") {
                        return this.for_attributes(ids.slice(1), item.value.get_attributes(), exp);
                    }
                    if (exp !== null && this.expression.get_type() === item.type) {
                        if (this.expression.get_type() === item.type) {
                            item.value = exp;
                            return null;
                        }
                        return new Exception("Semantic", "The type: ".concat(this.expression.get_type(), " cannot assignment at attribute of type: ").concat(item.type), this.expression.row, this.expression.column);
                    }
                    this.type = item.type;
                    return item.value;
                }
            }
        }
    };
    Access_struct.prototype.get_type = function () {
        return this.type;
    };
    Access_struct.prototype.get_value = function () {
        return this.value;
    };
    return Access_struct;
}(Instruction));
export { Access_struct };
