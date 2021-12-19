import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Exception from "../SymbolTable/Exception.js";
import {Break} from "./Break.js";
import {Return} from "./Return.js";
import {Continue} from "./Continue.js";
import {type} from "../SymbolTable/Type.js";
import {Cst_Node} from "../Abstract/Cst_Node.js";
import {Generator3D} from "../Generator/Generator3D.js";
import Symbol from "../SymbolTable/Symbol.js";

export class Function extends Instruction {

    private name: string;
    private params: Array<any>;
    private instructions: Array<Instruction>;
    protected type: any;

    constructor(type: string, name: string, params: Array<any>, instructions: Array<Instruction>, row: number, col: number) {
        super(row, col);
        this.instructions = instructions;
        this.name = name;
        this.params = params;
        this.type = type;
    }

    interpret(tree: Tree, table: SymbolTable): any {
        let new_table = new SymbolTable(table, `Function-${this.name}-${this.row}-${this.column}`);

        for ( let param of this.params ) {
            new_table.increment_size();
        }
        
        for ( let instruction of this.instructions ) {
            let value = instruction.interpret(tree, new_table);

            if ( value === "void" )
                return;

            if ( value instanceof Exception ) {
                tree.get_errors().push(value);
                tree.update_console(value.toString());
            }

            let error = null;
            if ( value instanceof Break ) {
                error = new Exception("Semantic", "Instruction Break out of loop", instruction.row, instruction.column);
                tree.get_errors().push(error);
                // tree.get_update(error);
            }

            if ( value instanceof Continue ) {
                // console.log("Hola")
                error = new Exception("Semantic", "Instruction Continue out of loop", instruction.row, instruction.column);
                tree.get_errors().push(error);
            }

            if ( value instanceof Return ) {
                if (this.type == type.VOID) {
                    // console.log("Hola")
                    return new Exception("Semantic", "Function should not return anything", instruction.row, instruction.column);
                }

                if (value.get_type() === type.STRUCT){
                    if (value.get_result().get_id() !== this.type){
                        return new Exception("Semantic", "Function doesn't return same data type", instruction.row, instruction.column);
                    }
                } else {

                    if (this.type != value.get_type()) {
                        return new Exception("Semantic", "Function doesn't return same data type", instruction.row, instruction.column);
                    }
                }
                return value.get_result();
            }
        }

        if (this.type !== type.VOID){
            return new Exception("Semantic", `Function of type: ${this.type} expected one Return`, this.instructions[this.instructions.length - 1].row, this.instructions[this.instructions.length - 1].column);
        }
        
        return null;
    }

    public get_type() {
        return this.type;
    }

    public get_name() {
        return this.name;
    }

    public get_params() {
        return this.params;
    }

    compile(table: SymbolTable, generator: Generator3D, tree: Tree) {
        let new_env = new SymbolTable(table, this.name);
        new_env.type = this.type;
        let return_label = generator.newLabel();
        new_env.return_label = return_label;
        new_env.set_size(1);

        for ( let param of this.params ) {
            let in_heap = ( param.get_type() == type.STRING || param.get_type() == type.STRUCT );
            let new_symbol = new Symbol(param.id, param.type, this.row, this.column, param.value, "", in_heap);
            new_env.set_table(new_symbol);
        }

        generator.freeAllTemps();
        generator.addBeginFunc(this.name, this.type);

        for (let i of this.instructions) {
            i.compile(new_env, generator, tree);
        }

        if ( this.type != null )
            generator.setLabel(return_label);

        generator.addEndFunc();
        generator.freeAllTemps();

        tree.set_symbol_table(new_env);
    }

    get_node() {
        let node = new Cst_Node("Function");

        node.add_child(this.name);
        node.add_child("(");

        let params = new Cst_Node("Parameters");
        let param;
        for(let item of this.params){
            param = new Cst_Node("Parameter");
            switch(item.type){
                case type.ARRAY:
                    param.add_child(item.sub_type);
                    param.add_child("[");
                    param.add_child("]");
                    param.add_child(item.id);
                    break;
                case type.STRUCT:
                    param.add_child(item.struct);
                    param.add_child(item.name);
                    break;
                default:
                    param.add_child(item.type);
                    param.add_child(item.name);
                    break;
            }
            params.add_childs_node(param);
        }

        node.add_childs_node(params);
        node.add_child(")");
        node.add_child("{");

        let instructions = new Cst_Node("Instructions");
        for (let item of this.instructions){
            
            instructions.add_childs_node(item.get_node());
        }

        node.add_childs_node(instructions);
        node.add_child("}");

        return node;
    }
}