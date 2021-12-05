import {type, Relational_operator, Logical_operator, Arithmetic_operator} from "./SymbolTable/Type.js"
import { Arithmetic } from "./Expression/Arithmetic.js";
import { Logical } from "./Expression/Logical.js";
import { Relational } from "./Expression/Relational.js";
import { Primitive } from "./Expression/Primitive.js";
import { Identifier } from "./Expression/Identifier.js"

import { Declaration } from "./Instructions/Declaration.js"
import { Assignment } from "./Instructions/Assignment.js"
import { Print } from "./Instructions/Print.js";
import { Inc_Dec } from "./Instructions/Inc_Dec.js";
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
export var grammar = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,10],$V1=[1,11],$V2=[1,12],$V3=[1,13],$V4=[1,14],$V5=[1,15],$V6=[1,16],$V7=[1,17],$V8=[1,18],$V9=[5,14,19,22,25,26,27,28,29,30],$Va=[2,10],$Vb=[1,22],$Vc=[5,12,14,18,19,22,25,26,27,28,29,30],$Vd=[5,12,14,19,22,25,26,27,28,29,30],$Ve=[1,43],$Vf=[1,44],$Vg=[1,36],$Vh=[1,37],$Vi=[1,38],$Vj=[1,39],$Vk=[1,40],$Vl=[1,41],$Vm=[1,45],$Vn=[1,46],$Vo=[1,56],$Vp=[1,57],$Vq=[1,52],$Vr=[1,51],$Vs=[1,53],$Vt=[1,54],$Vu=[1,55],$Vv=[1,58],$Vw=[1,59],$Vx=[1,60],$Vy=[1,61],$Vz=[1,62],$VA=[1,63],$VB=[1,64],$VC=[1,65],$VD=[5,12,14,19,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43],$VE=[5,12,14,19,21,22,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43],$VF=[5,12,14,19,21,22,25,26,27,28,29,30,42,43],$VG=[5,12,14,19,21,22,25,26,27,28,29,30,31,32,36,37,38,39,40,41,42,43];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"instructions":4,"EOF":5,"instruction":6,"declaration":7,"ptcommP":8,"assignment":9,"prod_print":10,"inc_dec":11,"SEMICOLON":12,"type":13,"IDENTIFIER":14,"EQUALSIGN":15,"expression":16,"list_id":17,"COMMASIGN":18,"RPRINT":19,"PARLEFT":20,"PARRIGHT":21,"RPRINTLN":22,"INCSIGN":23,"DECSIGN":24,"RINT":25,"RDOUBLE":26,"RBOOLEAN":27,"RCHAR":28,"RSTRING":29,"RNULL":30,"SUBSIGN":31,"PLUSSIGN":32,"MULTSIGN":33,"DIVSIGN":34,"MODSIGN":35,"EQUALIZATIONSIGN":36,"DIFFSIGN":37,"LESSEQUAL":38,"GREATEREQUAL":39,"SMALLERTHAN":40,"GREATERTHAN":41,"AND":42,"OR":43,"NOT":44,"INTEGER":45,"DOUBLE":46,"STRING":47,"CHAR":48,"boolean":49,"RTRUE":50,"RFALSE":51,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",12:"SEMICOLON",14:"IDENTIFIER",15:"EQUALSIGN",18:"COMMASIGN",19:"RPRINT",20:"PARLEFT",21:"PARRIGHT",22:"RPRINTLN",23:"INCSIGN",24:"DECSIGN",25:"RINT",26:"RDOUBLE",27:"RBOOLEAN",28:"RCHAR",29:"RSTRING",30:"RNULL",31:"SUBSIGN",32:"PLUSSIGN",33:"MULTSIGN",34:"DIVSIGN",35:"MODSIGN",36:"EQUALIZATIONSIGN",37:"DIFFSIGN",38:"LESSEQUAL",39:"GREATEREQUAL",40:"SMALLERTHAN",41:"GREATERTHAN",42:"AND",43:"OR",44:"NOT",45:"INTEGER",46:"DOUBLE",47:"STRING",48:"CHAR",50:"RTRUE",51:"RFALSE"},
productions_: [0,[3,2],[4,2],[4,1],[4,1],[6,2],[6,2],[6,2],[6,2],[8,1],[8,0],[7,4],[7,2],[17,3],[17,1],[9,3],[10,4],[10,4],[11,2],[11,2],[13,1],[13,1],[13,1],[13,1],[13,1],[13,1],[16,2],[16,3],[16,3],[16,3],[16,3],[16,3],[16,2],[16,2],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,2],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,3],[49,1],[49,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

	    return $$[$0-1];
	
break;
case 2:
 $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 3:
 this.$ = [$$[$0]]; 
break;
case 4:
 console.error('Este es un error sintáctico: [' + yytext + '] en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
break;
case 5: case 6: case 7: case 8: case 49:
 this.$ = $$[$0-1]; 
break;
case 11:
 this.$ = new Declaration([$$[$0-2]], $$[$0-3], _$[$0-3].first_line, _$[$0-3].first_column, $$[$0]); 
break;
case 12:
 this.$ = new Declaration($$[$0], $$[$0-1], this._$.first_line, this._$.first_column); 
break;
case 13:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 14:
 this.$ = []; this.$.push($$[$0]); 
break;
case 15:
 this.$ = new Assignment($$[$0-2], $$[$0], this._$.first_line, this._$.first_column); 
break;
case 16:

        this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column, false);
    
break;
case 17:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column)
break;
case 18:
 this.$ = new Inc_Dec(new Arithmetic(new Identifier($$[$0-1], this._$.first_line, this._$.first_column), null, Arithmetic_operator.INC, this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); 
break;
case 19:
 this.$ = new Inc_Dec(new Arithmetic(new Identifier($$[$0-1], this._$.first_line, this._$.first_column), null, Arithmetic_operator.DEC, this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); 
break;
case 20:
 this.$ = type.INT; 
break;
case 21:
 this.$ = type.DOUBLE; 
break;
case 22:
 this.$ = type.BOOL; 
break;
case 23:
 this.$ = type.CHAR; 
break;
case 24:
 this.$ = type.STRING; 
break;
case 25:
 this.$ = type.NULL; 
break;
case 26:
 this.$ = new Arithmetic($$[$0], null, Arithmetic_operator.SUBSTRACTION, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 27:
 this.$ = new Arithmetic($$[$0-2], $$[$0], Arithmetic_operator.ADDITION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 28:
 this.$ = new Arithmetic($$[$0-2], $$[$0], Arithmetic_operator.SUBSTRACTION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 29:
 this.$ = new Arithmetic($$[$0-2], $$[$0], Arithmetic_operator.MULTIPLICATION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 30:
 this.$ = new Arithmetic($$[$0-2], $$[$0], Arithmetic_operator.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 31:
 this.$ = new Arithmetic($$[$0-2], $$[$0], Arithmetic_operator.MODULS, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 32:
 this.$ = new Arithmetic($$[$0-1], null, Arithmetic_operator.INC, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 33:
 this.$ = new Arithmetic($$[$0-1], null, Arithmetic_operator.DEC, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 34:
 this.$ = new Relational($$[$0-2], $$[$0], Relational_operator.EQUAL, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 35:
 this.$ = new Relational($$[$0-2], $$[$0], Relational_operator.UNEQUAL, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 36:
 this.$ = new Relational($$[$0-2], $$[$0], Relational_operator.LESSEQUAL, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 37:
 this.$ = new Relational($$[$0-2], $$[$0], Relational_operator.GREATEREQUAL, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 38:
 this.$ = new Relational($$[$0-2], $$[$0], Relational_operator.LESS, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 39:
 this.$ = new Relational($$[$0-2], $$[$0], Relational_operator.GREATER, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 40:
 this.$ = new Logical($$[$0-2], $$[$0], Logical_operator.AND, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 41:
 this.$ = new Logical($$[$0-2], $$[$0], Logical_operator.OR, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 42:
 this.$ = new Logical($$[$0-1], $$[$01], Logical_operator.NOT, _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 43:
 this.$ = new Primitive($$[$0], type.INT, _$[$0].first_line, _$[$0].first_column); 
break;
case 44:
 this.$ = new Primitive($$[$0], type.DOUBLE, _$[$0].first_line, _$[$0].first_column) 
break;
case 45:
 this.$ = new Primitive($$[$0], type.STRING, _$[$0].first_line, _$[$0].first_column); 
break;
case 46:
 this.$ = new Primitive($$[$0], type.CHAR, _$[$0].first_line, _$[$0].first_column); 
break;
case 47:
 this.$ = new Primitive($$[$0], type.BOOL, _$[$0].first_line, _$[$0].first_column); 
break;
case 48:
 this.$ = new Identifier($$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 50: case 51:
 this.$ = $$[$0]
break;
}
},
table: [{2:[1,4],3:1,4:2,6:3,7:5,9:6,10:7,11:8,13:9,14:$V0,19:$V1,22:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:$V7,30:$V8},{1:[3]},{5:[1,19],6:20,7:5,9:6,10:7,11:8,13:9,14:$V0,19:$V1,22:$V2,25:$V3,26:$V4,27:$V5,28:$V6,29:$V7,30:$V8},o($V9,[2,3]),o($V9,[2,4]),o($V9,$Va,{8:21,12:$Vb}),o($V9,$Va,{8:23,12:$Vb}),o($V9,$Va,{8:24,12:$Vb}),o($V9,$Va,{8:25,12:$Vb}),{14:[1,26],17:27},{15:[1,28],23:[1,29],24:[1,30]},{20:[1,31]},{20:[1,32]},{14:[2,20]},{14:[2,21]},{14:[2,22]},{14:[2,23]},{14:[2,24]},{14:[2,25]},{1:[2,1]},o($V9,[2,2]),o($V9,[2,5]),o($V9,[2,9]),o($V9,[2,6]),o($V9,[2,7]),o($V9,[2,8]),o($Vc,[2,14],{15:[1,33]}),o($Vd,[2,12],{18:[1,34]}),{14:$Ve,16:35,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},o($Vd,[2,18]),o($Vd,[2,19]),{14:$Ve,16:47,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:48,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:49,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:[1,50]},o($Vd,[2,15],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw,38:$Vx,39:$Vy,40:$Vz,41:$VA,42:$VB,43:$VC}),{14:$Ve,16:66,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:67,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},o($VD,[2,43]),o($VD,[2,44]),o($VD,[2,45]),o($VD,[2,46]),o($VD,[2,47]),o($VD,[2,48]),{14:$Ve,16:68,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},o($VD,[2,50]),o($VD,[2,51]),{21:[1,69],23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw,38:$Vx,39:$Vy,40:$Vz,41:$VA,42:$VB,43:$VC},{21:[1,70],23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw,38:$Vx,39:$Vy,40:$Vz,41:$VA,42:$VB,43:$VC},o($Vd,[2,11],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw,38:$Vx,39:$Vy,40:$Vz,41:$VA,42:$VB,43:$VC}),o($Vc,[2,13]),{14:$Ve,16:71,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:72,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:73,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:74,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:75,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},o($VD,[2,32]),o($VD,[2,33]),{14:$Ve,16:76,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:77,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:78,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:79,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:80,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:81,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:82,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},{14:$Ve,16:83,20:$Vf,31:$Vg,44:$Vh,45:$Vi,46:$Vj,47:$Vk,48:$Vl,49:42,50:$Vm,51:$Vn},o($VE,[2,26],{23:$Vo,24:$Vp}),o($VF,[2,42],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw,38:$Vx,39:$Vy,40:$Vz,41:$VA}),{21:[1,84],23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw,38:$Vx,39:$Vy,40:$Vz,41:$VA,42:$VB,43:$VC},o($Vd,[2,16]),o($Vd,[2,17]),o($VG,[2,27],{23:$Vo,24:$Vp,33:$Vs,34:$Vt,35:$Vu}),o($VG,[2,28],{23:$Vo,24:$Vp,33:$Vs,34:$Vt,35:$Vu}),o($VE,[2,29],{23:$Vo,24:$Vp}),o($VE,[2,30],{23:$Vo,24:$Vp}),o($VE,[2,31],{23:$Vo,24:$Vp}),o($VF,[2,34],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu}),o($VF,[2,35],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu}),o($VF,[2,36],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu}),o($VF,[2,37],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu}),o($VF,[2,38],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu}),o($VF,[2,39],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu}),o($VF,[2,40],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw,38:$Vx,39:$Vy,40:$Vz,41:$VA}),o([5,12,14,19,21,22,25,26,27,28,29,30,43],[2,41],{23:$Vo,24:$Vp,31:$Vq,32:$Vr,33:$Vs,34:$Vt,35:$Vu,36:$Vv,37:$Vw,38:$Vx,39:$Vy,40:$Vz,41:$VA,42:$VB}),o($VD,[2,49])],
defaultActions: {13:[2,20],14:[2,21],15:[2,22],16:[2,23],17:[2,24],18:[2,25],19:[2,1]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};


/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:// Spaces Ignored
break;
case 1:// Comment inline
break;
case 2:// Comment multiline
break;
case 3:return 25;
break;
case 4:return 30;
break;
case 5:return 26;
break;
case 6:return 27;
break;
case 7:return 28;
break;
case 8:return 29;
break;
case 9:return 30;
break;
case 10:return 'RIF';
break;
case 11:return 'RELSE';
break;
case 12:return 'RSWITCH';
break;
case 13:return 'RCASE';
break;
case 14:return 'RDEFAULT';
break;
case 15:return 'RWHILE';
break;
case 16:return 'RFOR';
break;
case 17:return 'RDO';
break;
case 18:return 'RIN';
break;
case 19:return 'RSTRUCT';
break;
case 20:return 'RBEGIN';
break;
case 21:return 'REND';
break;
case 22:return 'RBREAK';
break;
case 23:return 'RCONTINUE';
break;
case 24:return 'RRETURN';
break;
case 25:return 'RFUNCTION';
break;
case 26:return 'RVOID';
break;
case 27:return 'RPOW';
break;
case 28:return 'RSQRT';
break;
case 29:return 'RSIN';
break;
case 30:return 'RCOS';
break;
case 31:return 'RTAN';
break;
case 32:return 19;
break;
case 33:return 22;
break;
case 34:return 50;
break;
case 35:return 51;
break;
case 36:return 'TWOPOINTS';
break;
case 37:return 18;
break;
case 38:return 'REPETITIONSIGN';
break;
case 39:return 20;
break;
case 40:return 21;
break;
case 41:return 'COMMA';
break;
case 42:return 'BRACKETLEFT';
break;
case 43:return 'BRACKETRIGHT';
break;
case 44:return 12;
break;
case 45:return 'CURLYLEFT';
break;
case 46:return 'CURLYRIGHT';
break;
case 47:return "INCSIGN";
break;
case 48:return "DECSIGN";
break;
case 49:return 32;
break;
case 50:return 31;
break;
case 51:return 33;
break;
case 52:return 34;
break;
case 53:return 35;
break;
case 54:return 36;
break;
case 55:return 37;
break;
case 56:return 38;
break;
case 57:return 39;
break;
case 58:return 40;
break;
case 59:return 41;
break;
case 60:return 43;
break;
case 61:return 42;
break;
case 62:return 44;
break;
case 63:return "EQUALSIGN";
break;
case 64:
break;
case 65:
break;
case 66: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); 	return 47; 
break;
case 67: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); 	return 48; 
break;
case 68:return 46;
break;
case 69:return 45;
break;
case 70:return 14;
break;
case 71:return 5;
break;
case 72: console.error('Este es un error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column); 
break;
}
},
rules: [/^(?:\s+)/i,/^(?:\/\/.*)/i,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/i,/^(?:int\b)/i,/^(?:null\b)/i,/^(?:double\b)/i,/^(?:boolean\b)/i,/^(?:char\b)/i,/^(?:string\b)/i,/^(?:null\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:switch\b)/i,/^(?:case\b)/i,/^(?:default\b)/i,/^(?:while\b)/i,/^(?:for\b)/i,/^(?:do\b)/i,/^(?:in\b)/i,/^(?:struct\b)/i,/^(?:begin\b)/i,/^(?:end\b)/i,/^(?:break\b)/i,/^(?:continue\b)/i,/^(?:return\b)/i,/^(?:function\b)/i,/^(?:void\b)/i,/^(?:pow\b)/i,/^(?:sqrt\b)/i,/^(?:sin\b)/i,/^(?:cos\b)/i,/^(?:tan\b)/i,/^(?:print\b)/i,/^(?:println\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?::)/i,/^(?:,)/i,/^(?:\^)/i,/^(?:\()/i,/^(?:\))/i,/^(?:,)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:;)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:==)/i,/^(?:!=)/i,/^(?:<=)/i,/^(?:>=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:\|\|)/i,/^(?:&&)/i,/^(?:!)/i,/^(?:=)/i,/^(?:[ \r\t]+)/i,/^(?:\n)/i,/^(?:"[^\"]*")/i,/^(?:'[^']')/i,/^(?:[0-9]+\.[0-9]+\b)/i,/^(?:[0-9]+\b)/i,/^(?:([a-zA-Z])[a-zA-Z0-9_]*)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = grammar;
exports.Parser = grammar.Parser;
exports.parse = function () { return grammar.parse.apply(grammar, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}