import { Main } from "./src/Main.js";
var btnAnalyze = document.getElementById('btnAnalyze');
var bufferStream;
// @ts-ignore
var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    styleActivateLine: true,
    matchBrackets: true,
    theme: "moxer",
    mode: "text/x-java",
});
// @ts-ignore
var myCodeMirror2 = CodeMirror.fromTextArea(document.getElementById("pythonConsole"), {
    lineNumbers: false,
    theme: "moxer",
    readOnly: true,
});
function updateCodeMirror(data) {
    var doc = myCodeMirror2.getDoc();
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    var line = doc.getLine(cursor.line); // get the line contents
    var pos = {
        line: cursor.line,
        ch: line.length - 1 // set the character position to the end of the line
    };
    doc.replaceRange(data + '\n', pos); // adds a new line
}
// @ts-ignore
btnAnalyze.addEventListener('click', function () {
    bufferStream = myCodeMirror.getValue();
    // console.log(bufferStream);
    var main = new Main();
    // @ts-ignore
    var res = main.lexicalAnalysis(bufferStream);
    updateCodeMirror(res);
});
