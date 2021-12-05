import { Instruction } from "../Abstract/Instruction";
import Exception from "../SymbolTable/Exception";
import SymbolTable from "../SymbolTable/SymbolTable";
import Tree from "../SymbolTable/Tree";
import { Logical_operator, type } from "../SymbolTable/Type";

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
            return left;
        }

        if (this.exp2 != null){

            let right = this.exp2.interpret(tree, table);

            if (right instanceof Exception){
                return right;
            }

            if (this.exp1.get_type() === type.BOOL && this.exp2.get_type() === type.BOOL){
                
                switch(this.operator){
                    case Logical_operator.AND:
                        this.value = String(Boolean(left) && Boolean(right)).toLowerCase();
                        return this.value;
                    case Logical_operator.OR:
                        this.value = String(Boolean(left) || Boolean(right)).toLowerCase();
                        return this.value;
                }

            } else {
                return new Exception("Semantic", "This operators only work whit type boolean", this.row, this.column);
            }

        } else {
            if(this.exp1.get_type() == type.BOOL){
                this.value = String(! Boolean(left)).toLowerCase();
                return this.value;
            } else {
                return new Exception("Semantic", `The type: ${this.exp1.get_type()} does not work whit operator: ${this.operator}`, this.row, this.column);
            }
        }

    }

    get_type(): type{
        return this.type;
    }

    toString(): String{
        return this.value;
    }

}