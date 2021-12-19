import { Instruction } from "../Abstract/Instruction.js";
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Sin extends Function {

    private expression: any;

    constructor(expression: any, type: string, name: string, params: Array<any>,
        instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);
        this.expression = expression;
    }

    interpret(tree: Tree, table: SymbolTable) {
        let value = this.expression.interpret(tree,table);

        if (value instanceof Exception){
            return value;
        }
        console.log(value);
        console.log(this.expression);
        
        
        if (this.expression.get_type() !== type.INT && this.expression.get_type() !== type.DOUBLE){
            return new Exception("Semantic", `The expression: ${value} can be only type: int|double`, this.expression.row, this.expression.column);
        }

        this.type = type.DOUBLE;
        return Math.sin((value * Math.PI) / 180);
    }

}