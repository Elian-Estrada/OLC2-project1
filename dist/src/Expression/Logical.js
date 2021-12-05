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
import { Instruction } from "../Abstract/Instruction";
import Exception from "../SymbolTable/Exception";
import { Logical_operator, type } from "../SymbolTable/Type";
var Logical = /** @class */ (function (_super) {
    __extends(Logical, _super);
    function Logical(exp1, exp2, operator, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        _this.operator = operator;
        _this.type = type.BOOL;
        _this.value = "";
        return _this;
    }
    Logical.prototype.interpret = function (tree, table) {
        var left = this.exp1.interpret(tree, table);
        if (left instanceof Exception) {
            return left;
        }
        if (this.exp2 != null) {
            var right = this.exp2.interpret(tree, table);
            if (right instanceof Exception) {
                return right;
            }
            if (this.exp1.get_type() === type.BOOL && this.exp2.get_type() === type.BOOL) {
                switch (this.operator) {
                    case Logical_operator.AND:
                        this.value = String(Boolean(left) && Boolean(right)).toLowerCase();
                        return this.value;
                    case Logical_operator.OR:
                        this.value = String(Boolean(left) || Boolean(right)).toLowerCase();
                        return this.value;
                }
            }
            else {
                return new Exception("Semantic", "This operators only work whit type boolean", this.row, this.column);
            }
        }
        else {
            if (this.exp1.get_type() == type.BOOL) {
                this.value = String(!Boolean(left)).toLowerCase();
                return this.value;
            }
            else {
                return new Exception("Semantic", "The type: ".concat(this.exp1.get_type(), " does not work whit operator: ").concat(this.operator), this.row, this.column);
            }
        }
    };
    Logical.prototype.get_type = function () {
        return this.type;
    };
    Logical.prototype.toString = function () {
        return this.value;
    };
    return Logical;
}(Instruction));
export { Logical };
