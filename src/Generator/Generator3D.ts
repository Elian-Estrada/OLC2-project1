

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
}