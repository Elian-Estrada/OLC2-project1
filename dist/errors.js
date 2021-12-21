document.addEventListener("DOMContentLoaded", () => {

    const lexical = document.getElementById("lerr");
    const sintactic = document.getElementById("sinerr");
    const semantic = document.getElementById("semerr");

    let clex = ``;
    let csin = ``;
    let csem = ``;

    let countlex = 0;
    let countsin = 0;
    let countsem = 0;

    const errors = JSON.parse(localStorage.getItem("errors"));

    errors.forEach(item => {
        switch(item.type){
            case "Lexical":
                countlex++;
                clex += `<tr>
                    <td> ${countlex} </td>
                    <td> ${item.description} </td>
                    <td> ${item.row} </td>
                    <td> ${item.column} </td>
                </tr>`
                break;
            case "Sintactic":
                countsin++;
                csin += `<tr>
                    <td> ${countsin} </td>
                    <td> ${item.description} </td>
                    <td> ${item.row} </td>
                    <td> ${item.column} </td>
                </tr>`
                break;
            case "Semantic":
                countsem++;
                csem += `<tr>
                    <td> ${countsem} </td>
                    <td> ${item.description} </td>
                    <td> ${item.environment} </td>
                    <td> ${item.row} </td>
                    <td> ${item.column} </td>
                </tr>`
                break;
        }
    });

    lexical.innerHTML = clex;
    sintactic.innerHTML = csin;
    semantic.innerHTML = csem;

});