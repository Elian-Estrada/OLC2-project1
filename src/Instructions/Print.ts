import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import {Call} from "./Call.js";
import {Generator3D} from "../Generator/Generator3D.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";

export class Print extends Instruction {

    compile(table: SymbolTable, generator: Generator3D) {

        if ( this.expression.value.length == 1 ) {
            // let value = this.expression.compile(table);
            if ( this.expression.get_type() === type.INT ) {
                generator.add_print("f", "double", this.expression.value);
            }
            else if ( this.expression.get_type() === type.STRING ) {
                this.typeString(this.expression.value, table, generator);
            }
        }
        generator.add_print("c", "char", 10);
    }

    public typeString(value: string, table: SymbolTable, generator: Generator3D) {
        generator.printString();
        generator.addAssignment('P', 0);
        generator.addAssignment('H', 0);

        let paramTemp1 = generator.addTemp();
        generator.addAssignment(paramTemp1, "H");

        generator.setHeap('H', value.charCodeAt(0));
        generator.nextHeap();
        generator.setHeap('H', -1);
        generator.nextHeap();

        let paramTemp2 = generator.addTemp();
        generator.addExpression(paramTemp2, 'P', table.get_size(), '+'); // T5 = P + 1;
        generator.addExpression(paramTemp2, paramTemp2, '1', '+');

        generator.setStack(paramTemp2, paramTemp1);
        generator.newEnv(table.get_size());
        generator.callFunc('printString'); // Mandar a llamar la funcion print

        let temp = generator.addTemp();
        generator.getStack(temp, 'P');
        generator.setEnv(table.get_size());
    }

    private expression: any;
    private flag: boolean;

    constructor(expression: any, row: number, col: number, flag:boolean = true) {
        super(row, col);
        this.expression = expression;
        this.flag = flag;
    }

    public interpret(tree: Tree, table: SymbolTable) {
        if ( this.expression instanceof Call ) {
            // console.log(this.expression)
            // @ts-ignore
            // console.log(this.expression.type)
            // @ts-ignore
            if ( this.expression.type === type.VOID ) {
                return new Exception("Semantic", "Error 'void' type not allowed here", this.row, this.column);
            }
        }
        let value = this.expression.interpret(tree, table);
        //console.log(value);
        
        if ( value instanceof Exception )
            return value;

        /*if ( value === null )
            return new Exception("Semantic", "Error 'void' type not allowed here", this.row, this.column);*/
        
        if ( this.expression.get_type() == type.ARRAY ) {
            
            value = JSON.stringify(value.get_value());
            
        } else if (this.expression.get_type() === type.STRUCT && value !== "null"){
            
            if (this.expression.get_value().value === "null"){
                value = `${this.expression.get_value().struct}(null)`;
            } else {
                
                value = this.print_struct(this.expression.get_value());
                
            }

        }
        else if ( this.expression.get_type() == type.NULL ) {
            return new Exception("Semantic", "Null Pointer Exception", this.row, this.column);
        }

        tree.update_console(`${ value }`, this.flag);
    }

    print_struct(struct: any){

        if (struct.value === "null"){

            return `null`

        } else {

            if (struct.value !== undefined){
                struct = struct.value;
            }

            let params = `${struct.id}(`;
            for(let item of struct.attributes){
                if (item.type === type.STRUCT){
                    params += this.print_struct(item) + ",";
                } else if(item.type === type.ARRAY){
                    
                    params += JSON.stringify(item.value) + ","
                } else {
                    params += item.value + ",";
                }

            }

            return params.slice(0, params.length - 1) + ")";

        }

    }

    get_node() {

        let node;
        
        if (this.flag){
            node = new Cst_Node("Println");
            node.add_child("println")
        } else {
            node = new Cst_Node("Print");
            node.add_child("print");
        }

        node.add_child("(");
        node.add_childs_node(this.expression.get_node());
        node.add_child(")");
        

        return node;
    }
}