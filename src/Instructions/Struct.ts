import { Instruction } from "../Abstract/Instruction.js";
import Exception from "../SymbolTable/Exception.js";
import Symbol from "../SymbolTable/Symbol.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Struct extends Instruction{

    private id: string;
    private attributes: Array<any>;
    private type: type;

    constructor(id: string, attributes: Array<any>, row: number, column: number) {
        super(row, column);
        this.id = id;
        this.attributes = attributes;
        this.type = type.STRUCT;
    }

    interpret(tree: Tree, table: SymbolTable) {
        
        for (let item of this.attributes){
            switch(item.type){
                case type.INT:
                    item.value = 0;
                    break;
                case type.DOUBLE:
                    item.value = 0.0;
                    break;
                case type.CHAR:
                    item.value = "null";
                    break;
                case type.BOOL:
                    item.value = false;
                    break;
                case type.STRING:
                    item.value = "null";
                    break;
            }
        }

        tree.add_struct(this);

        return null;
    }

    get_attributes(){
        return this.attributes;
    }

    get_type(){
        return this.type;
    }

    get_id(){
        return this.id;
    }

}