// @ts-ignore
import { grammar } from "./grammar.js";
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
