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
import SymbolTable from "../SymbolTable/SymbolTable.js";
import { Relational } from "../Expression/Relational.js";
import { Relational_operator } from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import { Break } from "./Break.js";
import { Continue } from "./Continue.js";
import { Return } from "./Return.js";
var Switch = /** @class */ (function (_super) {
    __extends(Switch, _super);
    function Switch(expr, list_cases, default_case, row, col) {
        var _this = _super.call(this, row, col) || this;
        _this.expr = expr;
        _this.list_cases = list_cases;
        _this.default_case = default_case;
        _this.row_case = 0;
        _this.col_case = 0;
        _this.flag = false;
        return _this;
    }
    Switch.prototype.interpret = function (tree, table) {
        if (this.list_cases != null) {
            for (var _i = 0, _a = this.list_cases; _i < _a.length; _i++) {
                var item = _a[_i];
                var rel = new Relational(this.expr, item.get_value(), Relational_operator.EQUAL, this.row, this.column);
                var res = rel.interpret(tree, table);
                if (res instanceof Exception)
                    return res;
                if (String(res) == "true") {
                    this.row_case = item.row;
                    this.col_case = item.column;
                    var res_interpret = this.execute_instructs(tree, table, item.get_instructions(), true);
                    if (res_interpret == null && !JSON.parse(String(this.flag))) {
                        return null;
                    }
                    else if (res_interpret instanceof Return) {
                        return res_interpret;
                    }
                }
                if (JSON.parse(String(this.flag))) {
                    this.flag = false;
                }
            }
            if (this.default_case != null) {
                return this.execute_instructs(tree, table, this.default_case);
            }
        }
        else if (this.default_case != null) {
            return this.execute_instructs(tree, table, this.default_case);
        }
    };
    Switch.prototype.execute_instructs = function (tree, table, instructs, flag) {
        if (flag === void 0) { flag = false; }
        var new_table;
        if (JSON.parse(String(flag))) {
            new_table = new SymbolTable(table, "Switch-Case-".concat(this.row_case, "-").concat(this.col_case));
        }
        else {
            new_table = new SymbolTable(table, "Switch-Case-".concat(this.row, "-").concat(this.column));
        }
        for (var _i = 0, instructs_1 = instructs; _i < instructs_1.length; _i++) {
            var item = instructs_1[_i];
            var instr = item.interpret(tree, new_table);
            console.log(instr);
            if (instr instanceof Exception) {
                tree.get_errors().push(instr);
                tree.update_console(instr.toString());
            }
            if (instr instanceof Break) {
                return null;
            }
            else if ((instr instanceof Return) || (instr instanceof Continue)) {
                return instr;
            }
        }
        if (JSON.parse(String(flag))) {
            this.flag = true;
        }
    };
    return Switch;
}(Instruction));
export { Switch };
