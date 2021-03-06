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
import { Cst_Node } from "../Abstract/Cst_Node.js";
var Break = /** @class */ (function (_super) {
    __extends(Break, _super);
    function Break(row, col) {
        return _super.call(this, row, col) || this;
    }
    Break.prototype.interpret = function (tree, table) {
        return this;
    };
    Break.prototype.get_node = function () {
        return new Cst_Node("Break");
    };
    Break.prototype.compile = function (table, generator) {
        if (table.break_label == '') {
            generator.addError("Break transfer statement is not into a cycle", Number(this.row), Number(this.column));
            return;
        }
        generator.addGoTo(table.break_label);
    };
    return Break;
}(Instruction));
export { Break };
