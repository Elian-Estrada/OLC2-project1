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
    return Generator3D;
}());
export { Generator3D };
