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
    Primitive.prototype.get_type = function () {
        return this.type;
    };
    Primitive.prototype.toString = function () {
        return this.value;
    };
    return Primitive;
}(Instruction));
export { Primitive };
