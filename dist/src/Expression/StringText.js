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
import { String_operator, type } from "../SymbolTable/Type.js";
var StringText = /** @class */ (function (_super) {
    __extends(StringText, _super);
    function StringText(exp1, exp2, operator, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.operator = operator;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        _this.value = "";
        _this.type = null;
        return _this;
    }
    StringText.prototype.interpret = function (tree, table) {
        var left = this.exp1.interpret(tree, table);
        if (left instanceof Exception)
            return left;
        if (this.exp2 != null) {
            var right = this.exp2.interpret(tree, table);
            if (right instanceof Exception)
                return right;
            switch (this.operator) {
                case String_operator.CONCAT:
                    switch (this.exp1.get_type()) {
                        case type.INT:
                        case type.DOUBLE:
                        case type.BOOL:
                        case type.CHAR:
                        case type.NULL:
                            if (this.exp2.get_type() == type.STRING) {
                                this.type = type.STRING;
                                this.value = left.toString() + right.toString();
                            }
                            else
                                return new Exception("Semantic", "The type: ".concat(this.exp1.get_type(), " \n cannot be concatenated whit type: ").concat(this.exp2.get_type()), this.row, this.column);
                            break;
                    }
                    if (this.exp1.get_type() == type.STRING) {
                        switch (this.exp2.get_type()) {
                            case type.INT:
                            case type.DOUBLE:
                            case type.BOOL:
                            case type.CHAR:
                            case type.STRING:
                            case type.NULL:
                                this.type = type.STRING;
                                this.value = left.toString() + right.toString();
                                break;
                            default:
                                return new Exception("Semantic", "The type ".concat(this.exp2.get_type().toString(), " cannot be operated with type: STRING"), this.row, this.column);
                        }
                    }
                    return this.value;
            }
        }
    };
    StringText.prototype.operation = function (op1, op2, op) {
        switch (op) {
            case String_operator.CONCAT:
                return String(op1 + op2);
            default:
                return "";
        }
    };
    StringText.prototype.get_type = function () {
        return this.type;
    };
    StringText.prototype.toString = function () {
        return this.value;
    };
    return StringText;
}(Instruction));
export { StringText };
