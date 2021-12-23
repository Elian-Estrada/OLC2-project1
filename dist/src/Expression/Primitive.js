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
    Primitive.prototype.set_type = function (type) {
        this.type = type;
    };
    Primitive.prototype.get_node = function () {
        var node = new Cst_Node("Primitive");
        node.add_child(this.value);
        return node;
    };
    Primitive.prototype.toString = function () {
        return String(this.value);
    };
    Primitive.prototype.compile = function (table, generator, tree) {
        if (this.type === type.INT || this.type === type.DOUBLE) {
            return new Value(this.value, this.type, false);
        }
        else if (this.type === type.STRING || this.type == type.CHAR) {
            var ret_temp = generator.addTemp();
            generator.addExpression(ret_temp, 'H', '', '');
            var counter = 0;
            for (var _i = 0, _a = String(this.value); _i < _a.length; _i++) {
                var char = _a[_i];
                generator.setHeap('H', char.charCodeAt(0));
                generator.nextHeap();
                counter += 1;
            }
            generator.setHeap('H', -1);
            generator.nextHeap();
            var ret_val = new Value(ret_temp, type.STRING, true);
            ret_val.size = counter;
            return ret_val;
        }
        else if (this.type === type.BOOL) {
            var res = new Value(this.value, this.type, false);
            var new_value = this.checkLabels(generator, res);
            if (new_value.value === 'true') {
                generator.addGoTo(new_value.true_label);
                generator.addGoTo(new_value.false_label);
            }
            else {
                generator.addGoTo(new_value.false_label);
                generator.addGoTo(new_value.true_label);
            }
            res.true_label = new_value.true_label;
            res.false_label = new_value.false_label;
            return res;
        }
        else {
            return new Value(this.value, this.type, false);
        }
    };
    Primitive.prototype.checkLabels = function (generator, value) {
        if (value.true_label === '') {
            value.true_label = generator.newLabel();
        }
        if (value.false_label === '') {
            value.false_label = generator.newLabel();
        }
        return value;
    };
    return Primitive;
}(Instruction));
export { Primitive };
