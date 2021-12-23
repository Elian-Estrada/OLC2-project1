import { Main } from "./src/Main.js";
var btnAnalyze = document.getElementById('btnAnalyze');
var btnCompile = document.getElementById('btnCompile');
var bufferStream;
var myCodeMirror;
var main;
// @ts-ignore
myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    styleActivateLine: true,
    matchBrackets: true,
    theme: "moxer",
    mode: "text/x-java",
});
myCodeMirror.setValue("void main(){\n  return;\n}");
// @ts-ignore
var myCodeMirror2 = CodeMirror.fromTextArea(document.getElementById("pythonConsole"), {
    lineNumbers: false,
    theme: "moxer",
    readOnly: true,
});
// @ts-ignore
var myCodeMirror3 = CodeMirror.fromTextArea(document.getElementById("pythonConsole2"), {
    lineNumbers: false,
    theme: "moxer",
    readOnly: true,
});
function updateCodeMirror(data, codeMirror) {
    var doc = codeMirror.getDoc();
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    var line = doc.getLine(cursor.line); // get the line contents
    var pos = {
        line: cursor.line,
        ch: line.length - 1 // set the character position to the end of the line
    };
    doc.replaceRange(data, pos); // adds a new line
}
// @ts-ignore
btnAnalyze.addEventListener('click', function () {
    codeToAnalyze();
});
window.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key == "Enter") {
        codeToAnalyze();
    }
});
window.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key == "Enter") {
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
    var res = main.lexicalAnalysis(bufferStream);
    try {
        updateCodeMirror(res, myCodeMirror2);
    }
    catch (error) {
        console.log(error);
    }
}
function codeToCompile() {
    bufferStream = myCodeMirror.getValue();
    // let main = new Main();
    myCodeMirror3.setValue("");
    var res = main.compile(bufferStream);
    updateCodeMirror(res, myCodeMirror3);
    // console.log(res);
}
btnCompile === null || btnCompile === void 0 ? void 0 : btnCompile.addEventListener('click', function () {
    codeToAnalyze();
    codeToCompile();
});
