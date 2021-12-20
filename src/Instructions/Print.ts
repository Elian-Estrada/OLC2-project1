import {Instruction} from "../Abstract/Instruction.js";
import Tree from "../SymbolTable/Tree.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import {type} from "../SymbolTable/Type.js";
import Exception from "../SymbolTable/Exception.js";
import {Call} from "./Call.js";
import {Generator3D} from "../Generator/Generator3D.js";
import { Cst_Node } from "../Abstract/Cst_Node.js";
import {Identifier} from "../Expression/Identifier.js";
import {Primitive} from "../Expression/Primitive.js";

export class Print extends Instruction {

    compile(table: SymbolTable, generator: Generator3D, tree: Tree) {
        let res = this.expression.compile(table, generator, tree);
        let valueShow = res.value;

        if ( res.get_type() === type.INT ) {
            generator.add_print("d", "int", valueShow);
        }
        else if ( res.get_type() === type.DOUBLE ) {
            generator.add_print("f", "double", valueShow);
        }
        else if ( res.get_type() === type.STRING || res.get_type() === type.CHAR ) {
            this.typeString(valueShow, table, generator);
        }
        else if ( res.get_type() === type.BOOL ) {
            this.typeBoolean(res, generator);
        }
        generator.add_print("c", "char", 10);
    }

    public typeString(value: string, table: SymbolTable, generator: Generator3D) {
        generator.printString();

        let paramTemp1 = generator.addTemp();
        // generator.addAssignment(paramTemp1, "H");

        let paramTemp2 = generator.addTemp();
        generator.addExpression(paramTemp2, 'P', table.get_size(), '+'); // T5 = P + 1;
        generator.addExpression(paramTemp2, paramTemp2, '1', '+');

        generator.setStack(paramTemp2, value);
        generator.newEnv(table.get_size());
        generator.callFunc('printString'); // Mandar a llamar la funcion print

        let temp = generator.addTemp();
        generator.getStack(temp, 'P');
        generator.setEnv(table.get_size());
    }

    public typeBoolean(value: any, generator: Generator3D) {
        let exit_label = generator.newLabel();

        generator.setLabel(value.true_label);
        generator.printTrue();
        generator.addGoTo(exit_label);

        generator.setLabel(value.false_label);
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
        console.log(value);
        
        if ( value instanceof Exception )
            return value;

        /*if ( value === null )
            return new Exception("Semantic", "Error 'void' type not allowed here", this.row, this.column);*/
        
        if ( this.expression.get_type() == type.ARRAY) {
            
            value = JSON.stringify(value.get_value());
            
        } else if(value instanceof Array) {

            value = JSON.stringify(value);

        }else if (this.expression.get_type() === type.STRUCT && value !== "null"){
            
            if (/*this.expression.get_value().value*/ this.expression.get_value() === "null"){
                //value = `${/*this.expression.get_value().struct*/}(null)`;
                value = "null";
            } else {
                
                value = this.print_struct(this.expression.get_value());
                
            }

        } else if(value.type === type.STRUCT){
            value = this.print_struct(value);
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