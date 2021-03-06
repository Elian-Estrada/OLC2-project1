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
import { Access_struct } from "../Expression/Access_struct.js";
import { Identifier } from "../Expression/Identifier.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import { type } from "../SymbolTable/Type.js";
var Assignment = /** @class */ (function (_super) {
    __extends(Assignment, _super);
    function Assignment(id, expression, row, column) {
        var _this = _super.call(this, row, column) || this;
        _this.id = id;
        _this.expression = expression;
        return _this;
    }
    Assignment.prototype.interpret = function (tree, table) {
        var value = this.expression.interpret(tree, table);
        console.log(value);
        if (value instanceof Exception) {
            return value;
        }
        if (this.expression.get_type() === type.ARRAY) {
            //array implemented
            if (this.expression instanceof Access_struct) {
                //do anything
            }
        }
        if (this.expression instanceof Identifier && this.expression.get_type() === type.STRUCT) {
            value = value;
        }
        if (this.expression.get_type() === type.STRUCT && this.expression instanceof Access_struct) {
            //value = value.get_value().value;
            value = value.get_value();
        }
        var new_symbol = new Symbol(this.id, this.expression.get_type(), this.row, this.column, value);
        var result = table.update_table(new_symbol);
        if (result instanceof Exception) {
            return result;
        }
        return undefined;
    };
    Assignment.prototype.get_id = function () {
        return this.id;
    };
    Assignment.prototype.get_expression = function () {
        return this.expression;
    };
    Assignment.prototype.get_node = function () {
        var node = new Cst_Node("Assignment");
        node.add_child(this.id);
        node.add_child("=");
        node.add_childs_node(this.expression.get_node());
        return node;
    };
    Assignment.prototype.compile = function (table, generator, tree) {
        var _this = this;
        var val = this.expression.compile(table, generator, tree);
        var new_var = table.get_table(this.get_id());
        // @ts-ignore
        table.update_table(new_var);
        if (val.get_type() === type.BOOL) {
            // @ts-ignore
            this.valueBoolean(val, new_var.position, generator);
        }
        else {
            var index_1 = -1;
            // @ts-ignore
            var symbols_1 = JSON.parse(localStorage.getItem("symbol"));
            symbols_1.forEach(function (item, i) {
                if (_this.get_id() === item._id) {
                    index_1 = i;
                }
                if (index_1 !== -1) {
                    // @ts-ignore
                    symbols_1[index_1].size = val.size;
                }
            });
            localStorage.setItem('symbol', JSON.stringify(symbols_1));
            // @ts-ignore
            generator.setStack(new_var.position, val.value);
        }
    };
    Assignment.prototype.valueBoolean = function (value, temp_pos, generator) {
        var temp_label = generator.newLabel();
        generator.setLabel(value.true_label);
        generator.setStack(temp_pos, "1");
        generator.addGoTo(temp_label);
        generator.setLabel(value.false_label);
        generator.setStack(temp_pos, "0");
        generator.setLabel(temp_label);
    };
    return Assignment;
}(Instruction));
export { Assignment };
