import Exception from "../SymbolTable/Exception.js";
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
        header += "float heap[30101999];\n";
        header += "float stack[30101999];\n";
        header += "float P;\n";
        header += "float H;\n";
        if (this.temps.length > 0) {
            header += "float ";
            for (var i = 0; i < this.temps.length; i++) {
                header += this.temps[i];
                if (i != (this.temps.length - 1))
                    header += ", ";
            }
            header += ";\n";
        }
        return header;
    };
    Generator3D.prototype.get_code = function () {
        return "".concat(this.initial_header()).concat(this.natives, "\n").concat(this.funcs, "\n/*------MAIN------*/\n void main() { \n\tP = 0; H = 0;\n ").concat(this.code, "\n\t return; \n }");
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
    Generator3D.prototype.addError = function (message, line, column) {
        this.errors.push(new Exception("Semantic", "Id not existent", line, column));
    };
    Generator3D.prototype.printString = function () {
        if (this.print_string)
            return;
        this.print_string = true;
        this.inNatives = true;
        // Inicio de la funcion para imprimir
        this.addBeginFunc('printString');
        // Label de fin:
        var retLbl1 = this.newLabel(); // L0
        // label para cmp de fin
        var cmpLb1 = this.newLabel(); // L1
        // temp a pointer stack
        var tempP = this.addTemp();
        // temp a puntero de heap
        var tempH = this.addTemp();
        // Primera operacion
        this.addExpression(tempP, 'P', '1', '+'); // T = P + 1;
        this.getStack(tempH, tempP); // T2 = stack[T1];
        // Nuevo temp para cmp
        var tempCmp = this.addTemp();
        this.setLabel(cmpLb1); // L1:
        this.getHeap(tempCmp, tempH); // T3 = heap[T2];
        this.addIf(tempCmp, '-1', '==', retLbl1); // if (t3 == -1) goto L0;
        this.add_print('c', 'char', tempCmp); // print("%c", (char)T3);
        this.addExpression(tempH, tempH, '1', '+'); // T2 = T2 + 1;
        this.addGoTo(cmpLb1); // goto L1;
        this.setLabel(retLbl1); // L1:
        this.addEndFunc(); // return;
        this.inNatives = false;
        this.get_freeTemp(tempP);
        this.get_freeTemp(tempH);
        this.get_freeTemp(tempCmp);
    };
    Generator3D.prototype.getStack = function (place, pos) {
        this.get_freeTemp(pos);
        this.codeIn("".concat(place, " = stack[(int)").concat(pos, "];\n"));
    };
    Generator3D.prototype.setStack = function (pos, value, freeValue) {
        if (freeValue === void 0) { freeValue = true; }
        this.get_freeTemp(pos);
        if (freeValue)
            this.get_freeTemp(value);
        this.codeIn("stack[(int)".concat(pos, "] = ").concat(value, ";\n"));
    };
    Generator3D.prototype.getHeap = function (place, pos) {
        this.get_freeTemp(pos);
        this.codeIn("".concat(place, " = heap[(int)").concat(pos, "];\n"));
    };
    Generator3D.prototype.setHeap = function (pos, value) {
        this.get_freeTemp(pos);
        this.get_freeTemp(value);
        this.codeIn("heap[(int)".concat(pos, "] = ").concat(value, ";\n"));
    };
    Generator3D.prototype.nextHeap = function () {
        this.codeIn('H = H + 1;\n');
    };
    Generator3D.prototype.newLabel = function () {
        var label = "L".concat(this.count_label);
        this.count_label += 1;
        return label;
    };
    Generator3D.prototype.setLabel = function (label) {
        this.codeIn("".concat(label, ":\n"));
    };
    // Funcion para crear operacione binaria con operadores y temporales
    Generator3D.prototype.addExpression = function (res, left, right, ope) {
        this.get_freeTemp(left);
        this.get_freeTemp(right);
        this.codeIn("".concat(res, " = ").concat(left, " ").concat(ope, " ").concat(right, ";\n"));
    };
    Generator3D.prototype.addTemp = function () {
        var temp = "t".concat(this.count_temp); // Crear temporal Tn
        this.count_temp += 1; // Incrementar contador de temporales en 1
        this.temps.push(temp); // Meter en el arreglo de temporales al nuevo Tn
        // @ts-ignore
        this.temps_recover.temp = temp; // Diccionario en clave Tn tendrá valor de Tn
        return temp; // Retornamos temporal
    };
    Generator3D.prototype.addAssignment = function (pointer, value) {
        this.codeIn("".concat(pointer, " = ").concat(value, ";\n"));
    };
    Generator3D.prototype.addBeginFunc = function (id) {
        if (!this.inNatives)
            this.inFunc = true;
        this.codeIn("void ".concat(id, " () {\n"), '');
    };
    Generator3D.prototype.addIf = function (left, right, ope, label) {
        this.get_freeTemp(left);
        this.get_freeTemp(right);
        this.codeIn("if (".concat(left, " ").concat(ope, " ").concat(right, ") goto ").concat(label, "; \n"));
    };
    Generator3D.prototype.addGoTo = function (label) {
        this.codeIn("goto ".concat(label, ";\n"));
    };
    Generator3D.prototype.addComment = function (comment) {
        this.codeIn("/* ".concat(comment, " */\n"));
    };
    Generator3D.prototype.addEndFunc = function () {
        this.codeIn("return; \n}\n");
        if (!this.inNatives)
            this.inFunc = false;
    };
    Generator3D.prototype.codeIn = function (code, tab) {
        if (tab === void 0) { tab = "\t"; }
        if (this.inNatives) {
            if (this.natives == "")
                this.natives = this.natives + "\n/*------NATIVES------*/\n";
            this.funcs = this.funcs + tab + code;
        }
        else
            this.code = this.code + "\t" + code;
    };
    Generator3D.prototype.newEnv = function (size) {
        this.codeIn("P = P + ".concat(size, ";\n"));
    };
    Generator3D.prototype.setEnv = function (size) {
        this.codeIn("P = P - ".concat(size, ";\n"));
    };
    Generator3D.prototype.callFunc = function (id) {
        this.codeIn("".concat(id, "(); \n"));
    };
    Generator3D.prototype.printTrue = function () {
        this.add_print("c", "char", 116);
        this.add_print("c", "char", 114);
        this.add_print("c", "char", 117);
        this.add_print("c", "char", 101);
    };
    Generator3D.prototype.printFalse = function () {
        this.add_print("c", "char", 102);
        this.add_print("c", "char", 97);
        this.add_print("c", "char", 108);
        this.add_print("c", "char", 115);
        this.add_print("c", "char", 101);
    };
    Generator3D.prototype.get_TempsRecover = function () {
        return this.temps_recover;
    };
    return Generator3D;
}());
export { Generator3D };
