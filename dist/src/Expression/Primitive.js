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
import { type } from "../SymbolTable/Type.js";
import { Value } from "../Abstract/Value.js";
var Primitive = /** @class */ (function (_super) {
    __extends(Primitive, _super);
    function Primitive(value, type, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.type = type;
        _this.value = value;
        return _this;
    }
    Primitive.prototype.interpret = function (tree, table) {
        return this.value;
    };
    Primitive.prototype.get_value = function () {
        return this.value;
    };
    Primitive.prototype.get_type = function () {
        return this.type;
    };
    Primitive.prototype.get_node = function () {
        var node = new Cst_Node("Primitive");
        node.add_child(this.value);
        return node;
    };
    Primitive.prototype.toString = function () {
        return String(this.value);
    };
    Primitive.prototype.compile = function (table, generator) {
        if (this.type === type.INT || this.type === type.DOUBLE) {
            return new Value(this.value, this.type, false);
        }
        else if (this.type === type.STRING) {
            var ret_temp = generator.addTemp();
            generator.addExpression(ret_temp, 'H', '', '');
            for (var _i = 0, _a = String(this.value); _i < _a.length; _i++) {
                var char = _a[_i];
                generator.setHeap('H', char.charCodeAt(0));
                generator.nextHeap();
            }
            generator.setHeap('H', -1);
            generator.nextHeap();
            return new Value(ret_temp, type.STRING, true);
        }
        else {
            return new Value(this.value, this.type, false);
        }
    };
    return Primitive;
}(Instruction));
export { Primitive };
