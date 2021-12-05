"use strict";
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
exports.__esModule = true;
exports.Print = void 0;
var Instruction_1 = require("../Abstract/Instruction");
var Type_js_1 = require("../SymbolTable/Type.js");
var Exception_js_1 = require("../SymbolTable/Exception.js");
var Print = /** @class */ (function (_super) {
    __extends(Print, _super);
    function Print(expression, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.expression = expression;
        return _this;
    }
    Print.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        if (value instanceof Error)
            return value;
        if (this.expression.getType() == Type_js_1.type.ARRAY) {
            return new Exception_js_1["default"]("Semantic", "Don't print array", this.row, this.column);
        }
        else if (this.expression.getType() == Type_js_1.type.NULL) {
            return new Exception_js_1["default"]("Semantic", "Null Pointer Exception", this.row, this.column);
        }
        tree.update_console("> ".concat(value.toString()));
    };
    return Print;
}(Instruction_1.Instruction));
exports.Print = Print;
