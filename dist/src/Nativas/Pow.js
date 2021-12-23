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
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
import { Value } from "../Abstract/Value.js";
var Pow = /** @class */ (function (_super) {
    __extends(Pow, _super);
    function Pow(exp1, exp2, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.exp1 = exp1;
        _this.exp2 = exp2;
        return _this;
    }
    Pow.prototype.interpret = function (tree, table) {
        var base = this.exp1.interpret(tree, table);
        if (base instanceof Exception) {
            return base;
        }
        var pow = this.exp2.interpret(tree, table);
        if (pow instanceof Exception) {
            return pow;
        }
        if (this.exp1.get_type() !== type.INT && this.exp1.get_type() !== type.DOUBLE) {
            return new Exception("Semanitc", "The base: ".concat(base, " can only be of type int|double"), this.exp1.row, this.exp1.column, table.get_name());
        }
        if (this.exp2.get_type() !== type.INT) {
            return new Exception("Semantic", "The pow: ".concat(pow, " can only be of type int"), this.exp2.row, this.exp2.column, table.get_name());
        }
        this.type = this.exp1.get_type();
        return Math.pow(base, pow);
    };
    Pow.prototype.compile = function (table, generator, tree) {
        var left_value = this.exp1.compile(table, generator, tree);
        var right_value = this.exp2.compile(table, generator, tree);
        generator.powerTo();
        var param_temp = generator.addTemp();
        generator.addExpression(param_temp, 'P', table.get_size(), '+');
        // base
        generator.addExpression(param_temp, param_temp, '1', '+');
        generator.setStack(param_temp, left_value.value);
        // exponente
        generator.addExpression(param_temp, param_temp, '1', '+');
        generator.setStack(param_temp, right_value.value);
        generator.newEnv(table.get_size());
        generator.callFunc('powerTo');
        var temp = generator.addTemp();
        generator.getStack(temp, 'P');
        generator.setEnv(table.get_size());
        return new Value(temp, type.INT, true);
    };
    return Pow;
}(Function));
export { Pow };
