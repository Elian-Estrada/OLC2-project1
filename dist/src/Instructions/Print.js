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
import { Call } from "./Call.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Values_array } from "../Expression/Values_array.js";
var Print = /** @class */ (function (_super) {
    __extends(Print, _super);
    function Print(expression, row, col, flag) {
        if (flag === void 0) { flag = true; }
        var _this = _super.call(this, row, col) || this;
        _this.expression = expression;
        _this.flag = flag;
        return _this;
    }
    Print.prototype.compile = function (table, generator, tree) {
        for (var _i = 0, _a = this.expression; _i < _a.length; _i++) {
            var item = _a[_i];
            var res = item.compile(table, generator, tree);
            var valueShow = res.value;
            if (res.get_type() === type.INT) {
                generator.add_print("d", "int", valueShow);
            }
            else if (res.get_type() === type.DOUBLE) {
                generator.add_print("f", "double", valueShow);
            }
            else if (res.get_type() === type.STRING || res.get_type() === type.CHAR) {
                this.typeString(valueShow, table, generator);
            }
            else if (res.get_type() === type.BOOL) {
                this.typeBoolean(res, generator);
            }
            generator.add_print("c", "char", 10);
        }
    };
    Print.prototype.typeString = function (value, table, generator) {
        generator.printString();
        var paramTemp1 = generator.addTemp();
        // generator.addAssignment(paramTemp1, "H");
        var paramTemp2 = generator.addTemp();
        generator.addExpression(paramTemp2, 'P', table.get_size(), '+'); // T5 = P + 1;
        generator.addExpression(paramTemp2, paramTemp2, '1', '+');
        generator.setStack(paramTemp2, value);
        generator.newEnv(table.get_size());
        generator.callFunc('printString'); // Mandar a llamar la funcion print
        var temp = generator.addTemp();
        generator.getStack(temp, 'P');
        generator.setEnv(table.get_size());
    };
    Print.prototype.typeBoolean = function (value, generator) {
        var exit_label = generator.newLabel();
        generator.setLabel(value.true_label);
        generator.printTrue();
        generator.addGoTo(exit_label);
        generator.setLabel(value.false_label);
        generator.printFalse();
        generator.addGoTo(exit_label);
        generator.setLabel(exit_label);
    };
    Print.prototype.interpret = function (tree, table) {
        for (var _i = 0, _a = this.expression; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item instanceof Array) {
                //@ts-ignore
                item = new Values_array(item, this.row, this.column);
            }
            if ( /*this.expression*/item instanceof Call) {
                // console.log(this.expression)
                // @ts-ignore
                // console.log(this.expression.type)
                // @ts-ignore
                if ( /*this.expression.type*/item.type === type.VOID) {
                    return new Exception("Semantic", "Error 'void' type not allowed here", this.row, this.column, table.get_name());
                }
            }
            var value = /*this.expression*/ item.interpret(tree, table);
            if (value instanceof Exception)
                return value;
            /*if ( value === null )
                return new Exception("Semantic", "Error 'void' type not allowed here", this.row, this.column);*/
            if ( /*this.expression*/item.get_type() == type.ARRAY) {
                value = JSON.stringify(value.get_value());
            }
            else if (value instanceof Array) {
                value = JSON.stringify(value);
            }
            else if ( /*this.expression*/item.get_type() === type.STRUCT && value !== "null") {
                if ( /*this.expression.get_value().value*/ /*this.expression*/item.get_value() === "null") {
                    //value = `${/*this.expression.get_value().struct*/}(null)`;
                    value = "null";
                }
                else {
                    value = this.print_struct(/*this.expression*/ item.get_value());
                }
            }
            else if (value.type === type.STRUCT) {
                value = this.print_struct(value);
            }
            else if ( /*this.expression*/item.get_type() == type.NULL) {
                return new Exception("Semantic", "Null Pointer Exception", this.row, this.column, table.get_name());
            }
            tree.update_console("".concat(value), false);
        }
        tree.update_console("", this.flag);
    };
    Print.prototype.print_struct = function (struct) {
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
    Print.prototype.get_node = function () {
        var node;
        if (this.flag) {
            node = new Cst_Node("Println");
            node.add_child("println");
        }
        else {
            node = new Cst_Node("Print");
            node.add_child("print");
        }
        node.add_child("(");
        for (var _i = 0, _a = this.expression; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item instanceof Array) {
                //@ts-ignore
                item = new Values_array(item, this.row, this.column);
            }
            node.add_childs_node(/*this.expression*/ item.get_node());
        }
        node.add_child(")");
        return node;
    };
    return Print;
}(Instruction));
export { Print };
