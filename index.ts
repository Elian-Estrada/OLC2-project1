import {Main} from "./src/Main.js";

let btnAnalyze: HTMLElement | null = document.getElementById('btnAnalyze');
let btnCompile: HTMLElement | null = document.getElementById('btnCompile');
let bufferStream: string;

let myCodeMirror: any;
let main: Main;

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

myCodeMirror.setValue("void main(){\n  return;\n}");

// @ts-ignore
let myCodeMirror2 = CodeMirror.fromTextArea(
    document.getElementById("pythonConsole"),
    {
        lineNumbers: false,
        theme: "moxer",
        readOnly: true,
    }
);

// @ts-ignore
let myCodeMirror3 = CodeMirror.fromTextArea(
    document.getElementById("pythonConsole2"),
    {
        lineNumbers: false,
        theme: "moxer",
        readOnly: true,
    }
);

function updateCodeMirror(data: string, codeMirror: any){
    let doc = codeMirror.getDoc();
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

window.addEventListener('keydown', (e) => {
    if ( e.ctrlKey && e.shiftKey && e.key == "Enter" ) {
        codeToAnalyze();
        codeToCompile();
    }
});

function codeToAnalyze() {
    bufferStream = myCodeMirror.getValue();
    // console.log(bufferStream);
    main = new Main();
    myCodeMirror2.setValue("");
    // @ts-ignore
    let res: string = main.lexicalAnalysis(bufferStream);
    try {
        updateCodeMirror(res, myCodeMirror2);
    } catch (error) {
        console.log(error);
        
    }
}

function codeToCompile() {
    bufferStream = myCodeMirror.getValue();
    // let main = new Main();
    myCodeMirror3.setValue("");
    let res: string = main.compile(bufferStream);
    updateCodeMirror(res, myCodeMirror3);
    // console.log(res);
}

btnCompile?.addEventListener('click', () => {
    codeToAnalyze();
    codeToCompile();
});