import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Generator3D } from "../Generator/Generator3D.js";

export class Parse extends Instruction {

    private data_type: type;
    private exp: any;

    constructor(data_type: type, exp: any, row: number, col: number) {
        super(row, col);

        this.data_type = data_type;
        this.exp = exp;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let value = this.exp.interpret(tree, table);
        if ( this.data_type === type.INT )
            return parseInt(value);

        else if ( this.data_type === type.DOUBLE )
            return parseFloat(value);

        else if ( this.data_type === type.BOOL )
            return (value === "true");

        else if ( this.data_type === type.CHAR ) {
            if (value.length > 1){
                return new Exception("Semantic", `${value} cannot parse to char`, this.exp.row, this.exp.column, table.get_name());
            }
            return value.replace("", '');
        }
        else
            return new Exception("Semantic", "Data type not compatible", this.exp.row, this.exp.column, table.get_name());
    }

    get_type(){
        return this.data_type;
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        let node = new Cst_Node("Parse");
        node.add_child(this.data_type);
        node.add_child("parse");
        node.add_child("(");
        node.add_childs_node(this.exp.get_node());
        node.add_child(")");
        
        return node;
    }
}