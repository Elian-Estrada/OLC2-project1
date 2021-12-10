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
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import { type } from "../SymbolTable/Type.js";
var Call = /** @class */ (function (_super) {
    __extends(Call, _super);
    function Call(name, params, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.name = name;
        _this.params = params;
        _this.type = null;
        _this.value = null;
        return _this;
    }
    Call.prototype.interpret = function (tree, table) {
        var ob_function = tree.get_function(this.name);
        if (ob_function == null)
            return new Exception("Semantic", "The function ".concat(this.name, " doesn't exists"), this.row, this.column);
        var new_table = new SymbolTable(tree.get_global_table(), "Function-".concat(this.name));
        if (ob_function.get_params().length == this.params.length) {
            var count = 0;
            for (var _i = 0, _a = this.params; _i < _a.length; _i++) {
                var expression = _a[_i];
                var val_expression = expression.interpret(tree, table);
                if (val_expression instanceof Error)
                    return val_expression;
                var expr_to_valuate = String(ob_function.get_params()[count].name).toLowerCase();
                var table_res = null;
                switch (expr_to_valuate) {
                    case "length##param1":
                    case "round##param1":
                    case "truncate##param1":
                    case "type_of##param1":
                        var symbol = new Symbol(expr_to_valuate, expression.get_type(), this.row, this.column, val_expression);
                        table_res = new_table.set_table(symbol);
                        if (table_res instanceof Exception)
                            return table_res;
                        break;
                }
                if (ob_function.get_params()[count].get_type() == expression.get_type()) {
                    if (expression.get_type() === type.ARRAY) {
                        var length_func = ob_function.get_params()[count].length;
                        var type_func = ob_function.get_params()[count].get_type();
                        if (length_func !== val_expression.length)
                            return new Exception("Semantic", "Size dimension expected: ".concat(length_func, ", received: ").concat(val_expression.length), this.row, this.column);
                        if (type_func !== val_expression.get_type())
                            return new Exception("Semantic", "The type: ".concat(val_expression.get_type().name, " is different to param type: ").concat(type_func), this.row, this.column);
                    }
                    var name_func = String(ob_function.get_params()[count].name).toLowerCase();
                    var symbol = new Symbol(name_func, expression.get_type(), this.row, this.column, val_expression);
                    table_res = new_table.set_table(symbol);
                    if (table_res instanceof Exception)
                        return table_res;
                }
                else {
                    return new Exception("Semantic", "The type: ".concat(expression.get_type().name, " is different to param type: ").concat(ob_function.get_params()[count].get_type()), this.row, this.column);
                }
                count += 1;
            }
        }
        var value = ob_function.interpret(tree, new_table);
        if (value instanceof Exception)
            return value;
        this.type = ob_function.get_type();
        this.value = value;
        return value;
    };
    Call.prototype.get_type = function () {
        return this.type;
    };
    return Call;
}(Instruction));
export { Call };
