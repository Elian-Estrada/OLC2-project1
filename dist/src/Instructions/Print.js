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
var Print = /** @class */ (function (_super) {
    __extends(Print, _super);
    function Print(expression, row, col, flag) {
        if (flag === void 0) { flag = true; }
        var _this = _super.call(this, row, col) || this;
        _this.expression = expression;
        _this.flag = flag;
        return _this;
    }
    Print.prototype.compile = function (table, generator) {
        var res = this.expression.compile(table, generator);
        var valueShow = res.value;
        if (res.get_type() === type.INT || res.get_type() === type.DOUBLE) {
            if (Object.keys(generator.get_TempsRecover()).length > 0) {
                // @ts-ignore
                valueShow = generator.get_TempsRecover().temp;
            }
            generator.add_print("f", "double", valueShow);
        }
        else if (res.get_type() === type.STRING || res.get_type() === type.CHAR) {
            this.typeString(valueShow.value, table, generator);
        }
        else if (res.get_type() === type.BOOL) {
            this.typeBoolean(valueShow, generator);
        }
        generator.add_print("c", "char", 10);
    };
    Print.prototype.typeString = function (value, table, generator) {
        generator.printString();
        var paramTemp1 = generator.addTemp();
        generator.addAssignment(paramTemp1, "H");
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var item = value_1[_i];
            generator.setHeap('H', item.charCodeAt(0));
            generator.nextHeap();
        }
        generator.setHeap('H', -1);
        generator.nextHeap();
        var paramTemp2 = generator.addTemp();
        generator.addExpression(paramTemp2, 'P', table.get_size(), '+'); // T5 = P + 1;
        generator.addExpression(paramTemp2, paramTemp2, '1', '+');
        generator.setStack(paramTemp2, paramTemp1);
        generator.newEnv(table.get_size());
        generator.callFunc('printString'); // Mandar a llamar la funcion print
        var temp = generator.addTemp();
        generator.getStack(temp, 'P');
        generator.setEnv(table.get_size());
    };
    Print.prototype.typeBoolean = function (value, generator) {
        var exit_label = generator.newLabel();
        var true_label = generator.newLabel();
        var false_label = generator.newLabel();
        if (JSON.parse(String(value))) {
            generator.addGoTo(true_label);
        }
        else {
            generator.addGoTo(false_label);
        }
        generator.setLabel(true_label);
        generator.printTrue();
        generator.addGoTo(exit_label);
        generator.setLabel(false_label);
        generator.printFalse();
        generator.addGoTo(exit_label);
        generator.setLabel(exit_label);
    };
    Print.prototype.interpret = function (tree, table) {
        if (this.expression instanceof Call) {
            // console.log(this.expression)
            // @ts-ignore
            // console.log(this.expression.type)
            // @ts-ignore
            if (this.expression.type === type.VOID) {
                return new Exception("Semantic", "Error 'void' type not allowed here", this.row, this.column);
            }
        }
        var value = this.expression.interpret(tree, table);
        //console.log(value);
        if (value instanceof Exception)
            return value;
        /*if ( value === null )
            return new Exception("Semantic", "Error 'void' type not allowed here", this.row, this.column);*/
        if (this.expression.get_type() == type.ARRAY) {
            value = JSON.stringify(value.get_value());
        }
        else if (this.expression.get_type() === type.STRUCT && value !== "null") {
            if (this.expression.get_value().value === "null") {
                value = "".concat(this.expression.get_value().struct, "(null)");
            }
            else {
                value = this.print_struct(this.expression.get_value());
            }
        }
        else if (this.expression.get_type() == type.NULL) {
            return new Exception("Semantic", "Null Pointer Exception", this.row, this.column);
        }
        tree.update_console("".concat(value), this.flag);
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
                    console.log(item.value);
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
        node.add_childs_node(this.expression.get_node());
        node.add_child(")");
        return node;
    };
    return Print;
}(Instruction));
export { Print };
