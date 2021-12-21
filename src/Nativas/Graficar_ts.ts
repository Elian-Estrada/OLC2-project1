import { Instruction } from "../Abstract/Instruction.js";
import { Function } from "../Instructions/Function.js";
import SymbolTable from "../SymbolTable/SymbolTable.js";
import Tree from "../SymbolTable/Tree.js";

let count = 0;
export const clear_count = () => {
    count = 0;
    const div_t = document.getElementById("table0");
    //@ts-ignore
    div_t?.innerHTML = "";

}

export class Graficar_ts extends Function {

    constructor(type_fun: string, name: string, params: Array<any>,
        instructions: Array<Instruction>, row: number, col: number) {
        super(type_fun, name, params, instructions, row, col);
    }

    interpret(tree: Tree, table: SymbolTable) {

        const id = document.getElementById("modal1");
        //@ts-ignore
        var instance = M.Modal.getInstance(id);
        const d_table = document.getElementById(`table${count}`);
        count++;

        let coun_variable = 0;

        let content = ``;

        let current_table = table;

        while (current_table !== undefined){
            current_table.get_table_total().forEach(item => {
                if (item.type === 'array'){
                    coun_variable++;
                    content += `<tr>
                        <td> ${coun_variable} </td>
                        <td> ${item.id} </td>
                        <td> ${item.type} </td>
                        <td> ${item.value !== "null" ? item.value.type_array : "null"} </td>
                        <td> ${item.environment} </td>
                        <td> ${item.value !== "null" ? JSON.stringify(item.value.value) : item.value} </td>
                        <td> ${item.row} </td>
                        <td> ${item.column} </td>
                    </tr>`
                } else if (item.type === 'struct'){
                    coun_variable++;
                    content += `<tr>
                        <td> ${coun_variable} </td>
                        <td> ${item.id} </td>
                        <td> ${item.type} </td>
                        <td> ${item.value !== "null" ? item.value.id : "null"} </td>
                        <td> ${item.environment} </td>
                        <td> ${this.print_struct(item.value)} </td>
                        <td> ${item.row} </td>
                        <td> ${item.column} </td>
                    </tr>`
                } else {
                    coun_variable++;
                    content += `<tr>
                        <td> ${coun_variable} </td>
                        <td> ${item.id} </td>
                        <td> ${item.type} </td>
                        <td>  </td>
                        <td> ${item.environment} </td>
                        <td> ${item.value} </td>
                        <td> ${item.row} </td>
                        <td> ${item.column} </td>
                    </tr>`
                }
            })

            //@ts-ignore
            current_table = current_table.get_prev();
        }

        let text = `<h3 style="text-align: center"> Tabla ${count} </h3>
        <table class="striped responsive-table">
            <thead>
                <tr>
                    <th>No. </th>
                    <th> Identifier </th>
                    <th> Type </th>
                    <th> Sub Type </th>
                    <th> Environment </th>
                    <th> Value </th>
                    <th> Row </th>
                    <th> Column </th>
                </tr>
            </thead>
            <tbody>
            ${content}
            </tbody>
        </table>
        <div id="table${count}"></div>`;

        console.log(d_table);


        //@ts-ignore
        d_table?.innerHTML = text;

        instance.open();


    }

    print_struct(struct: any){
        if (struct === "null"){
            return "null";
        }
    
        if (struct.value === "null"){
    
            return `null`
    
        } else {
    
            if (struct.value !== undefined){
                struct = struct.value;
            }
    
            let params = `${struct.id}(`;
            for(let item of struct.attributes){
                if (item.type === 'struct'){
                    params += this.print_struct(item) + ",";
                } else if(item.type === 'array'){
                    
                    params += JSON.stringify(item.value) + ","
                } else {
                    params += item.value + ",";
                }
    
            }
    
            return params.slice(0, params.length - 1) + ")";
    
        }
    
    }
}