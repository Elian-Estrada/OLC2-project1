import SymbolTable from "../SymbolTable/SymbolTable";


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
    private upper_case: boolean;
    private lower_case: boolean;
    private concat_str: boolean;
    private repetition_str: boolean;
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
        this.upper_case = false;
        this.lower_case = false;
        this.concat_str = false;
        this.repetition_str = false;
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
        this.upper_case = false;
        this.lower_case = false;
        this.concat_str = false;
        this.repetition_str = false;
        this.aux_errors = [];
        this.table = [];
        this.flag_math = false;
        this.list_aux = [];
        this.generator = new Generator3D();
    }

    public initial_header() {
        let header = "/*------HEADER------*/\n";

        if ( this.flag_math ) {
            header += `#include <stdio.h>\n
        #include <math.h>\n`;
        } else {
            header += "#include <stdio.h>\n";
        }

        header += "double heap[30101999];\n";
        header += "double stack[30101999];\n";
        header += "double P;\n"
        header += "double H;\n"

        if ( this.temps.length > 0 ) {
            header += "double ";
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
        return `${this.initial_header()}${this.natives}\n${this.funcs}\n/*------MAIN------*/\n void main() { \n ${this.code}\n\t return; \n }`;
    }

    public get_freeTemp(temp: any) {
        if ( temp in this.temps_recover )
            { // @ts-ignore
                delete this.temps_recover[temp];
            }
    }

    public add_print(type: string, data_type: string, value: any) {
        this.get_freeTemp(value);
        this.codeIn(`printf("%${type}", (${data_type})${value});\n`);
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

    public getStack(place: any, pos: any) {
        this.get_freeTemp(pos);
        this.codeIn(`${place} = stack[(int)${pos}];\n`);
    }

    public setStack(pos: any, value: any, freeValue = true) {
        this.get_freeTemp(pos);
        if (freeValue)
            this.get_freeTemp(value);
        this.codeIn(`stack[(int)${pos}] = ${value};\n`)
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
        let temp = `T${this.count_temp}`;   // Crear temporal Tn
        this.count_temp += 1;               // Incrementar contador de temporales en 1
        this.temps.push(temp);              // Meter en el arreglo de temporales al nuevo Tn
        // @ts-ignore
        this.temps_recover.temp = temp;     // Diccionario en clave Tn tendrá valor de Tn
        return temp;                        // Retornamos temporal
    }

    public addAssignment(pointer: any, value: any) {
        this.codeIn(`${pointer} = ${value};\n`);
    }

    public addBeginFunc(id: string) {
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

    public addEndFunc() {
        this.codeIn(`return; \n}\n`);
        if ( !this.inNatives )
            this.inFunc = false;
    }

    public codeIn(code: any, tab: string = "\t") {
        if ( this.inNatives ) {
            if ( this.natives == "" )
                this.natives = this.natives + "\n/*------NATIVES------*/\n"
            this.funcs = this.funcs + tab + code;
        } else
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
}