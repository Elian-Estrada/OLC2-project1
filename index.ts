import {Main} from "./src/Main.js";

let btnAnalyze: HTMLElement | null = document.getElementById('btnAnalyze');
let bufferStream: string;

let myCodeMirror: any;

// @ts-ignore
myCodeMirror = CodeMirror.fromTextArea(
    document.getElementById("code"),
    {
        lineNumbers: true,
        styleActivateLine: true,
        matchBrackets: true,
        theme: "moxer",
        mode: "text/x-java",
    }
)

myCodeMirror.setValue("void Main(){\n  return;\n}");

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
    doc.replaceRange(data, pos); // adds a new line
}

// @ts-ignore
btnAnalyze.addEventListener('click', () => {
    codeToAnalyze();
});

window.addEventListener('keydown', (e) => {
    if ( e.ctrlKey && e.key == "Enter" ) {
        codeToAnalyze();
    }
})

function codeToAnalyze() {
    bufferStream = myCodeMirror.getValue();
    // console.log(bufferStream);
    let main = new Main();
    myCodeMirror2.setValue("");
    // @ts-ignore
    let res: string = main.lexicalAnalysis(bufferStream);
    updateCodeMirror(res);
}