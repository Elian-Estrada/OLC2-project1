var Generator3D = /** @class */ (function () {
    function Generator3D() {
        this.generator = null;
        this.count_temp = 0;
        this.count_label = 0;
        this.code = "";
        this.funcs = "";
        this.natives = "";
        this.inFunc = false;
        this.inNatives = false;
        this.temps = [];
        this.errors = [];
        this.symbol_table = [];
        this.temps_recover = {};
        this.print_string = false;
        this.upper_case = false;
        this.lower_case = false;
        this.concat_str = false;
        this.repetition_str = false;
        this.aux_errors = [];
        this.table = [];
        this.flag_math = false;
        this.list_aux = [];
    }
    Generator3D.prototype.get_instance = function () {
        if (this.generator == null) {
            this.generator = new Generator3D();
        }
        return this.generator;
    };
    Generator3D.prototype.clean_all = function () {
        this.count_temp = 0;
        this.count_label = 0;
        this.code = "";
        this.funcs = "";
        this.natives = "";
        this.inFunc = false;
        this.inNatives = false;
        this.temps = [];
        this.errors = [];
        this.symbol_table = [];
        this.temps_recover = {};
        this.print_string = false;
        this.upper_case = false;
        this.lower_case = false;
        this.concat_str = false;
        this.repetition_str = false;
        this.aux_errors = [];
        this.table = [];
        this.flag_math = false;
        this.list_aux = [];
        this.generator = new Generator3D();
    };
    Generator3D.prototype.initial_header = function () {
        var header = "/*------HEADER------*/\n";
        if (this.flag_math) {
            header += "#include <stdio.h>\n\n        #include <math.h>\n";
        }
        else {
            header += "#include <stdio.h>\n";
        }
        header += "double heap[30101999];\n";
        header += "double stack[30101999];\n";
        header += "double P;";
        header += "double H;";
        if (this.temps.length > 0) {
            for (var i = 0; i < this.temps.length; i++) {
                header += this.temps[i];
                if (i != (this.temps.length - 1))
                    header += ", ";
            }
        }
        return header;
    };
    Generator3D.prototype.get_code = function () {
        return "".concat(this.initial_header()).concat(this.natives, "\n").concat(this.funcs, "\n/*------MAIN------*/\n void main() { \n ").concat(this.code, "\n\t return; \n }");
    };
    Generator3D.prototype.get_freeTemp = function (temp) {
        if (temp in this.temps_recover) { // @ts-ignore
            delete this.temps_recover[temp];
        }
    };
    Generator3D.prototype.add_print = function (type, data_type, value) {
        this.get_freeTemp(value);
        this.codeIn("printf(\"%".concat(type, "\", (").concat(data_type, ")").concat(value, ");\n"));
    };
    Generator3D.prototype.printString = function () {
        if (this.print_string)
            return;
        this.print_string = true;
        this.inNatives = true;
        // Inicio de la funcion para imprimir
        this.addBeginFunc('printString');
        // Label de fin:
        var retLbl1 = this.newLabel();
        // label para cmp de fin
        var cmpLb1 = this.newLabel();
        // temp a pointer stack
        var tempP = this.addTemp();
        // temp a puntero de heap
        var tempH = this.addTemp();
        // Primera operacion
        this.addExpression(tempP, 'P', '1', '+');
        this.getStack(tempH, tempP);
    };
    Generator3D.prototype.getStack = function (place, pos) {
        this.get_freeTemp(pos);
        this.codeIn("".concat(place, " = stack[(int)").concat(pos, "];\n"));
    };
    Generator3D.prototype.newLabel = function () {
        var label = "L".concat(this.count_label);
        this.count_label += 1;
        return label;
    };
    // Funcion para crear operacione binaria con operadores y temporales
    Generator3D.prototype.addExpression = function (res, left, right, ope) {
        this.get_freeTemp(left);
        this.get_freeTemp(right);
        this.codeIn("".concat(res, " = ").concat(left, " ").concat(ope, " ").concat(right, ";\n"));
    };
    Generator3D.prototype.addTemp = function () {
        var temp = "T".concat(this.count_temp); // Crear temporal Tn
        this.count_temp += 1; // Incrementar contador de temporales en 1
        this.temps.push(temp); // Meter en el arreglo de temporales al nuevo Tn
        // @ts-ignore
        this.temps_recover.temp = temp; // Diccionario en clave Tn tendrá valor de Tn
        return temp; // Retornamos temporal
    };
    Generator3D.prototype.addBeginFunc = function (id) {
        if (!this.inNatives)
            this.inFunc = true;
        this.codeIn("void ".concat(id, " () {\n"), '');
    };
    Generator3D.prototype.codeIn = function (code, tab) {
        if (tab === void 0) { tab = "\t"; }
        if (this.inNatives) {
            if (this.natives == "")
                this.natives = this.natives + "/*------NATIVES------*/\n";
            this.funcs = this.funcs + tab + code;
        }
        else
            this.code = this.code + "\t" + code;
    };
    return Generator3D;
}());
export { Generator3D };
