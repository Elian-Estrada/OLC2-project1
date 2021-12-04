import {Main} from "./src/Main.js";
// @ts-ignore
import {grammar} from "./grammar.js";

let btnAnalyze: HTMLElement | null = document.getElementById('btnAnalyze');
let bufferStream: string;

// @ts-ignore
let myCodeMirror = CodeMirror.fromTextArea(
    document.getElementById("code"),
    {
        lineNumbers: true,
        styleActivateLine: true,
        matchBrackets: true,
        theme: "moxer",
        mode: "text/x-java",
    }
);

// @ts-ignore
let myCodeMirror2 = CodeMirror.fromTextArea(
    document.getElementById("pythonConsole"),
    {
        lineNumbers: false,
        theme: "moxer",
        readOnly: true,
    }
);

function updateCodeMirror(data: string){
    let doc = myCodeMirror2.getDoc();
    let cursor = doc.getCursor(); // gets the line number in the cursor position
    let line = doc.getLine(cursor.line); // get the line contents
    let pos = { // create a new object to avoid mutation of the original selection
        line: cursor.line,
        ch: line.length - 1 // set the character position to the end of the line
    }
    doc.replaceRange(data+'\n', pos); // adds a new line
}

// @ts-ignore
btnAnalyze.addEventListener('click', () => {
    bufferStream = myCodeMirror.getValue();
    // console.log(bufferStream);
    let main = new Main();
    // @ts-ignore
    let res: string = grammar.parse("print(3+4);");
    // let res: string = main.lexicalAnalysis(bufferStream);
    updateCodeMirror(res);
});