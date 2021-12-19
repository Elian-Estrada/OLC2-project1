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
import { Access_struct } from "../Expression/Access_struct.js";
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
var TypeOf = /** @class */ (function (_super) {
    __extends(TypeOf, _super);
    function TypeOf(expression, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.expression = expression;
        return _this;
    }
    TypeOf.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        if (value instanceof Exception) {
            return value;
        }
        console.log(value.type);
        console.log(this.expression);
        if (value.type === type.STRUCT && value.value !== "null") {
            if (value instanceof Access_struct) {
                value = value.get_value().id;
            }
            else {
                value = value.id;
            }
        }
        else {
            value = this.expression.get_type();
        }
        this.type = type.STRING;
        return value;
    };
    return TypeOf;
}(Function));
export { TypeOf };
