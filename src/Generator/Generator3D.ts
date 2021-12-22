import SymbolTable from "../SymbolTable/SymbolTable";
import Exception from "../SymbolTable/Exception.js";


export class Generator3D {

    public generator: any = null;
    private count_temp: number;
    private count_label: number;
    private code: string;
    private funcs: string;
    private natives: string;
    private inFunc: boolean;
    private inNatives: boolean;
    private temps: Array<any>;
    private errors: Array<any>;
    private symbol_table: Array<any>
    private temps_recover: Object;
    private print_string: boolean;
    private power: boolean;
    private upper_case: boolean;
    private lower_case: boolean;
    private concat_str: boolean;
    private repetition_str: boolean;
    private compare_str: boolean;
    private to_str: boolean;
    private aux_errors: Array<any>;
    private table: Array<any>;
    private flag_math: boolean;
    private list_aux: Array<any>;

    constructor() {
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
        this.power = false;
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

    public get_instance() {
        if ( this.generator == null ) {
            this.generator = new Generator3D();
        }
        return this.generator;
    }

    public clean_all() {
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
        this.power = false;
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
    }

    public initial_header() {
        let header = "/*------HEADER------*/\n";

        header += "#include <stdio.h>\n"
        header += "#include <math.h>\n";

        header += "float heap[30101999];\n";
        header += "float stack[30101999];\n";
        header += "float P;\n"
        header += "float H;\n"

        if ( this.temps.length > 0 ) {
            header += "float ";
            for ( let i = 0; i < this.temps.length; i++) {
                header += this.temps[i];
                if ( i != (this.temps.length-1) )
                    header += ", "
            }
            header += ";\n"
        }

        return header;
    }

    public get_code() {
        return `${this.initial_header()}${this.natives}\n${this.funcs}\n/*------MAIN------*/\n void main() { \n\tP = 1; H = 0;\n ${this.code}\n\t return; \n }`;
    }

    public get_freeTemp(temp: any) {
        // @ts-ignore
        if ( temp == this.temps_recover[`${temp}`] )
        { // @ts-ignore
            delete this.temps_recover[`${temp}`];
        }
    }

    public add_print(type: string, data_type: string, value: any) {
        this.get_freeTemp(value);
        this.codeIn(`printf("%${type}", (${data_type})${value});\n`);
    }

    public addError(message: string, line: number, column: number) {
        this.errors.push(new Exception("Semantic", "Id not existent", line, column));
    }

    public addOperationMod(res: string, left: string, right: string) {
        this.codeIn(`${res}=fmod(${left}, ${right});\n`);
    }

    public concatString() {
        if ( this.concat_str )
            return;
        this.concat_str = true;
        this.inNatives = true;
        this.addBeginFunc('concatString');

        // Iniciar con las temporales
        let t2 = this.addTemp();
        let t3 = this.addTemp();
        let t4 = this.addTemp();
        let t5 = this.addTemp();

        this.addExpression(t2, 'H', '', '');    // T2 = H
        this.addExpression(t3, 'P', '1', '+');  // T3 = P + 1
        this.getStack(t5, t3);                                  // T5 = stack[T4]
        this.addExpression(t4, 'P', '2', '+');  // T4 = P + 2

        let L1 = this.newLabel();
        let L2 = this.newLabel();

        // Inicia codigo
        this.setLabel(L1);                                      // L1:
        let t6 = this.addTemp();
        this.getHeap(t6, t5);                                   // T6 = heap[T5];

        this.addIf(t6, '-1', '==', L2);             // if(T6 == -1) goto L2;
        this.setHeap('H', t6);                            // heap[H] = T6;
        this.nextHeap();                                       // H = H + 1;
        this.addExpression(t5, t5, '1', '+');       // T5 = T5 + 1;
        this.addGoTo(L1);                                       // goto L1;

        this.setLabel(L2);                                      // L2:
        this.getStack(t5, t4);                                  // T5 = stack[T5];

        let L0 = this.newLabel();
        let L3 = this.newLabel();
        this.setLabel(L3);                                      // L3:
        this.getHeap(t6, t5);                                   // T6 = heap[T5];

        this.addIf(t6, '-1', '==', L0);             // if(T6 == -1) goto L0
        this.setHeap('H', t6);                            // heap[H] = T6;
        this.nextHeap();                                        // H = H + 1;
        this.addExpression(t5, t5, '1', '+');       // T5 = T5 + 1;
        this.addGoTo(L3);                                       // goto L3;

        this.setLabel(L0);                                      // L0:
        this.setHeap('H', '-1');                    // heap[H] = -1
        this.nextHeap();                                        // H = H + 1;
        this.setStack('P', t2);                             // stack[P] = t3;
        // Termina codigo

        this.addEndFunc();
        this.inNatives = false;
        this.get_freeTemp(t2);
        this.get_freeTemp(t3);
        this.get_freeTemp(t4);
        this.get_freeTemp(t5);
        this.get_freeTemp(t6);
    }

    public printString() {
        if ( this.print_string )
            return;

        this.print_string = true;
        this.inNatives = true;

        // Inicio de la funcion para imprimir
        this.addBeginFunc('printString');

        // Label de fin:
        let retLbl1 = this.newLabel();  // L0
        // label para cmp de fin
        let cmpLb1 = this.newLabel();   // L1

        // temp a pointer stack
        let tempP = this.addTemp();
        // temp a puntero de heap
        let tempH = this.addTemp();

        // Primera operacion
        this.addExpression(tempP, 'P', '1', '+');   // T = P + 1;
        this.getStack(tempH, tempP);                                // T2 = stack[T1];

        // Nuevo temp para cmp
        let tempCmp = this.addTemp();
        this.setLabel(cmpLb1);                                      // L1:
        this.getHeap(tempCmp, tempH);                               // T3 = heap[T2];
        this.addIf(tempCmp, '-1', '==', retLbl1);       // if (t3 == -1) goto L0;

        this.add_print('c', 'char', tempCmp);       // print("%c", (char)T3);
        this.addExpression(tempH, tempH, '1', '+');     // T2 = T2 + 1;
        this.addGoTo(cmpLb1);                                       // goto L1;
        this.setLabel(retLbl1);                                     // L1:
        this.addEndFunc()                                           // return;
        this.inNatives = false;
        this.get_freeTemp(tempP)
        this.get_freeTemp(tempH)
        this.get_freeTemp(tempCmp)
    }

    public compareString() {
        if ( this.compare_str )
            return;

        this.compare_str = true;
        this.inNatives = true;
        this.addBeginFunc('compareStr');

        let t2 = this.addTemp();
        this.addExpression(t2, 'P', '1', '+');      // P = P + 1
        let t3 = this.addTemp();
        this.getStack(t3, t2);                                      // t3 = stack[t2]
        this.addExpression(t2, t2, '1', '+');           // t2 = t2 + 1;
        let t4 = this.addTemp();
        this.getStack(t4, t2);                                      // t4 = stack[t2]

        let L0 = this.newLabel();
        let L1 = this.newLabel();
        let L2 = this.newLabel();
        let L3 = this.newLabel();

        this.setLabel(L1);                                          // L1:
        let t5 = this.addTemp();
        this.getHeap(t5, t3);                                       // t5 = heap[t3]
        let t6 = this.addTemp();
        this.getHeap(t6, t4);                                       // t6 = heap[t4]

        this.addIf(t5, t6, '!=', L3);                           // if(t5 != t6) goto L3
        this.addIf(t5, '-1', '==', L2);                 // if (t5 != -1) goto L2
        this.addExpression(t3, t3, '1', '+');           // t3 = t3 + 1
        this.addExpression(t4, t4, '1', '+');           // t4 = t4 + 1
        this.addGoTo(L1);                                           // goto L1

        this.setLabel(L2);                                          // L2:
        this.setStack('P', '1');                        // stack[P] = 1
        this.addGoTo(L0);                                           // goto L0

        this.setLabel(L3);                                          // L3:
        this.setStack('P', '0');                        // stack[P] = 0
        this.setLabel(L0);                                          // L0:

        this.addEndFunc();
        this.inNatives = false;
        this.get_freeTemp(t2);
        this.get_freeTemp(t3);
        this.get_freeTemp(t4);
        this.get_freeTemp(t5);
        this.get_freeTemp(t6);
    }

    public repString() {
        if ( this.repetition_str )
            return;
        this.repetition_str = true;
        this.inNatives = true;

        this.addBeginFunc('repetitionStr');

        // Start: 0 - return, 1 - string, 2 - int
        let t0 = this.addTemp();
        this.addExpression(t0, 'H', '', '');

        // Primer parametro string
        let t1 = this.addTemp();
        let t2 = this.addTemp();
        this.addExpression(t1, 'P', '1', '+');
        this.getStack(t2, t1);

        // Segundo parametro int
        let t3 = this.addTemp();
        this.addExpression(t1, 'P', '2', '+');
        this.getStack(t3, t1);

        let L0 = this.newLabel();
        let L1 = this.newLabel();
        let L2 = this.newLabel();

        let counter = this.addTemp();
        this.addExpression(counter, '0', '', '');
        let t5 = this.addTemp();
        this.addExpression(t5, t2, '', '');

        this.setLabel(L0);
        let t4 = this.addTemp();
        this.getHeap(t4, t2);
        this.addIf(t4, '-1', '==', L1);
        this.setHeap('H', t4);
        this.nextHeap();
        this.addExpression(t2, t2, '1', '+');
        this.addGoTo(L0);   // Regresa a L0

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
    }

    public NumberToString() {
        if ( this.to_str )
            return;
        this.to_str = true;
        this.inNatives = true;

        let t2 = this.addTemp();
        let t3 = this.addTemp();
        let t4 = this.addTemp();
        let t5 = this.addTemp();

        let L0 = this.newLabel();
        let L1 = this.newLabel();
        let L2 = this.newLabel();
        let L3 = this.newLabel();

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
        this.addExpression(t4, `(int)${t4}`, 10, '/');
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
    }

    public modOp(res: any, temp: any, num: number) {
        this.get_freeTemp(res);
        this.get_freeTemp(temp);
        this.codeIn(`${res} = (int)fmod(${temp}, ${num});\n`);
    }

    public getStack(place: any, pos: any) {
        this.get_freeTemp(pos);
        this.codeIn(`${place} = stack[(int)${pos}];\n`);
    }

    public setStack(pos: any, value: any, freeValue = true) {
        this.get_freeTemp(pos);
        if (freeValue)
            this.get_freeTemp(value);
        this.codeIn(`stack[(int)${pos}] = ${value};\n`);
    }

    public getHeap(place: any, pos: any) {
        this.get_freeTemp(pos);
        this.codeIn(`${place} = heap[(int)${pos}];\n`);
    }

    public setHeap(pos: any, value: any) {
        this.get_freeTemp(pos);
        this.get_freeTemp(value);
        this.codeIn(`heap[(int)${pos}] = ${value};\n`);
    }

    public nextHeap() {
        this.codeIn('H = H + 1;\n')
    }

    public newLabel() {
        let label = `L${this.count_label}`;
        this.count_label += 1;
        return label;
    }

    public setLabel(label: any) {
        this.codeIn(`${label}:\n`);
    }

    // Funcion para crear operacione binaria con operadores y temporales
    public addExpression(res: any, left: any, right: any, ope: any) {
        this.get_freeTemp(left);
        this.get_freeTemp(right);
        this.codeIn(`${res} = ${left} ${ope} ${right};\n`);
    }

    public addTemp() {
        let temp = `t${this.count_temp}`;   // Crear temporal Tn
        this.count_temp += 1;               // Incrementar contador de temporales en 1
        this.temps.push(temp);              // Meter en el arreglo de temporales al nuevo Tn
        // @ts-ignore
        this.temps_recover[`${temp}`] = temp;     // Diccionario en clave Tn tendrá valor de Tn
        return temp;                        // Retornamos temporal
    }

    public addAssignment(pointer: any, value: any) {
        this.codeIn(`${pointer} = ${value};\n`);
    }

    public addBeginFunc(id: string, type: string = 'void') {
        if ( !this.inNatives )
            this.inFunc = true;
        this.codeIn(`void ${id} () {\n`, '');
    }

    public addIf(left: any, right: any, ope: any, label: any) {
        this.get_freeTemp(left);
        this.get_freeTemp(right);
        this.codeIn(`if (${left} ${ope} ${right}) goto ${label}; \n`);
    }

    public addGoTo(label: any) {
        this.codeIn(`goto ${label};\n`);
    }

    public addComment(comment: string) {
        this.codeIn(`/* ${comment} */\n`);
    }

    public addEndFunc() {
        this.codeIn(`return; \n}\n`);
        if ( !this.inNatives )
            this.inFunc = false;
    }

    public codeIn(code: any, tab: string = "\t") {
        if ( this.inNatives ) {
            if ( this.natives == "" )
                this.natives = this.natives + "\n/*------NATIVES------*/\n"
            this.natives = this.natives + tab + code;
        }
        else if ( this.inFunc ) {
            if ( this.funcs == "" )
                this.funcs = this.funcs + "\n/*-----FUNCTIONS-----*/\n";
            this.funcs = this.funcs + tab + code;
        }
        else
            this.code = this.code + "\t" + code;
    }

    public newEnv(size: any) {
        this.codeIn(`P = P + ${size};\n`);
    }

    public setEnv(size: any) {
        this.codeIn(`P = P - ${size};\n`);
    }

    public callFunc(id: any) {
        this.codeIn(`${id}(); \n`);
    }

    public printTrue() {
        this.add_print("c", "char", 116);
        this.add_print("c", "char", 114);
        this.add_print("c", "char", 117);
        this.add_print("c", "char", 101);
    }

    public printFalse() {
        this.add_print("c", "char", 102);
        this.add_print("c", "char", 97);
        this.add_print("c", "char", 108);
        this.add_print("c", "char", 115);
        this.add_print("c", "char", 101);
    }

    public printMathError() {
        this.add_print("c", "char", 77) ;     // M
        this.add_print("c", "char", 97) ;     // a
        this.add_print("c", "char", 116);     // t
        this.add_print("c", "char", 104);     // h
        this.add_print("c", "char", 69) ;     // E
        this.add_print("c", "char", 114);     // r
        this.add_print("c", "char", 114);     // r
        this.add_print("c", "char", 111);     // o
        this.add_print("c", "char", 114);     // r
    }

    public freeAllTemps() {
        this.temps_recover = {};
    }

    public get_TempsRecover() {
        return this.temps_recover;
    }

    public keepTemps(env: SymbolTable) {
        let size = 0;
        if ( Object.keys(this.temps_recover).length > 0 ) {
            let temp = this.addTemp();
            this.get_freeTemp(temp);

            this.addComment("----Start Keep Temps----");
            this.addExpression(temp, 'P', env.get_size(), '+');
            for ( let value in this.temps_recover ) {
                size += 1;
                // @ts-ignore
                this.setStack(temp, value, false);
                if ( size != Object.keys(this.temps_recover).length ) {
                    this.addExpression(temp, temp, '1', '+');
                }
                this.addComment("----End Keep Temps----");
            }
        }
        let pos = env.get_size();
        env.set_size(pos + size);
        return pos;
    }

    public powerTo() {
        if ( this.power )
            return;

        this.power = true;
        this.inNatives = true;

        this.addBeginFunc('powerTo');
        let t0 = this.addTemp();
        this.addExpression(t0, 'P', '1', '+');
        let t1 = this.addTemp();
        this.getStack(t1, t0);

        this.addExpression(t0, t0, '1', '+');
        let t2 = this.addTemp();
        this.getStack(t2, t0);
        this.addExpression(t0, t1, '', '');

        let L0 = this.newLabel();
        let L1 = this.newLabel();
        let L2 = this.newLabel();
        let exit_label = this.newLabel();

        // exp 0, ret 1 in stack
        this.addIf(t2, '0', '==', L2);
        this.setLabel(L0);

        this.addIf(t2, '1', '<=', L1);
        this.addExpression(t1, t1, t0, '*');
        this.addExpression(t2, t2, '1', '-');
        this.addGoTo(L0);
        this.setLabel(L1);
        this.setStack('P', t1);
        this.addGoTo(exit_label);

        // label si exp = 0
        this.setLabel(L2);
        this.setStack('P', 1);
        this.setLabel(exit_label);

        this.addEndFunc();
        this.inNatives = false;
        this.get_freeTemp(t0);
        this.get_freeTemp(t1);
        this.get_freeTemp(t2);
    }

    public sqrtOf(res: string, exp: string) {
        this.codeIn(`${res}=sqrt(${exp});\n`);
    }

    public senOf(res: string, exp: string) {
        this.codeIn(`${res}=sin(${exp});\n`);
    }

    public cosOf(res: string, exp: string) {
        this.codeIn(`${res}=cos(${exp});\n`);
    }

    public tanOf(res: string, exp: string) {
        this.codeIn(`${res}=tan(${exp});\n`);
    }

    public recoverTemps(env: SymbolTable, pos: number) {
        if ( Object.keys(this.temps_recover).length > 0 ) {
            let temp = this.addTemp();
            this.get_freeTemp(temp);
            let size = 0;

            this.addExpression(temp, 'P', pos, '+');
            for ( let value in this.temps_recover ) {
                size += 1;
                this.getStack(value, temp);
                if ( size != Object.keys(this.recoverTemps).length ) {
                    this.addExpression(temp, temp, '1', '+');
                }
                env.set_size(pos);
            }
        }
    }
}