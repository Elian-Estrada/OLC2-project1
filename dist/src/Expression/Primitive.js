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
import { Generator3D } from "../Generator/Generator3D.js";
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
    Primitive.prototype.compile = function (table) {
        var generator_aux = new Generator3D();
        var generator = generator_aux.get_instance();
        if (this.type === type.INT || this.type === type.DOUBLE)
            return this.value;
    };
    return Primitive;
}(Instruction));
export { Primitive };
