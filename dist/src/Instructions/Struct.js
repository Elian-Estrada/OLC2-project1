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
import { type } from "../SymbolTable/Type.js";
var Struct = /** @class */ (function (_super) {
    __extends(Struct, _super);
    function Struct(id, attributes, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.id = id;
        _this.attributes = attributes;
        _this.type = type.STRUCT;
        return _this;
    }
    Struct.prototype.interpret = function (tree, table) {
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var item = _a[_i];
            switch (item.type) {
                case type.INT:
                    item.value = 0;
                    break;
                case type.DOUBLE:
                    item.value = 0.0;
                    break;
                case type.CHAR:
                    item.value = "null";
                    break;
                case type.BOOL:
                    item.value = false;
                    break;
                case type.STRING:
                    item.value = "null";
                    break;
            }
        }
        tree.add_struct(this);
        return null;
    };
    Struct.prototype.get_attributes = function () {
        return this.attributes;
    };
    Struct.prototype.get_type = function () {
        return this.type;
    };
    Struct.prototype.get_id = function () {
        return this.id;
    };
    return Struct;
}(Instruction));
export { Struct };
