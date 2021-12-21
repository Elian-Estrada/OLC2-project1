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
var count = 0;
export var clear_count = function () {
    count = 0;
    var div_t = document.getElementById("table0");
    //@ts-ignore
    div_t === null || div_t === void 0 ? void 0 : div_t.innerHTML = "";
};
var Graficar_ts = /** @class */ (function (_super) {
    __extends(Graficar_ts, _super);
    function Graficar_ts(type_fun, name, params, instructions, row, col) {
        return _super.call(this, type_fun, name, params, instructions, row, col) || this;
    }
    Graficar_ts.prototype.interpret = function (tree, table) {
        var _this = this;
        var id = document.getElementById("modal1");
        //@ts-ignore
        var instance = M.Modal.getInstance(id);
        var d_table = document.getElementById("table".concat(count));
        count++;
        var coun_variable = 0;
        var content = "";
        var current_table = table;
        while (current_table !== undefined) {
            current_table.get_table_total().forEach(function (item) {
                if (item.type === 'array') {
                    coun_variable++;
                    content += "<tr>\n                        <td> ".concat(coun_variable, " </td>\n                        <td> ").concat(item.id, " </td>\n                        <td> ").concat(item.type, " </td>\n                        <td> ").concat(item.value !== "null" ? item.value.type_array : "null", " </td>\n                        <td> ").concat(item.environment, " </td>\n                        <td> ").concat(item.value !== "null" ? JSON.stringify(item.value.value) : item.value, " </td>\n                        <td> ").concat(item.row, " </td>\n                        <td> ").concat(item.column, " </td>\n                    </tr>");
                }
                else if (item.type === 'struct') {
                    coun_variable++;
                    content += "<tr>\n                        <td> ".concat(coun_variable, " </td>\n                        <td> ").concat(item.id, " </td>\n                        <td> ").concat(item.type, " </td>\n                        <td> ").concat(item.value !== "null" ? item.value.id : "null", " </td>\n                        <td> ").concat(item.environment, " </td>\n                        <td> ").concat(_this.print_struct(item.value), " </td>\n                        <td> ").concat(item.row, " </td>\n                        <td> ").concat(item.column, " </td>\n                    </tr>");
                }
                else {
                    coun_variable++;
                    content += "<tr>\n                        <td> ".concat(coun_variable, " </td>\n                        <td> ").concat(item.id, " </td>\n                        <td> ").concat(item.type, " </td>\n                        <td>  </td>\n                        <td> ").concat(item.environment, " </td>\n                        <td> ").concat(item.value, " </td>\n                        <td> ").concat(item.row, " </td>\n                        <td> ").concat(item.column, " </td>\n                    </tr>");
                }
            });
            //@ts-ignore
            current_table = current_table.get_prev();
        }
        var text = "<h3 style=\"text-align: center\"> Tabla ".concat(count, " </h3>\n        <table class=\"striped responsive-table\">\n            <thead>\n                <tr>\n                    <th>No. </th>\n                    <th> Identifier </th>\n                    <th> Type </th>\n                    <th> Sub Type </th>\n                    <th> Environment </th>\n                    <th> Value </th>\n                    <th> Row </th>\n                    <th> Column </th>\n                </tr>\n            </thead>\n            <tbody>\n            ").concat(content, "\n            </tbody>\n        </table>\n        <div id=\"table").concat(count, "\"></div>");
        console.log(d_table);
        //@ts-ignore
        d_table === null || d_table === void 0 ? void 0 : d_table.innerHTML = text;
        instance.open();
    };
    Graficar_ts.prototype.print_struct = function (struct) {
        if (struct === "null") {
            return "null";
        }
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
                if (item.type === 'struct') {
                    params += this.print_struct(item) + ",";
                }
                else if (item.type === 'array') {
                    params += JSON.stringify(item.value) + ",";
                }
                else {
                    params += item.value + ",";
                }
            }
            return params.slice(0, params.length - 1) + ")";
        }
    };
    return Graficar_ts;
}(Function));
export { Graficar_ts };
