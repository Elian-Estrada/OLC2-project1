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
import Exception from "../SymbolTable/Exception.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Value } from "../Abstract/Value.js";
var Identifier = /** @class */ (function (_super) {
    __extends(Identifier, _super);
    function Identifier(id, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.id = id;
        _this.value = "null";
        _this.type = type.NULL;
        return _this;
    }
    Identifier.prototype.interpret = function (tree, table) {
        var symbol = table.get_table(this.id);
        if (symbol == undefined) {
            return new Exception("Semantic", "The id: ".concat(this.id, " doesn't exist in current context"), this.row, this.column);
        }
        this.type = symbol.type;
        this.value = symbol.value;
        return this.value;
    };
    Identifier.prototype.get_type = function () {
        return this.type;
    };
    Identifier.prototype.get_id = function () {
        return this.id;
    };
    Identifier.prototype.get_value = function () {
        return this.value;
    };
    Identifier.prototype.get_node = function () {
        var node = new Cst_Node("Identifier");
        node.add_child(this.id);
        return node;
    };
    Identifier.prototype.toString = function () {
        return String(this.value);
    };
    Identifier.prototype.compile = function (table, generator) {
        generator.addComment("---- START COMPILER ACCESS----");
        var value = table.get_table(this.id);
        if (value === null) {
            // @ts-ignore
            generator.addError("Variable not exists ".concat(this.id), this.row, this.column);
            return;
        }
        var temp = generator.addTemp();
        // @ts-ignore
        var temp_pos = value.position;
        generator.getStack(temp, temp_pos);
        // @ts-ignore
        if (value.get_type() !== type.BOOL) {
            // @ts-ignore
            return new Value(temp, value.get_type(), true);
        }
        this.checkLabels(generator, value);
        // @ts-ignore
        generator.addIf(temp, '1', '==', value.label_true);
        // @ts-ignore
        generator.addGoTo(value.label_false);
        var val_return = new Value(null, type.BOOL, false);
        // @ts-ignore
        val_return.true_label = value.label_true;
        // @ts-ignore
        val_return.false_label = value.label_false;
        return val_return;
    };
    Identifier.prototype.checkLabels = function (generator, value) {
        value.label_true = generator.newLabel();
        value.label_false = generator.newLabel();
    };
    return Identifier;
}(Instruction));
export { Identifier };
