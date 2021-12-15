var Value = /** @class */ (function () {
    function Value(value, type, is_temp, aux_type) {
        if (aux_type === void 0) { aux_type = ""; }
        this.value = value;
        this.type = type;
        this.is_temp = is_temp;
        this.aux_type = aux_type;
        this.true_label = '';
        this.false_label = '';
        this.values_array = [];
        this.type_array = null;
    }
    Value.prototype.get_ValuesArray = function () {
        return this.values_array;
    };
    Value.prototype.get_type = function () {
        return this.type;
    };
    return Value;
}());
export { Value };
