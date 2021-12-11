// @ts-ignore
import { grammar, errors, clean_errors } from "./grammar.js";
import Tree from "./SymbolTable/Tree.js";
import SymbolTable from "./SymbolTable/SymbolTable.js";
import Exception from "./SymbolTable/Exception.js";
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.prototype.lexicalAnalysis = function (bufferStream) {
        //console.log(`Analizando ${bufferStream}`);
        // @ts-ignore
        var instructions;
        clean_errors();
        instructions = grammar.parse(bufferStream);
        // console.log(instructions)
        var tree = new Tree(instructions);
        var global_table = new SymbolTable(undefined, undefined);
        tree.set_global_table(global_table);
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            // @ts-ignore
            // console.log(error);
            tree.get_errors().push(error);
            tree.update_console(error.toString());
        }
        // @ts-ignore
        if (tree.get_instructions() != ';') {
            try {
                for (var _a = 0, _b = tree.get_instructions(); _a < _b.length; _a++) {
                    var instruction = _b[_a];
                    var result = instruction.interpret(tree, global_table);
                    if (result instanceof Exception) {
                        tree.get_errors().push(result);
                        tree.update_console(result.toString());
                    }
                }
            }
            catch (e) {
                return e;
            }
        }
        console.log(tree.get_instructions());
        console.log(tree.get_global_table());
        console.log(tree.get_errors());
        console.log(tree.get_all_structs());
        return tree.get_console();
        // console.log(res);
    };
    return Main;
}());
export { Main };
