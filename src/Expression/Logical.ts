import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { Logical_operator, type } from "../SymbolTable/Type.js";

export class Logical extends Instruction{

    private exp1: any;
    private exp2: any;
    private operator: Logical_operator;
    private type: type;
    private value: String;

    constructor(exp1: any, exp2: any, operator: Logical_operator, row: Number, column: Number) {
        super(row, column);
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.operator = operator;
        this.type = type.BOOL;
        this.value = "";
    }

    interpret(tree: Tree, table: SymbolTable){

        let left = this.exp1.interpret(tree, table);

        if (left instanceof Exception){
        }

        if (this.exp2 != null){

            let right = this.exp2.interpret(tree, table);
            
            if (right instanceof Exception){
                return right;
            }

            if (this.exp1.get_type() === type.BOOL && this.exp2.get_type() === type.BOOL){
                
                switch(this.operator){
                    case Logical_operator.AND:
                        this.value = String(JSON.parse(left) && JSON.parse(right)).toLowerCase();
                        
                        return this.value;
                    case Logical_operator.OR:
                        this.value = String(JSON.parse(left) || JSON.parse(right)).toLowerCase();
                        return this.value;
                }

            } else {
                return new Exception("Semantic", "This operators only work whit type boolean", this.row, this.column);
            }

        } else {
            if(this.exp1.get_type() == type.BOOL){
                this.value = String(! JSON.parse(left)).toLowerCase();
                return this.value;
            } else {
                return new Exception("Semantic", `The type: ${this.exp1.get_type()} does not work whit operator: ${this.operator}`, this.row, this.column);
            }
        }

    }

    get_type(): type{
        return this.type;
    }

    get_node() {
        let node = new Cst_Node("Expression Logic");

        if (this.exp2 !== null){
            node.add_childs_node(this.exp1.get_node());
            node.add_child(this.operator);
            node.add_childs_node(this.exp2.get_node());
        } else {
            node.add_child("!");
            node.add_childs_node(this.exp1.get_node());
        }

        return node;
    }

    toString(): String{
        return String(this.value);
    }

}