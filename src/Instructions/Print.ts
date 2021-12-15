import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import {Call} from "./Call.js";
import {Generator3D} from "../Generator/Generator3D.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import {Identifier} from "../Expression/Identifier.js";

export class Print extends Instruction {

    compile(table: SymbolTable, generator: Generator3D) {

        let res = this.expression.compile(table, generator);
        let valueShow = res.value;

        if ( res.get_type() === type.INT || res.get_type() === type.DOUBLE ) {
            if ( Object.keys(generator.get_TempsRecover()).length > 0 ) {
                // @ts-ignore
                valueShow = generator.get_TempsRecover().temp;
            }
            generator.add_print("f", "double", valueShow);
        }
        else if ( res.get_type() === type.STRING || res.get_type() === type.CHAR ) {
            this.typeString(valueShow.value, table, generator);
        }
        else if ( res.get_type() === type.BOOL ) {
            this.typeBoolean(valueShow.value, generator);
        }
        generator.add_print("c", "char", 10);
    }

    public typeString(value: string, table: SymbolTable, generator: Generator3D) {
        generator.printString();

        let paramTemp1 = generator.addTemp();
        generator.addAssignment(paramTemp1, "H");

        for ( let item of value ) {
            generator.setHeap('H', item.charCodeAt(0));
            generator.nextHeap();
        }
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

    public typeBoolean(value: boolean, generator: Generator3D) {
        let exit_label = generator.newLabel();
        let true_label = generator.newLabel();
        let false_label = generator.newLabel();

        if ( JSON.parse(String(value)) ) {
            generator.addGoTo(true_label);
        } else {
            generator.addGoTo(false_label);
        }

        generator.setLabel(true_label);
        generator.printTrue();
        generator.addGoTo(exit_label);

        generator.setLabel(false_label);
        generator.printFalse();
        generator.addGoTo(exit_label);

        generator.setLabel(exit_label);
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
                    console.log(item.value);
                    
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