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
        this.compare_str = false;
        this.to_str = false;
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
        this.compare_str = false;
        this.to_str = false;
        this.aux_errors = [];
        this.table = [];
        this.flag_math = false;
        this.list_aux = [];
        this.generator = new Generator3D();
    };
    Generator3D.prototype.initial_header = function () {
        var header = "/*------HEADER------*/\n";
        header += "#include <stdio.h>\n";
        header += "#include <math.h>\n";
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
        return "".concat(this.initial_header()).concat(this.natives, "\n").concat(this.funcs, "\n/*------MAIN------*/\n void main() { \n\tP = 1; H = 0;\n ").concat(this.code, "\n\t return; \n }");
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
    Generator3D.prototype.addOperationMod = function (res, left, right) {
        this.codeIn("".concat(res, "=fmod(").concat(left, ", ").concat(right, ");\n"));
    };
    Generator3D.prototype.concatString = function () {
        if (this.concat_str)
            return;
        this.concat_str = true;
        this.inNatives = true;
        this.addBeginFunc('concatString');
        // Iniciar con las temporales
        var t2 = this.addTemp();
        var t3 = this.addTemp();
        var t4 = this.addTemp();
        var t5 = this.addTemp();
        this.addExpression(t2, 'H', '', ''); // T2 = H
        this.addExpression(t3, 'P', '1', '+'); // T3 = P + 1
        this.getStack(t5, t3); // T5 = stack[T4]
        this.addExpression(t4, 'P', '2', '+'); // T4 = P + 2
        var L1 = this.newLabel();
        var L2 = this.newLabel();
        // Inicia codigo
        this.setLabel(L1); // L1:
        var t6 = this.addTemp();
        this.getHeap(t6, t5); // T6 = heap[T5];
        this.addIf(t6, '-1', '==', L2); // if(T6 == -1) goto L2;
        this.setHeap('H', t6); // heap[H] = T6;
        this.nextHeap(); // H = H + 1;
        this.addExpression(t5, t5, '1', '+'); // T5 = T5 + 1;
        this.addGoTo(L1); // goto L1;
        this.setLabel(L2); // L2:
        this.getStack(t5, t4); // T5 = stack[T5];
        var L0 = this.newLabel();
        var L3 = this.newLabel();
        this.setLabel(L3); // L3:
        this.getHeap(t6, t5); // T6 = heap[T5];
        this.addIf(t6, '-1', '==', L0); // if(T6 == -1) goto L0
        this.setHeap('H', t6); // heap[H] = T6;
        this.nextHeap(); // H = H + 1;
        this.addExpression(t5, t5, '1', '+'); // T5 = T5 + 1;
        this.addGoTo(L3); // goto L3;
        this.setLabel(L0); // L0:
        this.setHeap('H', '-1'); // heap[H] = -1
        this.nextHeap(); // H = H + 1;
        this.setStack('P', t2); // stack[P] = t3;
        // Termina codigo
        this.addEndFunc();
        this.inNatives = false;
        this.get_freeTemp(t2);
        this.get_freeTemp(t3);
        this.get_freeTemp(t4);
        this.get_freeTemp(t5);
        this.get_freeTemp(t6);
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
    Generator3D.prototype.compareString = function () {
        if (this.compare_str)
            return;
        this.compare_str = true;
        this.inNatives = true;
        this.addBeginFunc('compareStr');
        var t2 = this.addTemp();
        this.addExpression(t2, 'P', '1', '+'); // P = P + 1
        var t3 = this.addTemp();
        this.getStack(t3, t2); // t3 = stack[t2]
        this.addExpression(t2, t2, '1', '+'); // t2 = t2 + 1;
        var t4 = this.addTemp();
        this.getStack(t4, t2); // t4 = stack[t2]
        var L0 = this.newLabel();
        var L1 = this.newLabel();
        var L2 = this.newLabel();
        var L3 = this.newLabel();
        this.setLabel(L1); // L1:
        var t5 = this.addTemp();
        this.getHeap(t5, t3); // t5 = heap[t3]
        var t6 = this.addTemp();
        this.getHeap(t6, t4); // t6 = heap[t4]
        this.addIf(t5, t6, '!=', L3); // if(t5 != t6) goto L3
        this.addIf(t5, '-1', '==', L2); // if (t5 != -1) goto L2
        this.addExpression(t3, t3, '1', '+'); // t3 = t3 + 1
        this.addExpression(t4, t4, '1', '+'); // t4 = t4 + 1
        this.addGoTo(L1); // goto L1
        this.setLabel(L2); // L2:
        this.setStack('P', '1'); // stack[P] = 1
        this.addGoTo(L0); // goto L0
        this.setLabel(L3); // L3:
        this.setStack('P', '0'); // stack[P] = 0
        this.setLabel(L0); // L0:
        this.addEndFunc();
        this.inNatives = false;
        this.get_freeTemp(t2);
        this.get_freeTemp(t3);
        this.get_freeTemp(t4);
        this.get_freeTemp(t5);
        this.get_freeTemp(t6);
    };
    Generator3D.prototype.repString = function () {
        if (this.repetition_str)
            return;
        this.repetition_str = true;
        this.inNatives = true;
        this.addBeginFunc('repetitionStr');
        // Start: 0 - return, 1 - string, 2 - int
        var t0 = this.addTemp();
        this.addExpression(t0, 'H', '', '');
        // Primer parametro string
        var t1 = this.addTemp();
        var t2 = this.addTemp();
        this.addExpression(t1, 'P', '1', '+');
        this.getStack(t2, t1);
        // Segundo parametro int
        var t3 = this.addTemp();
        this.addExpression(t1, 'P', '2', '+');
        this.getStack(t3, t1);
        var L0 = this.newLabel();
        var L1 = this.newLabel();
        var L2 = this.newLabel();
        var counter = this.addTemp();
        this.addExpression(counter, '0', '', '');
        var t5 = this.addTemp();
        this.addExpression(t5, t2, '', '');
        this.setLabel(L0);
        var t4 = this.addTemp();
        this.getHeap(t4, t2);
        this.addIf(t4, '-1', '==', L1);
        this.setHeap('H', t4);
        this.nextHeap();
        this.addExpression(t2, t2, '1', '+');
        this.addGoTo(L0); // Regresa a L0
        this.setLabel(L1);
        this.addExpression(counter, counter, '1', '+');
        // Reiniciamos el contador
        this.addExpression(t2, t5, '', '');
        this.addIf(counter, t3, '==', L2);
        this.addGoTo(L0);
        this.setLabel(L2);
        this.setHeap('H', '-1');
        this.nextHeap();
        this.setStack('P', t0);
        this.addEndFunc();
        this.inNatives = false;
        this.get_freeTemp(t0);
        this.get_freeTemp(t1);
        this.get_freeTemp(t2);
        this.get_freeTemp(t3);
        this.get_freeTemp(t4);
        this.get_freeTemp(t5);
        this.get_freeTemp(counter);
    };
    Generator3D.prototype.NumberToString = function () {
        if (this.to_str)
            return;
        this.to_str = true;
        this.inNatives = true;
        var t2 = this.addTemp();
        var t3 = this.addTemp();
        var t4 = this.addTemp();
        var t5 = this.addTemp();
        var L0 = this.newLabel();
        var L1 = this.newLabel();
        var L2 = this.newLabel();
        var L3 = this.newLabel();
        this.addBeginFunc('toString');
        this.setHeap('H', -1);
        this.addExpression('H', 'H', 1, '+');
        this.addExpression(t2, 'P', 1, '+');
        this.getStack(t4, t2);
        this.addIf(t4, 0, '>=', L1);
        this.addExpression(t4, 0, t4, '-');
        this.setLabel(L1);
        this.modOp(t3, t4, 10);
        this.addExpression(t3, t3, 48, '+');
        this.addExpression(t4, "(int)".concat(t4), 10, '/');
        this.setHeap('H', t3);
        this.nextHeap();
        this.addIf(t4, 0, '!=', L1);
        this.addAssignment(t5, 'H');
        this.addExpression(t2, 'P', 1, '+');
        this.getStack(t4, t2);
        this.addIf(t4, 0, '>=', L2);
        this.setHeap('H', 45);
        this.addExpression('H', 'H', 1, '+');
        this.setLabel(L2);
        this.addAssignment(t2, t5);
        this.setLabel(L3);
        this.addExpression(t2, t2, 1, '-');
        this.getHeap(t3, t2);
        this.setHeap('H', t3);
        this.addExpression('H', 'H', 1, '+');
        this.addIf(t3, -1, '!=', L3);
        this.setLabel(L0);
        this.setStack('P', t5);
        this.addEndFunc();
        this.inNatives = false;
        this.get_freeTemp(t2);
        this.get_freeTemp(t3);
        this.get_freeTemp(t4);
        this.get_freeTemp(t5);
    };
    Generator3D.prototype.modOp = function (res, temp, num) {
        this.get_freeTemp(res);
        this.get_freeTemp(temp);
        this.codeIn("".concat(res, " = (int)fmod(").concat(temp, ", ").concat(num, ");\n"));
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
    Generator3D.prototype.addBeginFunc = function (id, type) {
        if (type === void 0) { type = 'void'; }
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
            this.natives = this.natives + tab + code;
        }
        else if (this.inFunc) {
            if (this.funcs == "")
                this.funcs = this.funcs + "\n/*-----FUNCTIONS-----*/\n";
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
    Generator3D.prototype.printMathError = function () {
        this.add_print("c", "char", 77); // M
        this.add_print("c", "char", 97); // a
        this.add_print("c", "char", 116); // t
        this.add_print("c", "char", 104); // h
        this.add_print("c", "char", 69); // E
        this.add_print("c", "char", 114); // r
        this.add_print("c", "char", 114); // r
        this.add_print("c", "char", 111); // o
        this.add_print("c", "char", 114); // r
    };
    Generator3D.prototype.freeAllTemps = function () {
        this.temps_recover = {};
    };
    Generator3D.prototype.get_TempsRecover = function () {
        return this.temps_recover;
    };
    Generator3D.prototype.keepTemps = function (env) {
        var size = 0;
        if (Object.keys(this.temps_recover).length > 0) {
            var temp = this.addTemp();
            this.get_freeTemp(temp);
            this.addExpression(temp, 'P', env.get_size(), '+');
            for (var value in this.temps_recover) {
                size += 1;
                this.setStack(temp, value, false);
                if (size != Object.keys(this.temps_recover).length) {
                    this.addExpression(temp, temp, '1', '+');
                }
            }
        }
        var pos = env.get_size();
        env.set_size(pos + size);
        return pos;
    };
    Generator3D.prototype.recoverTemps = function (env, pos) {
        if (Object.keys(this.recoverTemps).length > 0) {
            var temp = this.addTemp();
            this.get_freeTemp(temp);
            var size = 0;
            this.addExpression(temp, 'P', pos, '+');
            for (var value in this.temps_recover) {
                size += 1;
                this.getStack(value, temp);
                if (size != Object.keys(this.recoverTemps).length) {
                    this.addExpression(temp, temp, '1', '+');
                }
                env.set_size(pos);
            }
        }
    };
    return Generator3D;
}());
export { Generator3D };
