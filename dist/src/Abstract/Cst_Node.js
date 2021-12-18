var Cst_Node = /** @class */ (function () {
    function Cst_Node(value) {
        this.value = value;
        this.childs = [];
    }
    Cst_Node.prototype.set_child = function (child) {
        this.childs = child;
    };
    Cst_Node.prototype.add_child = function (value) {
        this.childs.push(new Cst_Node(value));
    };
    Cst_Node.prototype.add_childs = function (childs) {
        for (var _i = 0, childs_1 = childs; _i < childs_1.length; _i++) {
            var item = childs_1[_i];
            this.childs.push(item);
        }
    };
    Cst_Node.prototype.add_childs_node = function (child) {
        this.childs.push(child);
    };
    Cst_Node.prototype.get_value = function () {
        return String(this.value);
    };
    Cst_Node.prototype.set_value = function (value) {
        this.value = value;
    };
    Cst_Node.prototype.get_childs = function () {
        return this.childs;
    };
    return Cst_Node;
}());
export { Cst_Node };
