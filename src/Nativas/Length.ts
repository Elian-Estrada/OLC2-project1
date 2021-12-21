import {Function} from "../Instructions/Function.js";
import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import {type} from "../SymbolTable/Type.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";


export class Length extends Function {

    private id: any;

    constructor(id: any, type_fun: string, name: string, params: Array<any>,
                instructions: Array<Instruction>, row: number, col: number) {
        super(type_fun, name, params, instructions, row, col);
        this.id = id;
    }

    public interpret(tree: Tree, table: SymbolTable): any {
        let id_founded = this.id.interpret(tree, table);
        if ( id_founded === null )
            return new Exception("Semantic", "Identifier not found in the current context", this.row, this.column, table.get_name());
        
        // console.log(this.id.get_type() == type.STRING)
        if ( this.id.get_type() !== type.STRING && this.id.get_type() !== type.ARRAY)
            return new Exception("Semantic", `The type ${id_founded.type} not valid for Length`, this.row, this.column, table.get_name());

        if (this.id.get_type() === type.ARRAY){
            id_founded = id_founded.get_value();
        }

        this.type = type.INT;
        return id_founded.length;
    }
}