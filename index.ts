import {Main} from "./src/Main.js";

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
      mode: "text/x-csrc",
    }
  );

// @ts-ignore
let myCodeMirror2 = CodeMirror.fromTextArea(
    document.getElementById("pythonConsole"),
    {
      lineNumbers: false,
      theme: "moxer",
      readOnly: false,
      mode: "text",
    }
  );

// @ts-ignore
btnAnalyze.addEventListener('click', () => {
    bufferStream = myCodeMirror.getValue();
    // console.log(bufferStream);
    let main = new Main();
    main.lexicalAnalysis(bufferStream);

    console.log("Que pex :v");
    
});