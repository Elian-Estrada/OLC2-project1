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
        header += "double P;"
        header += "double H;"

        if ( this.temps.length > 0 ) {
            for ( let i = 0; i < this.temps.length; i++) {
                header += this.temps[i];
                if ( i != (this.temps.length-1) )
                    header += ", "
            }
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
        let retLbl1 = this.newLabel();
        // label para cmp de fin
        let cmpLb1 = this.newLabel();

        // temp a pointer stack
        let tempP = this.addTemp();
        // temp a puntero de heap
        let tempH = this.addTemp();

        // Primera operacion
        this.addExpression(tempP, 'P', '1', '+');
        this.getStack(tempH, tempP);
    }

    public getStack(place: any, pos: any) {
        this.get_freeTemp(pos);
        this.codeIn(`${place} = stack[(int)${pos}];\n`);
    }

    public newLabel() {
        let label = `L${this.count_label}`;
        this.count_label += 1;
        return label;
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

    public addBeginFunc(id: string) {
        if ( !this.inNatives )
            this.inFunc = true;
        this.codeIn(`void ${id} () {\n`, '');
    }

    public codeIn(code: any, tab: string = "\t") {
        if ( this.inNatives ) {
            if ( this.natives == "" )
                this.natives = this.natives + "/*------NATIVES------*/\n"
            this.funcs = this.funcs + tab + code;
        } else
            this.code = this.code + "\t" + code;
    }
}