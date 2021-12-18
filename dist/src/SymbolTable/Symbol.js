var Symbol = /** @class */ (function () {
    function Symbol(id, type, row, column, value, environment, in_heap, label_true, label_false) {
        this._id = id;
        this._type = type;
        this._row = row;
        this._column = column;
        this._value = value;
        this._environment = environment;
        this._inHeap = in_heap;
        this.label_true = label_true;
        this.label_false = label_false;
    }
    Object.defineProperty(Symbol.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (v) {
            this._id = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Symbol.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (v) {
            this._type = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Symbol.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Symbol.prototype, "environment", {
        get: function () {
            return this._environment;
        },
        set: function (v) {
            this._environment = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Symbol.prototype, "row", {
        get: function () {
            return this._row;
        },
        set: function (v) {
            this._row = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Symbol.prototype, "column", {
        get: function () {
            return this._column;
        },
        set: function (v) {
            this._column = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Symbol.prototype, "position", {
        get: function () {
            return this.pos;
        },
        set: function (v) {
            this.pos = v;
        },
        enumerable: false,
        configurable: true
    });
    return Symbol;
}());
export default Symbol;
