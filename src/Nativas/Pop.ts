import { Instruction } from "../Abstract/Instruction.js";
import { Function } from "../Instructions/Function.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";
 
export class Pop extends Function {
    private id: any;

    constructor(id: any, expression: any, type: string, name: string, params: Array<any>,
        instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);
        this.id = id;
    }

    interpret(tree: Tree, table: SymbolTable) {
        
        let symbol = this.id.interpret(tree, table);

        if (symbol instanceof Exception){
            return symbol;
        }

        if (symbol.get_type() !== type.ARRAY){
            return new Exception("Semantic", `This function is only for arrays`, this.id.row, this.id.column, table.get_name());
        }

        this.type = symbol.get_subtype();
        return symbol.get_value().pop();

    }
}