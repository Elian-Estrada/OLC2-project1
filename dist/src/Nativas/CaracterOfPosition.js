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
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import { type } from "../SymbolTable/Type.js";
var CaracterOfPosition = /** @class */ (function (_super) {
    __extends(CaracterOfPosition, _super);
    function CaracterOfPosition(id, n, type, name, params, instructions, row, col) {
        var _this = _super.call(this, type, name, params, instructions, row, col) || this;
        _this.id = id;
        _this.n = n;
        return _this;
    }
    CaracterOfPosition.prototype.interpret = function (tree, table) {
        var id_founded = this.id.interpret(tree, table);
        if (id_founded === null)
            return new Exception("Semantic", "Identifier not found in the current context", this.row, this.column);
        if (this.id.get_type() !== type.STRING)
            return new Exception("Semantic", "The type ".concat(id_founded.type, " not valid for Length"), this.row, this.column);
        var n = this.n.interpret(tree, table);
        if (n instanceof Exception) {
            return n;
        }
        if (this.n.get_type() !== type.INT) {
            return new Exception("Semantic", "The expression can be only of type: int", this.n.row, this.n.column);
        }
        if (n >= String(id_founded).length) {
            return new Exception("Semantic", "The position: ".concat(n, " out of range"), this.row, this.column);
        }
        this.type = type.CHAR;
        return id_founded.charAt(n);
    };
    return CaracterOfPosition;
}(Function));
export { CaracterOfPosition };
