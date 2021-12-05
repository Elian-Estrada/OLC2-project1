// @ts-ignore
import { grammar } from "./grammar.js";
import Tree from "./SymbolTable/Tree.js";
import SymbolTable from "./SymbolTable/SymbolTable.js";
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.prototype.lexicalAnalysis = function (bufferStream) {
        console.log("Analizando ".concat(bufferStream));
        // @ts-ignore
        //return grammar.parse(bufferStream);
        var instructions;
        instructions = grammar.parse(bufferStream);
        var tree = new Tree(instructions);
        var global_table = new SymbolTable(undefined, undefined);
        tree.set_global_table(global_table);
        for (var _i = 0, _a = tree.get_instructions(); _i < _a.length; _i++) {
            var instruction = _a[_i];
            instruction.interpret(tree, global_table);
        }
        console.log(tree.get_instructions());
        console.log(tree.get_global_table());
        return tree.get_console();
        // console.log(res);
    };
    return Main;
}());
export { Main };
