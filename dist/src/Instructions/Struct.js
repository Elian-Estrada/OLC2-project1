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
import Exception from "../SymbolTable/Exception.js";
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
        tree.add_struct(this);
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
                case type.STRUCT:
                    var exist = tree.get_struct(item.struct);
                    if (exist === null) {
                        return new Exception("Semantic", "The Struct: ".concat(item.struct, " doesn't exist"), item.row, item.column);
                    }
                    item.value = "null";
                    break;
            }
        }
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
    Struct.prototype.get_node = function () {
        var node = new Cst_Node("Struct");
        node.add_child("struct");
        node.add_child(this.id);
        node.add_child("{");
        var attributes = new Cst_Node("Attributes");
        var attribute;
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var item = _a[_i];
            attribute = new Cst_Node("Attribute");
            switch (item.type) {
                case type.ARRAY:
                    attribute.add_child(item.sub_type);
                    attribute.add_child("[");
                    attribute.add_child("]");
                    attribute.add_child(item.id);
                    break;
                case type.STRUCT:
                    attribute.add_child(item.struct);
                    attribute.add_child(item.id);
                    break;
                default:
                    attribute.add_child(item.type);
                    attribute.add_child(item.id);
                    break;
            }
            attributes.add_childs_node(attribute);
        }
        node.add_childs_node(attributes);
        node.add_child("}");
        return node;
    };
    return Struct;
}(Instruction));
export { Struct };
