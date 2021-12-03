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
// @ts-ignore
btnAnalyze.addEventListener('click', function () {
    bufferStream = myCodeMirror.getValue();
    // console.log(bufferStream);
    var main = new Main();
    main.lexicalAnalysis(bufferStream);
});
