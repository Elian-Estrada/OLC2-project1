export class Cst_Node {

    private childs: Array<any>;
    private value: any;

    constructor(value: any){
        this.value = value;
        this.childs = [];
    }

    set_child(child: any){
        this.childs = child;
    }

    add_child(value: any){
        this.childs.push(new Cst_Node(value));
    }

    add_childs(childs: any){
        for (let item of childs){
            this.childs.push(item);
        }
    }

    add_childs_node(child: any){
        this.childs.push(child);
    }

    get_value(){
        return String(this.value);
    }

    set_value(value: any){
        this.value = value;
    }

    get_childs(){
        return this.childs;
    }

}