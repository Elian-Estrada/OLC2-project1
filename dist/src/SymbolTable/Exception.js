var Exception = /** @class */ (function () {
    function Exception(type, description, row, column) {
        this.type = type;
        this.description = description;
        this.row = row;
        this.column = column;
    }
    Exception.prototype.getType = function () {
        return this.type;
    };
    Exception.prototype.getDescription = function () {
        return this.description;
    };
    Exception.prototype.getRow = function () {
        return this.row;
    };
    Exception.prototype.getColumn = function () {
        return this.column;
    };
    Exception.prototype.toString = function () {
        return "--> ".concat(this.getType(), " - ").concat(this.getDescription(), " in [").concat(this.getRow(), ", ").concat(this.getColumn(), "]");
    };
    return Exception;
}());
export default Exception;
