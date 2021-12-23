document.addEventListener('DOMContentLoaded', () => {

    const content = document.getElementById("rule");
    console.log(content);

    let gramatica = JSON.parse(localStorage.getItem("gramatica"))

    if (gramatica === null){
        return "F";
    }
    gramatica = gramatica.reverse();

    let count = 0;
    let s_cont = "";

    gramatica.forEach(item => {
        count++;
        s_cont += `<tr>
            <td> ${count} </td>
            <td> ${item.gram} </td>
            <td> ${item.rule} </td>
        </tr>`
    });

    content.innerHTML = s_cont;

});
