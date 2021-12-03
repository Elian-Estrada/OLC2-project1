
export class Main {
    lexicalAnalysis(bufferStream: string) {
        console.log(`Analizando ${bufferStream}`);
        // @ts-ignore
        return grammar.parse(bufferStream);
        // console.log(res);
    }
}