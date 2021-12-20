import { Cst_Node } from "../Abstract/Cst_Node.js";
import { Instruction } from "../Abstract/Instruction.js";
import { Generator3D } from "../Generator/Generator3D.js";
import Exception from "../SymbolTable/Exception.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";
import { type } from "../SymbolTable/Type.js";

export class Range extends Instruction {

    private id: any;
    private start: any;
    private end: any;
    private type: type;
    private sub_type: type;
    private value: any;

    constructor(id: any, start: any, end: any, row: number, column: number) {
        super(row, column);
        this.id = id; 
        this.start = start;
        this.end = end;
        this.type = type.ARRAY;
        this.sub_type = type.NULL;
    }

    interpret(tree: Tree, table: SymbolTable) {
        
        let id = this.id.interpret(tree, table);
        let value;

        if (id instanceof Exception){
            return id;
        }

        if (this.id.get_type() === type.ARRAY){
            value = id.get_value();
            this.sub_type = id.get_subtype();
        } else {
            return new Exception("Semantic", `This expressión only accepted type: ${type.ARRAY}`, this.id.row, this.id.column);
        }

        if (this.start === "begin" && this.end === "end"){
            value = value.slice(0, value.length);
        } else if(this.start === "begin"){
            let end = this.end.interpret(tree, table);
            
            if (end instanceof Exception){
                return end;
            }

            if (this.end.get_type() !== type.INT){
                return new Exception("Semantic", `The index must be of type: ${type.INT}`, this.end.row, this.end.column);
            }

            end = parseInt(end) + 1;

            if (end > value.length || end < 0){
                return new Exception("Semantic", `The index: ${end} out of range`, this.end.row, this.end.column);
            }

            value = value.slice(0, end);
        } else if (this.end === "end"){
            let start = this.start.interpret(tree, table);

            if (start instanceof Exception){
                return start;
            }

            if (this.start.get_type() !== type.INT){
                return new Exception("Semantic", `The index must be of type: ${type.INT}`, this.start.row, this.start.column);
            }

            start = parseInt(start);

            if (start < 0 || start > value.length){
                return new Exception("Semantic", `The index ${start} out of range`, this.start.row, this.start.colum);
            }

            value = value.slice(start, value.length);
        } else {
            let start = this.start.interpret(tree, table);

            if (start instanceof Exception){
                return start;
            }

            let end = this.end.interpret(tree, table);

            if (end instanceof Exception){
                return end;
            }

            if (this.start.get_type() !== type.INT){
                return new Exception("Semantic", `The index must be of type: ${type.INT}`, this.start.row, this.start.column);
            }

            if (this.end.get_type() !== type.INT){
                return new Exception("Semantic", `The index must be of type: ${type.INT}`, this.end.row, this.end.column);
            }

            start = parseInt(start);

            if (start < 0 || start > value.length){
                return new Exception("Semantic", `The index ${start} out of range`, this.start.row, this.start.colum);
            }

            end = parseInt(end) + 1;

            if (end > value.length || end < 0){
                return new Exception("Semantic", `The index: ${end} out of range`, this.end.row, this.end.column);
            }
            
            value = value.slice(start, end);
            
        }

        this.value = value;
        return this;
    }

    get_value(){
        return this.value;
    }

    get_type(){
        return this.type;
    }

    get_subtype(){
        return this.sub_type;
    }

    compile(table: SymbolTable, generator: Generator3D) {
        
    }

    get_node() {
        let node = new Cst_Node("Range");
        node.add_child(this.id.get_id())
        node.add_child("[");
        if (this.start === "begin"){
            node.add_child("begin");
        } else {
            node.add_childs_node(this.start.get_node());
        }

        node.add_child(":");

        if (this.end === "end"){
            node.add_child("end");
        } else {
            node.add_childs_node(this.end.get_node());
        }

        node.add_child("]");

        return node;
    }

}