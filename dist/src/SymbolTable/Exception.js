var Exception = /** @class */ (function () {
    function Exception(type, description, row, column, environment) {
        this.type = type;
        this.description = description;
        this.row = row;
        this.column = column;
        this.environment = environment;
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
    Exception.prototype.getEnvironment = function () {
        return this.environment;
    };
    Exception.prototype.toString = function () {
        return "--> ".concat(this.getType(), " - ").concat(this.getDescription(), " in ").concat(this.getEnvironment(), " on [").concat(this.getRow(), ", ").concat(this.getColumn(), "]");
    };
    return Exception;
}());
export default Exception;
