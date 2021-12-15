
export class Value {

    private value: any;
    private type: any;
    private is_temp: boolean;
    private aux_type: string;
    private true_label: string;
    private false_label: string;
    private values_array: Array<any>;
    private type_array: any;

    constructor(value: any, type: any, is_temp: boolean, aux_type = "") {
        this.value = value;
        this.type = type;
        this.is_temp = is_temp;
        this.aux_type = aux_type;
        this.true_label = '';
        this.false_label = '';
        this.values_array = [];
        this.type_array = null;
    }

    public get_ValuesArray() {
        return this.values_array;
    }

    public get_type() {
        return this.type;
    }
}