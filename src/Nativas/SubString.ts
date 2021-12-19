import {Function} from "../Instructions/Function.js";
import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {type} from "../SymbolTable/Type.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";

export class SubString extends Function {

    private id: any;
    private from: number;
    private to: number;

    constructor(id: any, from: number, to: number, type: string, name: string, params: Array<any>,
                instructions: Array<Instruction>, row: number, col: number) {
        super(type, name, params, instructions, row, col);

        this.id = id;
        this.from = from;
        this.to = to;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let id_founded = this.id.interpret(tree, table);
        if ( id_founded === null )
            return new Exception("Semantic", "Identifier not found in the current context", this.row, this.column);

        if ( this.id.get_type() !== type.STRING )
            return new Exception("Semantic", `The type ${id_founded.type} not valid for Length`, this.row, this.column);

        // @ts-ignore
        this.to = parseInt(this.to) + 1;
        
        if (this.to > id_founded.length){
            return new Exception("Semantic", `The index: ${this.to - 1} out of range`, this.row, this.column);
        }

        this.type = type.STRING;
        return id_founded.substring(this.from, this.to);
    }
}