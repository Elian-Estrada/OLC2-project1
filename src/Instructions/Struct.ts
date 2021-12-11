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
        
        tree.add_struct(this);

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
                case type.STRUCT:
                    let exist = tree.get_struct(item.struct);
                    if (exist === null){
                        return new Exception("Semantic", `The Struct: ${item.struct} doesn't exist`, item.row, item.column);
                    }
                    item.value = "null";
                    break;
            }
        }

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