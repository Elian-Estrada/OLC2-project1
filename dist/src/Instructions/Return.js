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
import Exception from "../SymbolTable/Exception.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { type } from "../SymbolTable/Type.js";
var Return = /** @class */ (function (_super) {
    __extends(Return, _super);
    function Return(expr, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.expr = expr;
        _this.type = null;
        _this.result = null;
        return _this;
    }
    Return.prototype.interpret = function (tree, table) {
        if (this.expr == null) {
            //return "void";
            this.type = type.VOID;
            this.result = null;
            return this;
        }
        var value = this.expr.interpret(tree, table);
        if (value instanceof Exception)
            return value;
        this.type = this.expr.get_type();
        this.result = value;
        return this;
    };
    Return.prototype.get_type = function () {
        return this.type;
    };
    Return.prototype.get_result = function () {
        return this.result;
    };
    Return.prototype.get_node = function () {
        var node = new Cst_Node("Return");
        if (this.expr !== null) {
            node.add_childs_node(this.expr.get_node());
        }
        return node;
    };
    Return.prototype.compile = function (table, generator, tree) {
        if (this.expr != null) {
            // console.log(this.expr)
            var value = this.expr.compile(table, generator, tree);
            if (value.type == type.BOOL) {
                var temp_label = generator.newLabel();
                generator.setLabel(value.true_label);
                generator.setStack('P', '1');
                generator.addGoTo(temp_label);
                generator.setLabel(value.false_label);
                generator.setStack('P', '0');
                generator.setLabel(temp_label);
                table.value_ret = value.value;
            }
            else {
                console.log(value);
                generator.setStack('P', value.value);
            }
            generator.addGoTo(table.return_label);
        }
        else
            return;
    };
    return Return;
}(Instruction));
export { Return };
