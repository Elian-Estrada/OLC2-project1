// @ts-ignore
import { grammar } from "../dist/src/grammar";
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.prototype.lexicalAnalysis = function (bufferStream) {
        console.log("Analizando ".concat(bufferStream));
        // @ts-ignore
        return grammar.parse(bufferStream);
        // console.log(res);
    };
    return Main;
}());
export { Main };
