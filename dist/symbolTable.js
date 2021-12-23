document.addEventListener('DOMContentLoaded', () => {

    const content = document.getElementById("symbols");
    console.log(content);

    const symbols = JSON.parse(localStorage.getItem("symbol"))
    const functions = JSON.parse(localStorage.getItem("functions"));
    const struct = JSON.parse(localStorage.getItem("structs"));

    let count = 0;
    let s_cont = "";

    struct.forEach(item => {
        count++;
        s_cont += `<tr>
        <td> ${count} </td>
        <td> ${item.id} </td>
        <td> ${item.type} </td>
        <td> ${item.id} </td>
        <td> Global </td>
        <td>  </td>
        <td> ${item.row} </td>
        <td> ${item.column} </td>
        </tr>`;
    });

    functions.forEach(item => {
        count++;
        s_cont += `<tr>
        <td> ${count} </td>
        <td> ${item.name} </td>
        <td> ${item.type === 'void' ? "Procedure" : "Function"} </td>
        <td> ${item.type} </td>
        <td> Global </td>
        <td>  </td>
        <td> ${item.row} </td>
        <td> ${item.column} </td>
        </tr>`;
    });

    symbols.forEach(item => {
        
        if (item._type === 'array'){
            count++;
            s_cont += `<tr>
                <td> ${count} </td>
                <td> ${item._id} </td>
                <td> ${item._type} </td>
                <td> ${item._value !== "null" ? item._value.type_array : "null"} </td>
                <td> ${item._environment} </td>
                <td> ${item._value !== "null" ? JSON.stringify(item._value.value) : item._value} </td>
                <td> ${item._row} </td>
                <td> ${item._column} </td>
            </tr>`
        } else if (item._type === 'struct'){
            count++;
            s_cont += `<tr>
                <td> ${count} </td>
                <td> ${item._id} </td>
                <td> ${item._type} </td>
                <td> ${item._value !== "null" ? item._value.id : "null"} </td>
                <td> ${item._environment} </td>
                <td> ${print_struct(item._value)} </td>
                <td> ${item._row} </td>
                <td> ${item._column} </td>
            </tr>`
        } else {
            count++;
            s_cont += `<tr>
                <td> ${count} </td>
                <td> ${item._id} </td>
                <td> ${item._type} </td>
                <td>  </td>
                <td> ${item._environment} </td>
                <td> ${item._value} </td>
                <td> ${item._row} </td>
                <td> ${item._column} </td>
            </tr>`
        }

    });



    content.innerHTML = s_cont;

});

function print_struct(struct){
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