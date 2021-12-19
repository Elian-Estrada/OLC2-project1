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
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
var String = /** @class */ (function (_super) {
    __extends(String, _super);
    function String(expression, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.expression = expression;
        return _this;
    }
    String.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        console.log(value);
        if (value instanceof Exception) {
            return value;
        }
        if (this.expression.get_type() === type.STRUCT) {
            value = this.print_struct(this.expression);
        }
        else {
            if (this.expression.get_type() === type.ARRAY) {
                value = JSON.stringify(value.get_value()).toString();
            }
            value = JSON.stringify(value);
        }
        this.type = type.STRING;
        console.log(value);
        return value;
    };
    String.prototype.print_struct = function (struct) {
        if (struct.value === "null") {
            return "null";
        }
        else {
            if (struct.value !== undefined) {
                struct = struct.value;
            }
            var params = "".concat(struct.id, "(");
            for (var _i = 0, _a = struct.attributes; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.type === type.STRUCT) {
                    params += this.print_struct(item) + ",";
                }
                else if (item.type === type.ARRAY) {
                    params += JSON.stringify(item.value) + ",";
                }
                else {
                    params += item.value + ",";
                }
            }
            return params.slice(0, params.length - 1) + ")";
        }
    };
    String.prototype.get_node = function () {
        var node = new Cst_Node("String");
        node.add_child("string");
        node.add_child("(");
        node.add_childs_node(this.expression.get_node());
        node.add_child(")");
        return node;
    };
    return String;
}(Function));
export { String };
