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
var Continue = /** @class */ (function (_super) {
    __extends(Continue, _super);
    function Continue(row, col) {
        return _super.call(this, row, col) || this;
    }
    Continue.prototype.interpret = function (tree, table) {
        return this;
    };
    Continue.prototype.compile = function (table, generator) {
    };
    Continue.prototype.get_node = function () {
        return new Cst_Node("Continue");
    };
    return Continue;
}(Instruction));
export { Continue };
