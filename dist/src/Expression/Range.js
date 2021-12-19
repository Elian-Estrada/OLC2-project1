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
var Range = /** @class */ (function (_super) {
    __extends(Range, _super);
    function Range(id, start, end, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.id = id;
        _this.start = start;
        _this.end = end;
        _this.type = type.ARRAY;
        _this.sub_type = type.NULL;
        return _this;
    }
    Range.prototype.interpret = function (tree, table) {
        var id = this.id.interpret(tree, table);
        var value;
        if (id instanceof Exception) {
            return id;
        }
        if (this.id.get_type() === type.ARRAY) {
            value = id.get_value();
            this.sub_type = id.get_subtype();
        }
        else {
            return new Exception("Semantic", "This expressi\u00F3n only accepted type: ".concat(type.ARRAY), this.id.row, this.id.column);
        }
        if (this.start === "begin" && this.end === "end") {
            value = value.slice(0, value.length);
        }
        else if (this.start === "begin") {
            var end = this.end.interpret(tree, table);
            if (end instanceof Exception) {
                return end;
            }
            if (this.end.get_type() !== type.INT) {
                return new Exception("Semantic", "The index must be of type: ".concat(type.INT), this.end.row, this.end.column);
            }
            end = parseInt(end) + 1;
            if (end > value.length || end < 0) {
                return new Exception("Semantic", "The index: ".concat(end, " out of range"), this.end.row, this.end.column);
            }
            value = value.slice(0, end);
        }
        else if (this.end === "end") {
            var start = this.start.interpret(tree, table);
            if (start instanceof Exception) {
                return start;
            }
            if (this.start.get_type() !== type.INT) {
                return new Exception("Semantic", "The index must be of type: ".concat(type.INT), this.start.row, this.start.column);
            }
            start = parseInt(start);
            if (start < 0 || start > value.length) {
                return new Exception("Semantic", "The index ".concat(start, " out of range"), this.start.row, this.start.colum);
            }
            value = value.slice(start, value.length);
        }
        else {
            var start = this.start.interpret(tree, table);
            if (start instanceof Exception) {
                return start;
            }
            var end = this.end.interpret(tree, table);
            if (end instanceof Exception) {
                return end;
            }
            if (this.start.get_type() !== type.INT) {
                return new Exception("Semantic", "The index must be of type: ".concat(type.INT), this.start.row, this.start.column);
            }
            if (this.end.get_type() !== type.INT) {
                return new Exception("Semantic", "The index must be of type: ".concat(type.INT), this.end.row, this.end.column);
            }
            start = parseInt(start);
            if (start < 0 || start > value.length) {
                return new Exception("Semantic", "The index ".concat(start, " out of range"), this.start.row, this.start.colum);
            }
            end = parseInt(end) + 1;
            if (end > value.length || end < 0) {
                return new Exception("Semantic", "The index: ".concat(end, " out of range"), this.end.row, this.end.column);
            }
            console.log(value);
            value = value.slice(start, end);
            console.log(value);
        }
        this.value = value;
        return this;
    };
    Range.prototype.get_value = function () {
        return this.value;
    };
    Range.prototype.get_type = function () {
        return this.type;
    };
    Range.prototype.get_subtype = function () {
        return this.sub_type;
    };
    Range.prototype.compile = function (table, generator) {
    };
    Range.prototype.get_node = function () {
        var node = new Cst_Node("Range");
        node.add_child(this.id.get_id());
        node.add_child("[");
        if (this.start === "begin") {
            node.add_child("begin");
        }
        else {
            node.add_childs_node(this.start.get_node());
        }
        node.add_child(":");
        if (this.end === "end") {
            node.add_child("end");
        }
        else {
            node.add_childs_node(this.end.get_node());
        }
        node.add_child("]");
        return node;
    };
    return Range;
}(Instruction));
export { Range };
