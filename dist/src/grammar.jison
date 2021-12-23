

/**
 * Jison Compiler
 */

/* Definición Léxica */
%lex

%options case-sensitive

%%

\s+											// Spaces Ignored
"//".*										// Comment inline
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// Comment multiline

/* ------------------------------------- Reserved Words ------------------------------------- */
/* Data Type Primitive */
"int"               return 'RINT';
"null"              return 'RNULL';
"double"            return 'RDOUBLE';
"boolean"           return 'RBOOLEAN';
"char"              return 'RCHAR';
"String"            return 'RSTRING';

/* Conditional Structures */
"if"                return 'RIF';
"else"              return 'RELSE';
"switch"            return 'RSWITCH';
"case"              return 'RCASE';
"default"           return 'RDEFAULT';

/* Cyclical Structures */
"while"             return 'RWHILE';
"for"               return 'RFOR';
"do"                return 'RDO';
"in"                return 'RIN';

/* Data Structs */
"struct"            return 'RSTRUCT';
"begin"             return 'RBEGIN';
"end"               return 'REND';

/* Transference Structures */
"break"             return 'RBREAK';
"continue"          return 'RCONTINUE';
"return"            return 'RRETURN';

/* Generic and Natives Functions */
"void"              return 'RVOID';
"length"            return 'RLENGTH';
"toUppercase"       return 'RUPPER';
"toLowercase"       return 'RLOWER';
"caracterOfPosition" return 'RCHAROF';
"subString"         return 'RSUBSTRING';
"parse"             return 'RPARSE';
"toInt"				return 'RTOINT';
"toDouble"			return 'RTODOUBLE';
"string"			return 'FSTRING';
"typeof"			return 'RTYPEOF';
"push"				return 'RPUSH';
"pop"				return 'RPOP';
"graficar_ts"		return 'RGRAPH'

/* Language Functions */
"pow"               return 'RPOW';
"sqrt"              return 'RSQRT';
"sin"               return 'RSIN';
"cos"               return 'RCOS';
"tan"               return 'RTAN';
"print"             return 'RPRINT';
"println"           return 'RPRINTLN';
"main"              return 'RMAIN';

/* Boolean's values */
"true"				return 'RTRUE';
"false"				return 'RFALSE';

/* ---------------------------------------- Tokens ---------------------------------------- */
/* Special Characters */´
":"                 return 'TWOPOINTS';
","					return 'COMMASIGN';
"^"                 return 'REPETITIONSIGN';
"#"					return 'COPY';

/* Grouping Signs  */
"("                 return 'PARLEFT';
")"                 return 'PARRIGHT';

/* Arrays Signs */
"."                 return 'DOT';
"["                 return 'BRACKETLEFT';
"]"                 return 'BRACKETRIGHT';

/* Finish and Encapsulation Signs */
";"                 return 'SEMICOLON';
"{"                 return 'CURLYLEFT';
"}"                 return 'CURLYRIGHT';

/* Increment and Decrement */
"++"                return "INCSIGN";
"--"                return "DECSIGN";

/* Arithmetic Operators */
"+"                 return 'PLUSSIGN';
"-"                 return 'SUBSIGN';
"*"                 return 'MULTSIGN';
"/"                 return 'DIVSIGN';
"%"                 return 'MODSIGN';

/* Relational Operators */
"=="                return 'EQUALIZATIONSIGN';
"!="                return 'DIFFSIGN';
"<="                return 'LESSEQUAL';
">="                return 'GREATEREQUAL';
"<"                 return 'SMALLERTHAN';
">"                 return 'GREATERTHAN';

/* Logics Operators */
"||"                return 'OR';
"&&"                return 'AND';
"!"                 return 'NOT';

/* String Operators */
"&"                 return 'CONCAT';

/* Declaration and Assignment */
"="                 return "EQUALSIGN";

/* Ternary Operators */
"?"                 return "VALUEIFTRUE";

/* White Spaces */
[ \r\t]+            {}
\n                  {}

/*\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); 	return 'STRING'; }
"'"[^']"'"				{ yytext = yytext.substr(1, yyleng-2); 	return 'CHAR'; }*/
\"(\\\'|\\\"|\\\\|\\n|\\t|[^\'\\\"\n])*?\"		{
	yytext = yytext.substr(1, yyleng-2);
	yytext = yytext.replace(/\\t/g, '\t');
	yytext = yytext.replace(/\\n/g, '\n');
	yytext = yytext.replace(/\\"/g, '\"');
	yytext = yytext.replace(/\\'/g, "\'");
	yytext = yytext.replace(/\\\\/g, '\\');
	/*yytext = yytext.split("$");
	yytext = new Interpolation(yytext, yylloc.first_line, yylloc.first_column);*/
																return 'STRING';
}
\'(\\\'|\\\"|\\t|\\n|\\\\|[^\'\\\"])?\'			{
	yytext = yytext.substr(1, yyleng-2);
	yytext = yytext.replace(/\\t/g, '\t');
	yytext = yytext.replace(/\\n/g, '\n');
	yytext = yytext.replace(/\\"/g, '\"');
	yytext = yytext.replace(/\\'/g, "\'");
	yytext = yytext.replace(/\\\\/g, '\\');
																return 'CHAR';
}
[0-9]+"."[0-9]+\b                                          		return 'DOUBLE';
[0-9]+\b                                                      	return 'INTEGER';
([a-zA-Z])[a-zA-Z0-9_]*	                                      	return 'IDENTIFIER';

<<EOF>>                 return 'EOF';

.                        { errors.push(new Exception("Lexical", `Lexical error ${yytext}`, yylloc.first_line, yylloc.first_column)); }
/lex

%{
	import {type, Relational_operator, Logical_operator, Arithmetic_operator, String_operator} from "./SymbolTable/Type.js"
    import { Arithmetic } from "./Expression/Arithmetic.js";
	import { Logical } from "./Expression/Logical.js";
	import { Relational } from "./Expression/Relational.js";
	import { Primitive } from "./Expression/Primitive.js";
	import { Identifier } from "./Expression/Identifier.js";
	import { StringText } from "./Expression/StringText.js";
	import { Ternary } from "./Expression/Ternary.js";
	import { Values_array } from "./Expression/Values_array.js";
	import { Access_array } from "./Expression/Access_array.js";
	import { Access_struct } from "./Expression/Access_struct.js";
	import { Range } from "./Expression/Range.js";
	import { Interpolation } from "./Expression/Interpolation.js"

	import { Declaration } from "./Instructions/Declaration.js";
	import { Declaration_array } from "./Instructions/Declaration_array.js";
	import { Assignment } from "./Instructions/Assignment.js";
	import { Print } from "./Instructions/Print.js";
	import { Inc_Dec } from "./Instructions/Inc_Dec.js";
	import { If } from "./Instructions/If.js";
	import { While } from "./Instructions/While.js";
	import { Switch } from "./Instructions/Switch.js";
	import { Case } from "./Instructions/Case.js";
	import { Break } from "./Instructions/Break.js";
	import { Return } from "./Instructions/Return.js";
	import { Continue } from "./Instructions/Continue.js";
	import { For } from "./Instructions/For.js";
	import { ForIn } from "./Instructions/ForIn.js";
	import { DoWhile } from "./Instructions/DoWhile.js";
	import { Function } from "./Instructions/Function.js";
	import { Call } from "./Instructions/Call.js";
	import Exception from "./SymbolTable/Exception.js";
	import {MainInstruction} from "./Instructions/MainInstruction.js";
	import { Struct } from "./Instructions/Struct.js";
	
	import { Length } from "./Nativas/Length.js";
	import { ToUpperCase } from "./Nativas/ToUpperCase.js";
	import { ToLowerCase } from "./Nativas/ToLowerCase.js";
	import { CaracterOfPosition } from "./Nativas/CaracterOfPosition.js";
	import { SubString } from "./Nativas/SubString.js";
	import { Parse } from "./Nativas/Parse.js";
	import { ToInt } from "./Nativas/ToInt.js";
	import { ToDouble } from "./Nativas/ToDouble.js";
	import { String } from "./Nativas/String.js";
	import { TypeOf } from "./Nativas/TypeOf.js";
	import { Pow } from "./Nativas/Pow.js";
	import { Sin } from "./Nativas/Sin.js";
	import { Cos } from "./Nativas/Cos.js";
	import { Tan } from "./Nativas/Tan.js";
	import { Sqrt } from "./Nativas/Sqrt.js";
	import { Push } from "./Nativas/Push.js";
	import { Pop } from "./Nativas/Pop.js";
	import { Graficar_ts } from "./Nativas/Graficar_ts.js";
%}

%{
    let errors = [];
	function clean_errors(){
		errors = [];
	}

	let grammatical = [];

	function clean_gramatical() {
		grammatical = [];
	}
%}

/* Operators Precedence */
%left 'OR'
%left 'AND'
%right UNOT
%left 'EQUALIZATIONSIGN' 'DIFFSIGN' 'LESSEQUAL' 'GREATEREQUAL' 'SMALLERTHAN' 'GREATERTHAN', 'VALUEIFTRUE'
%left 'PLUSSIGN' 'SUBSIGN', 'CONCAT', 'REPETITIONSIGN'
%left 'MULTSIGN' 'DIVSIGN' 'MODSIGN'
%right UMENOS
%right 'INCSIGN' 'DECSIGN'
%right 'FCAST'
%left 'FSTRING'

%start ini

%% /* Grammar Definition */

ini
	: instructions EOF {
		grammatical.push({gram: "&ltini&gt ::= &ltinstructions&gt EOF", rule: "ini.val = instructions.list"});
	    return $1;
	}
;

instructions
	: instructions instruction          { 
		grammatical.push({gram: "&ltinstructions&gt ::= &ltinstructions&gt &ltinstruction&gt", rule: "instructions.list = add(instructions1.list, instruction.val)"});
		$1.push($2); $$ = $1; 
	}
	| instruction                       { 
		grammatical.push({gram: "&ltinstructions&gt ::= &ltinstruction&gt", rule: "instructions.list = [instruction.val]"});
		if($1 === null) { $$ = []; } else { $$ = [$1]; } 
	}
;

instruction
    : declaration ptcommP 		{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltdeclaration&gt &ltptcommP&gt", rule: "instruction.val = declaration.val"});
		$$ = $1; 
	}
	| assignment ptcommP		{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltassignment&gt &ltptcommP&gt", rule: "instruction.val = assignment.val"});
		$$ = $1; 
	}
	| declaration_array ptcommP { 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltdeclaration_array&gt &ltptcommP&gt", rule: "instruction.val = declaration_array.val"});
		$$ = $1; 
	}
	| assignment_array ptcommP	{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltassignment_array&gt &ltptcommP&gt", rule: "instruction.val = assignment_array.val"});
		$$ = $1; 
	}
	| prod_print ptcommP 		{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltprod_print&gt &ltptcommP&gt", rule: "instruction.val = prod_print.val"});
		$$ = $1; 
	}
	| inc_dec ptcommP			{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltinc_dec&gt &ltptcommP&gt", rule: "instruction.val = inc_dec.val"});
		$$ = $1; 
	}
	| prod_if                   { 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltprod_if&gt", rule: "instruction.val = prod_if.val"});
		$$ = $1; 
	}
	| prod_loops                { 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltprod_loops&gt", rule: "instruction.val = prod_loops.val"});
		$$ = $1; 
	}
	| prod_switch               { 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltprod_switch&gt", rule: "instruction.val = switch.val"});
		$$ = $1; 
	}
	| transfer_prod ptcommP     { 
		grammatical.push({gram: "&ltinstruction&gt ::= &lttransfer_prod&gt &ltptcommP&gt", rule: "instruction.val = transfer_prod.val"});
		$$ = $1; 
	}
	| prod_ternary ptcommP      { 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltprod_ternary&gt &ltptcommP&gt", rule: "instruction.val = prod_ternary.val"});
		$$ = $1; 
	}
	| functions                 { 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltfunctions&gt", rule: "instruction.val = functions.val"});
		$$ = $1; 
	}
	| call_function ptcommP     { 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltcall_function&gt &ltptcommP&gt", rule: "instruction.val = call_function.val"});
		$$ = $1; 
	}
	| struct ptcommP			{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltstruct&gt &ltptcommP&gt", rule: "instruction.val = struct.val"});
		$$ = $1; 
	}
	| native_strings ptcommP    { 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltnative_strings&gt &ltptcommP&gt", rule: "instruction.val = native_strings.val"});
		$$ = $1; 
	}
	| native_function ptcommP   { 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltnative_function&gt &ltptcommP&gt", rule: "instruction.val = native_function.val"});
		$$ = $1; 
	}
	| native_array_push ptcommP	{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltnative_array_push&gt &ltptcommP&gt", rule: "instruction.val = native_array_push.val"});
		$$ = $1; 
	}
	| native_array_pop ptcommP	{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltnative_array_pop&gt &ltptcommP&gt", rule: "instruction.val = native_array_pop.val"});
		$$ = $1; 
	}
	| native_ts	ptcommP			{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltnative_ts&gt &ltptcommP&gt", rule: "instruction.val = native_ts.val"});
		$$ = $1; 
	}
	| assignment_struct ptcommP	{ 
		grammatical.push({gram: "&ltinstruction&gt ::= &ltassignment_struct&gt &ltptcommP&gt", rule: "instruction.val = assignment_struct.val"});
		$$ = $1; 
	}
	| error SEMICOLON           {
		errors.push(new Exception("Sintactic", `Sintactic error ${yytext}`, this._$.first_line, this._$.first_column));
		$$ = null;
	}
;

ptcommP
	: SEMICOLON		{
		grammatical.push({gram: "&ltptcommP&gt ::= ';'", rule: "ptcommP.val = ;"});
		$$ = $1;
	}
;

declaration
	: type IDENTIFIER EQUALSIGN expression			{ 
		grammatical.push({gram: "&ltdeclaration&gt ::= &lttype&gt identifier '=' &ltexpression&gt", rule: "declaration.val = new Declaration(type.val, identifier.lexval, expression.val)"});
		$$ = new Declaration([$2], $1, @1.first_line, @1.first_column, $4); 
	}
	| type list_id									{ 
		grammatical.push({gram: "&ltdeclaration&gt ::= &lttype&gt &ltlist_id&gt", rule: "declaration.val = new Declaration(type.val, list_id.list)"});
		$$ = new Declaration($2, $1, this._$.first_line, this._$.first_column); 
	}
	| IDENTIFIER IDENTIFIER EQUALSIGN expression	{ 
		grammatical.push({gram: "&ltdeclaration&gt ::= identifier identifier '=' &ltexpression&gt", rule: "declaration.val = new Declaration(identifier1.lexval, identifier2.lexval, expression.val)"});
		$$ = new Declaration([$2, $1], type.STRUCT, this._$.first_line, this._$.first_column, $4); 
	}
;

list_id
	: list_id COMMASIGN IDENTIFIER	{ 
		grammatical.push({gram: "&ltlist_id&gt ::= &ltlist_id&gt ',' identifier", rule: "list_id.list = add(list_id1.list, identifier.lexval)"});
		$$ = $1; $$.push($3); 
	}
	| IDENTIFIER					{ 
		grammatical.push({gram: "&ltlist_id&gt ::= identifier", rule: "list_id.list = [identifier.lexval]"});
		$$ = []; $$.push($1); 
	}
;

assignment
	: IDENTIFIER EQUALSIGN expression 	{ 
		grammatical.push({gram: "&ltassignment&gt ::= identifier '=' &ltexpression&gt", rule: "assignment.val = new Assignmt(identifier.lexval, expression.val)"});
		$$ = new Assignment($1, $3, this._$.first_line, this._$.first_column); 
	}
	| IDENTIFIER EQUALSIGN values_array	{ 
		grammatical.push({gram: "&ltassignment&gt ::= identifier '=' &ltvalues_array&gt", rule: "assignment.val = new Assignmt(identifier.lexval, values_array.list)"});
		$$ = new Assignment($1, new Values_array($3, this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); 
	}
;

declaration_array
	: type BRACKETLEFT BRACKETRIGHT IDENTIFIER EQUALSIGN values_array		{ 
		grammatical.push({gram: "&ltdeclaration_array&gt ::= &lttype&gt '[' ']' identifier '=' &ltvalues_array&gt", rule: "declaration_array.val = new Declaration_array(type.val, identifier1.lexval, values_array.list)"});
		$$ = new Declaration_array($4, $1, null, $6, this._$.first_line, this._$.first_column); 
	}
	| type BRACKETLEFT BRACKETRIGHT IDENTIFIER EQUALSIGN IDENTIFIER			{ 
		grammatical.push({gram: "&ltdeclaration_array&gt ::= &lttype&gt '[' ']' identifier '=' identifier", rule: "declaration_array.val = new Declaration_array(type.val, identifier1.lexval, identifier2.lexval)"});
		$$ = new Declaration_array($4, $1, new Identifier($6, this._$.first_line, this._$.first_column), [], this._$.first_line, this._$.first_column); 
	}
	| type BRACKETLEFT BRACKETRIGHT IDENTIFIER EQUALSIGN COPY IDENTIFIER	{ 
		grammatical.push({gram: "&ltdeclaration_array&gt ::= &lttype&gt '[' ']' identifier '=' '#' identifier", rule: "declaration_array.val = new Declaration_array(type.val, identifier1.lexval, identifier2.lexval)"});
		$$ = new Declaration_array($4, $1, new Identifier($7, this._$.first_line, this._$.first_column), [], this._$.first_line, this._$.first_column, false); 
	}
;

values_array
	: BRACKETLEFT list_values_array BRACKETRIGHT	{ 
		grammatical.push({gram: "&ltvalues_array&gt ::= '[' &ltlist_values_array&gt ']'", rule: "values_array.list = list_values_array.list"});
		$$ = $2; 
	}
	| BRACKETLEFT BRACKETRIGHT						{ 
		grammatical.push({gram: "&ltvalues_array&gt ::= '[' ']'", rule: "values_array.list = []"});
		$$ = []; 
	}
;

list_values_array
	: list_values_array COMMASIGN values	{ 
		grammatical.push({gram: "&ltlist_values_array&gt ::= &ltlist_values_array&gt ',' &ltvalues&gt", rule: "list_values_array.list = add(list_values_array1.list, values.val)"});
		$1.push($3); $$ = $1;
	}
	| values								{ 
		grammatical.push({gram: "&ltlist_values_array&gt ::= &ltvalues&gt", rule: "list_values_array.list = [values.val]"});
		$$ = [$1]; 
	}
;

values
	: expression		{ 
		grammatical.push({gram: "&ltvalues&gt ::= &ltexpression&gt", rule: "values.val = expression.val"});
		$$ = $1; 
	}
	| values_array		{ 
		grammatical.push({gram: "&ltvalues&gt ::= &ltvalues_array&gt", rule: "values.val = values_array.list"});
		$$ = $1; 
	}
;

assignment_array
	: IDENTIFIER list_brackets EQUALSIGN expression 	{ 
		grammatical.push({gram: "&ltassignment_array&gt ::= identifier &ltlist_brackets&gt '=' &ltexpression&gt", rule: "assignment_array.val = new accessArra(identifier.lexval, list_bracktes.list, expression.val)"});
		$$ = new Access_array(new Identifier($1, this._$.first_line, this._$.first_column), $2, $4, this._$.first_line, this._$.first_column); 
	}
;

list_brackets
	: list_brackets brackets				{ 
		grammatical.push({gram: "&ltlist_brackets&gt ::= &ltlist_brackets&gt &ltbrackets&gt", rule: "list_brackets.list = add(list_brackets1.list, brackets.val)"});
		$1.push($2); $$ = $1; 
	}
	| brackets								{ 
		grammatical.push({gram: "&ltlist_brackets&gt ::= &ltbrackets&gt", rule: "list_brackets.list = [brackets.val]"});
		$$ = [$1]; 
	}
;

brackets
	: BRACKETLEFT expression BRACKETRIGHT	{ 
		grammatical.push({gram: "&ltbrackets&gt ::= '[' &ltexpression&gt ']'", rule: "bracktes.val = expression.val"});
		$$ = $2; 
	}
;

range
	: IDENTIFIER BRACKETLEFT expression_range TWOPOINTS expression_range BRACKETRIGHT {
		grammatical.push({gram: "&ltrange&gt ::= identifier '[' &ltexpression_range&gt ':' &ltexpression_range&gt ']'", rule: "range.val = new Range(identifier.lexval, expression_range1.val, expression_range2.val)"});
		$$ = new Range(new Identifier($1, this._$.first_line, this._$.first_column), $3, $5, this._$.first_line, this._$.first_column);
	}
;

expression_range
	: expression		{ 
		grammatical.push({gram: "&ltexpression_range&gt ::= &ltexpression&gt", rule: "expression_range.val = expression.val"});
		$$ = $1 
	}
	| RBEGIN			{ 
		grammatical.push({gram: "&ltexpression_range&gt ::= 'begin'", rule: "expression_range.val = begin"});
		$$ = $1 
	}
	| REND				{ 
		grammatical.push({gram: "&ltexpression_range&gt ::= 'end'", rule: "expression_range.val = end"});
		$$ = $1 
	}
;

prod_print
    : RPRINT PARLEFT list_values_array PARRIGHT {
		grammatical.push({gram: "&ltprod_print&gt ::= 'print' '(' &ltlist_values_array&gt ')'", rule: "prod_print.val = new Print(list_values_array.list)"});
        $$ = new Print($3, @1.first_line, @1.first_column, false);
    }
	| RPRINTLN PARLEFT list_values_array PARRIGHT { 
		grammatical.push({gram: "&ltprod_print&gt ::= 'println' '(' &ltlist_values_array&gt ')'", rule: "prod_print.val = new Print(list_values_array.list)"});	
		$$ = new Print($3, @1.first_line, @1.first_column); 
	}
;

inc_dec
	: IDENTIFIER INCSIGN		{ 
		grammatical.push({gram: "&ltinc_dec&gt ::= identifier '++'", rule: "inc_dec.val = identifier.lexval ++"});
		$$ = new Inc_Dec(new Arithmetic(new Identifier($1, this._$.first_line, this._$.first_column), null, Arithmetic_operator.INC, this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); 
	}
	| IDENTIFIER DECSIGN		{ 
		grammatical.push({gram: "&ltinc_dec&gt ::= identifier '--'", rule: "inc_dec.val = identifier.lexval --"});
		$$ = new Inc_Dec(new Arithmetic(new Identifier($1, this._$.first_line, this._$.first_column), null, Arithmetic_operator.DEC, this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); 
	}
;

/* Prods about if */
prod_if
    : RIF PARLEFT expression PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltprod_if&gt ::= 'if' '(' &ltexpression&gt ')' '{' &ltinstructions&gt '}'", rule: "prod_if.val = new If(expression.val, instrucctions1.list)"});
        $$ = new If($3, $6, null, null, @1.first_line, @1.first_column);
    }
    | RIF PARLEFT expression PARRIGHT CURLYLEFT instructions CURLYRIGHT RELSE CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltprod_if&gt ::= 'if' '(' &ltexpression&gt ')' '{' &ltinstructions&gt '}' 'else' '{' &ltinstructions&gt '}'", rule: "prod_if.val = new If(expression.val, instrucctions1.list, instructions2.list)"});
        $$ = new If($3, $6, $10, null, @1.first_line, @1.first_column);
    }
    | RIF PARLEFT expression PARRIGHT CURLYLEFT instructions CURLYRIGHT RELSE prod_if {
		grammatical.push({gram: "&ltprod_if&gt ::= 'if' '(' &ltexpression&gt ')' '{' &ltinstructions&gt '}' 'else' &ltprod_if&gt", rule: "prod_if.val = new If(expression.val, instrucctions1.list, prod_if1.val)"});
        $$ = new If($3, $6, null, $9, @1.first_line, @1.first_column);
    }
    | RIF PARLEFT expression PARRIGHT instruction {
		grammatical.push({gram: "&ltprod_if&gt ::= 'if' '(' &ltexpression&gt ')' &ltinstruction&gt ", rule: "prod_if.val = new If(expression.val, instrucction.list)"});
        $$ = new If($3, [$5], null, null, @1.first_line, @1.first_column);
    }
;

/* Loops Prods */
prod_loops
    : prod_while    { 
		grammatical.push({gram: "&ltprod_loops&gt ::= &ltprod_while&gt", rule: "prod_loops.val = prod_while.val"});
		$$ = $1; 
	}
    | for_prod      { 
		grammatical.push({gram: "&ltprod_loops&gt ::= &ltfor_prod&gt", rule: "prod_loops.val = for_prod.val"});
		$$ = $1; 
	}
    | do_prod     	{ 
		grammatical.push({gram: "&ltprod_loops&gt ::= &ltdo_prod&gt", rule: "prod_loops.val = do_prod.val"});
		$$ = $1; 
	}
;

/* Prods about While */
prod_while
    : RWHILE PARLEFT expression PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltprod_while&gt ::= 'while' '(' &ltexpression&gt ')' '{' &ltinstructions '}'", rule: "prod_while.val = new While(expression.val, instructions.list)"});
        $$ = new While($3, $6, @1.first_line, @1.first_column);
    }
;

/* Prods about do */
do_prod
    : RDO CURLYLEFT instructions CURLYRIGHT RWHILE PARLEFT expression PARRIGHT ptcommP {
		grammatical.push({gram: "&ltdo_prod&gt ::= 'do' '{' &ltinstructions&gt '}' 'while' '(' &ltexpression&gt ')' &ltptcommP&gt", rule: "do_prod.val = new Do(instructions.list, expression.val)"});
        $$ = new DoWhile($7, $3, @1.first_line, @1.first_column);
    }
;

/* Prods about Switch */
prod_switch
    : RSWITCH PARLEFT expression PARRIGHT CURLYLEFT prod_default CURLYRIGHT {
		grammatical.push({gram: "&ltprod_switch&gt ::= 'switch' '(' &ltexpression&gt ')' '{' &ltprod_default&gt '}'", rule: "prod_switch.val = new Switch(expression.val, prod_default.list)"});
        $$ = new Switch($3, null, $6, @1.first_line, @1.first_column);
    }
    | RSWITCH PARLEFT expression PARRIGHT CURLYLEFT list_cases CURLYRIGHT {
		grammatical.push({gram: "&ltprod_switch&gt ::= 'switch' '(' &ltexpression&gt ')' '{' &ltlist_cases&gt '}'", rule: "prod_switch.val = new Switch(expression.val, list_cases.list)"});
            $$ = new Switch($3, $6, null, @1.first_line, @1.first_column);
    }
    | RSWITCH PARLEFT expression PARRIGHT CURLYLEFT list_cases prod_default CURLYRIGHT {
		grammatical.push({gram: "&ltprod_switch&gt ::= 'switch' '(' &ltexpression&gt ')' '{' &ltlist_cases&gt &ltprod_default&gt '}'", rule: "prod_switch.val = new Switch(expression.val, list_cases.list, prod_default.list)"});
            $$ = new Switch($3, $6, $7, @1.first_line, @1.first_column);
    }
;

prod_default
    : RDEFAULT TWOPOINTS instructions { 
		grammatical.push({gram: "&ltprod_default&gt ::= 'default' ':' &ltinstructions&gt", rule: "prod_default.list = instructions.list"});
		$$ = $3; 
	}
;

list_cases
    : list_cases case { 
		grammatical.push({gram: "&ltlist_cases&gt ::= &ltlist_cases&gt &ltcase&gt", rule: "list_cases.list = add(list_cases1.list, case.val)"});
		($2 != null) ? $1.push($2) : null; $$ = $1; 
	}
    | case { 
		grammatical.push({gram: "&ltlist_cases&gt ::= &ltcase&gt", rule: "list_case.list = [case.val]"});
		$$ = ($1 == null) ? [] : [$1] 
	}
;

case
    : RCASE expression TWOPOINTS instructions {
		grammatical.push({gram: "&ltcase&gt ::= 'case' &ltexpression&gt ':' &ltinstructions&gt", rule: "case.val = new Case(expression.val, insturctions.list)"});
        $$ = new Case($2, $4, @1.first_line, @1.first_column);
    }
;

/* Transfer Structures Prods */
transfer_prod
    : RBREAK                   {
		grammatical.push({gram: "&lttransfer_prod&gt ::= 'break'", rule: "transfer_prod.val = new Break()"}); 
		$$ = new Break(@1.first_line, @1.first_column); 
	}
    | RRETURN expression       {
		grammatical.push({gram: "&lttransfer_prod&gt 'return'::= ", rule: "transfer_prod.val = new Return(expression.val)"}); 
		$$ = new Return($2, @1.first_line, @1.first_column); 
	}
    | RRETURN                  {
		grammatical.push({gram: "&lttransfer_prod&gt ::= 'return'", rule: "transfer_prod.val = new Return()"}); 
		$$ = new Return(null, @1.first_line, @1.first_column); 
	}
    | RCONTINUE                {
		grammatical.push({gram: "&lttransfer_prod&gt ::= 'continue'", rule: "transfer_prod.val = new Continue();"}); 
		$$ = new Continue(@1.first_line, @1.first_column); 
	}
;

/* Prods about For */
for_prod
    : for_it                    { 
		grammatical.push({gram: "&ltfor_prod&gt ::= &ltfor_it&gt", rule: "for_prod.val = for_it.val"});
		$$ = $1; 
	}
    | for_in                    { 
		grammatical.push({gram: "&ltfor_prod&gt ::= &ltfor_in&gt", rule: "for_prod.val = for_in.val"});
		$$ = $1; 
	}
;

for_it
    : RFOR PARLEFT for_init SEMICOLON expression SEMICOLON for_step PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltfor_it&gt ::= 'for' '(' &ltfor_init&gt ';' &ltexpression&gt ';' &ltfor_step&gt ')' '{' &ltinstructions&gt '}'",
		rule: "fro_it.val = new For(for_init.val, expression.val, for_step.val, instructions.list)"});
        $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column);
    }
;

for_in
    : RFOR IDENTIFIER RIN expression CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltfor_in&gt ::= 'for' identifier 'in' &ltexpression&gt '{' &ltinstructions&gt '}'", rule: "for_in.val = new Forin(identifier.lexval, expression.val, instructions.list)"});
        $$ = new ForIn($2, $4, $6, @1.first_line, @1.first_column);
    }
	| RFOR IDENTIFIER RIN values_array CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltfor_in&gt ::= 'for' identifier 'in' &ltvalues_array&gt '{' &ltinstructions&gt '}'", rule: "for_in.val = new Forin(identifier.lexval, values_array.list, instructions.list)"});
		$$ = new ForIn($2, new Values_array($4, this._$.first_line, this._$.first_column), $6, this._$.first_line, this._$.first_column);
	}
;

for_init
    : declaration   { 
		grammatical.push({gram: "&ltfor_init&gt ::= &ltdeclaration&gt", rule: "for_init.val = declaration.val"});
		$$ = $1; 
	}
    | assignment    { 
		grammatical.push({gram: "&ltfor_init&gt ::= &ltassignment&gt", rule: "for_init.val = assignment.val"});
		$$ = $1; 
	}
;

for_step
    : inc_dec       { 
		grammatical.push({gram: "&ltfor_step&gt ::= &ltinc_dec&gt", rule: "for_step.val = inc_dec.val"});
		$$ = $1; 
	}
    | assignment    { 
		grammatical.push({gram: "&ltfor_step&gt ::= &ltassignment&gt", rule: "for_step.val = assignment.val"});
		$$ = $1; 
	}
;

/* Ternary Prod */
prod_ternary
    : PARLEFT expression PARRIGHT VALUEIFTRUE expression TWOPOINTS expression {
		grammatical.push({gram: "&ltprod_ternary&gt ::= '(' &ltexpression&gt ')' '?' &ltexpression&gt ':' &ltexpression&gt", rule: "prod_ternary.val = new Ternary(expression1.val, expression2.val, expression3.val)"});
        $$ = new Ternary($2, $5, $7, @1.first_line, @1.first_column);
    }
;

/* Prods about Functions and Calls to Functions */
functions
    : function_main     { 
		grammatical.push({gram: "&ltfunctions&gt ::= &ltfunctions_main&gt", rule: "functions.val = functions_main.val"});
		$$ = $1; 
	}
    | function_general  { 
		grammatical.push({gram: "&ltfunctions&gt ::= &ltfunctions_general&gt", rule: "functions.val = functions_general.val"});
		$$ = $1; 
	}
;

function_main
    : RVOID RMAIN PARLEFT PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltfunction_main&gt ::= 'void' 'main' '(' ')' '{' &ltinstructions&gt '}'", rule: "function_main.val = new Main(instructions.list)"});
        $$ = new MainInstruction($6, @1.first_line, @1.first_column);
    }
;

function_general
    : type IDENTIFIER PARLEFT PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltfunction_general&gt ::= &lttype&gt identifier '(' ')' '{' &ltinstructions&gt '}'", rule: "function_general.val = new Function(type.val, identifier.lexvla, instructins.list)"});
        $$ = new Function($1, $2, [], $6, @1.first_line, @1.first_column);
    }
    | type IDENTIFIER PARLEFT list_params PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltfunction_general&gt ::= &lttype&gt identifier '(' &ltlist_params&gt ')' '{' &ltinstructions&gt '}'", rule: "function_general.val = new Function(type.val, identifier.lexvla, list_params.list, instructins.list)"});
        $$ = new Function($1, $2, $4, $7, @1.first_line, @1.first_column);
    }
	| IDENTIFIER IDENTIFIER PARLEFT PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltfunction_general&gt ::= identifier identifier '(' ')' '{' &ltinstructions&gt '}'", rule: "function_general.val = new Function(identifier1.val, identifier2.val, instruccions.list)"});
		$$ = new Function($1, $2, [], $7, this._$.first_line, this._$.first_column);
	}
	| IDENTIFIER IDENTIFIER PARLEFT list_params PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "&ltfunction_general&gt ::= identifier identifier '(' &ltlist_params&gt ')' '{' &ltinstructions&gt '}'", rule: "function_general.val = new Function(identifier1.val, identifier2.val, list_params.list, instructions.list)"});
		$$ = new Function($1, $2, $4, $7, this._$.first_line, this._$.first_column);
	}
;

list_params
    : list_params COMMASIGN params {
		grammatical.push({gram: "&ltlist_params&gt ::= &ltlist_params&gt ',' &ltparams&gt", rule: "list_params.list = add(list_params1.list, params.val)"});
        $1.push($3);
        $$ = $1;
    }
    | params { 
		grammatical.push({gram: "&ltlist_params&gt ::= &ltparams&gt", rule: "list_params.list = [params.val]"});
		$$ = [$1]; 
	}
;

call_function
    : IDENTIFIER PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltcall_function&gt ::= identifier '(' ')'", rule: "call_function.val = new Call(identifier.lexvla)"});
        $$ = new Call($1, [], @1.first_line, @1.first_column);
    }
    | IDENTIFIER PARLEFT list_params_call PARRIGHT {
		grammatical.push({gram: "&ltcall_function&gt ::= identifier '(' &ltlist_params_call&gt ')'", rule: "call_function.val = new Call(identifier.lexval, list_params_call.list)"});
        $$ = new Call($1, $3, @1.first_line, @1.first_column);
    }
;

list_params_call
    : list_params_call COMMASIGN params_call {
		grammatical.push({gram: "&ltlist_params_call&gt ::= &ltlist_params_call&gt ',' &ltparams_call&gt", rule: "list_params_call.list = add(list_params_call1.list, params_call.val)"});
        $1.push($3);
        $$ = $1;
    }
    | params_call { 
		grammatical.push({gram: "&ltlist_params_call&gt ::= &ltprams_call&gt", rule: "list_params_call.list = [prarams_call.val]"});
		$$ = [$1]; 
	}
;

params_call
    : expression 	{ 
		grammatical.push({gram: "&ltparams_call&gt ::= &ltexpression&gt", rule: "params_call.val = expression.val"});
		$$ = $1; 
	}
	| values_array	{ 
		grammatical.push({gram: "&ltparams_call&gt ::= &ltvalues_array&gt", rule: "params_call.val = values_array.list"});
		$$ = $1; 
	}
;

params
    : type IDENTIFIER {
		grammatical.push({gram: "&ltparams&gt ::= &lttype&gt identifier", rule: "prarams.val = new Param(type.val, identifier.lexval)"});
        $$ = { type: $1, name: $2, row: this._$.first_line, column: this._$.first_column };
    }
	| type BRACKETLEFT BRACKETRIGHT IDENTIFIER  { 
		grammatical.push({gram: "&ltparams&gt ::= &lttype&gt '[' ']' identifier", rule: "params.val = new Param(type.val, identifier.lexval"});
		$$ = { type: type.ARRAY, sub_type: $1, name: $4, row: this._$.first_line, column: this._$.first_column }; 
	}
	| IDENTIFIER IDENTIFIER						{ 
		grammatical.push({gram: "&ltparams&gt ::= identifier identifier", rule: "params.val = new Param(identifier.val, identifier.val)"});
		$$ = { type: type.STRUCT, struct: $1, name: $2, row: this._$.first_line, column: this._$.first_column}; 
	}
;


struct
	: RSTRUCT IDENTIFIER CURLYLEFT attribute_list CURLYRIGHT		{ 
		grammatical.push({gram: "&ltstruct&gt ::= 'struct' identifier, '{' &ltattribute_list&gt '}'", rule: "struct.val = new Struct(identifier.val, attribute_list.list)"});
		$$ = new Struct($2, $4, this._$.first_line, this._$.first_column); 
	}
;

attribute_list
	: attribute_list COMMASIGN attribute		{ 
		grammatical.push({gram: "&ltattribute_list&gt ::= &ltattribute_list&gt ',' &ltattribute&gt", rule: "attribute_list.list = add(attributes_list.list, attribute.val)"});
		$1.push($3); $$ = $1; 
	}
	| attribute									{ 
		grammatical.push({gram: "&ltattribute_list&gt ::= &ltattribute&gt", rule: "attribute_list.list = [attribute.val]"});
		$$ = [$1]; 
	}
;

attribute
	: type IDENTIFIER							{ 
		grammatical.push({gram: "&ltattribute&gt ::= &lttype&gt identifier", rule: "attribute.val = new Attribute(type.val, identifier.lexval)"});
		$$ = { "type": $1, "id": $2, "value": "null", "row": this._$.first_line, "column": this._$.first_column }; 
	}
	| IDENTIFIER IDENTIFIER						{ 
		grammatical.push({gram: "&ltattribute&gt ::= identifier identifier", rule: "attribute.val = new Attribute(identifier.lexval, identifier.lexval)"});
		$$ = { "type": type.STRUCT, "struct": $1, "id": $2, "value": "null", "row": this._$.first_line, "column": this._$.first_column}; 
	}
	| type BRACKETLEFT BRACKETRIGHT IDENTIFIER	{ 
		grammatical.push({gram: "&ltattribute&gt ::= &lttype&gt '[' ']' identifier", rule: "attribute.val = new Attribute(type.val, identifier.lexval)"});
		$$ = { "type": type.ARRAY, "sub_type": $1, "id": $4, "value": [], "row": this._$.first_line, "column": this._$.first_column}; 
	}
;

access_struct
	: list_attributes							{ 
		grammatical.push({gram: "&ltaccess_struct&gt ::= &ltlist_attributes&gt", rule: "access_struct.val = new accessStruct(list_attributes.list)"});
		$$ = new Access_struct($1, null, null, this._$.first_line, this._$.first_column); 
	}
	| list_attributes list_brackets				{ 
		grammatical.push({gram: "&ltaccess_struct&gt ::= &ltlist_attributes&gt &ltlist_brackets&gt", rule: "access_struct.val = new accessStruct(list_attributes.list, list_brackets.list)"});
		$$ = new Access_struct($1, null, $2, this._$.first_line, this._$.first_column); 
	}
;

assignment_struct
	: list_attributes EQUALSIGN expression					{ 
		grammatical.push({gram: "&ltassginment_struct&gt ::= &ltlist_attributes&gt '=' &ltexpression&gt", rule: "assignment_struct.val = new accessStruct(list_attributes.list, expression.val)"});
		$$ = new Access_struct($1, $3, null, this._$.first_line, this._$.first_column); 
	}
	| list_attributes list_brackets EQUALSIGN expression 	{ 
		grammatical.push({gram: "&ltassignment_struct&gt ::= &ltlist_attributes&gt &ltlist_brackets&gt '=' &ltexpression&gt", rule: "assignment_struct.val = new accessStruct(list_attributes.list, list_brackets.list, expression.val)"});
		$$ = new Access_struct($1, $4, $2, this._$.first_line, this._$.first_column); 
	}
;

list_attributes
	: list_attributes DOT IDENTIFIER	{ grammatical.push({gram: "&ltlist_attributes&gt ::= &ltlist_attributes&gt '.' identifier", rule: "list_attributes.list = add(list_attributes.list, identifier.lexval)"}); $1.push($3); $$ = $1; }
	| IDENTIFIER DOT IDENTIFIER			{ grammatical.push({gram: "&ltlist_attributes&gt ::= identifier '.' identifier", rule: "list_attributes.list = [iditenfier.lexval, identifier.lexval]"}); $$ = [$1, $3]; }
;


type
    : RINT 		{ grammatical.push({gram: "&lttype&gt ::= 'int'", rule: "type.val = 'int'"}); $$ = type.INT; }
    | RDOUBLE 	{ grammatical.push({gram: "&lttype&gt ::= 'double'", rule: "type.val = 'double'"}); $$ = type.DOUBLE; }
    | RBOOLEAN 	{ grammatical.push({gram: "&lttype&gt ::= 'boolean'", rule: "type.val = 'boolean'"}); $$ = type.BOOL; }
    | RCHAR 	{ grammatical.push({gram: "&lttype&gt ::= 'char'", rule: "type.val = 'char'"}); $$ = type.CHAR; }
    | RSTRING 	{ grammatical.push({gram: "&lttype&gt ::= 'String'", rule: "type.val = 'String'"}); $$ = type.STRING; }
	//| RNULL		{ $$ = type.NULL; }
	| RVOID     { grammatical.push({gram: "&lttype&gt ::= 'void'", rule: "type.val = 'void'"}); $$ = type.VOID; }
;

/* Native Functions */
native_strings
    : IDENTIFIER DOT RLENGTH PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= identifier '.' 'length' '(' ')'", rule: "native_string.val = new Length(identifier.lexval)"});
        $$ = new Length(new Identifier($1, @1.first_line, @1.first_column), null, "length", [], [], @1.first_line, @1.first_column);
    }
	| STRING DOT RLENGTH PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= string '.' 'length' '(' ')'", rule: "native_string.val = new Length(string.lexval)"});
		$$ = new Length(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), null, "length", [], [], this._$.first_line, this._$.first_column);
	}
	| values_array DOT RLENGTH PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= &ltvalues_array&gt '.' 'length' '(' ')'", rule: "native_string.val = new Length(values_array.list)"});
		$$ = new Length(new Values_array($1, this._$.first_line, this._$.first_column), null, "length", [], [], this._$.first_line, this._$.first_column);
	}
	| IDENTIFIER list_brackets DOT RLENGTH PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= identifier &ltlist_brackets&gt '.' 'length' '(' ')'", rule: "native_string.val = new Length(identifier.lexval, list_brackets.list)"});
		$$ = new Length(new Access_array(new Identifier($1, this._$.first_line, this._$.first_column), $2, null, this._$.first_line, this._$.first_column), null, "length", [], [], this._$.first_line, this._$.first_column);
	}
    | IDENTIFIER DOT RUPPER PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= identifier '.' 'toUppercase' '(' ')'", rule: "native_string.val = new toUpperCase(identifier.lexval)"});
        $$ = new ToUpperCase(new Identifier($1, @1.first_line, @1.first_column), null, "ToUpperCase", [], [], @1.first_line, @1.first_column);
    }
	| STRING DOT RUPPER PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= string '.' 'toUppercase' '(' ')'", rule: "native_string.val = new toUpperCase(string.lexval)"});
		$$ = new ToUpperCase(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), null, "ToUpperCase", [], [], this._$.first_line, this._$.first_column);
	}
    | IDENTIFIER DOT RLOWER PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= identifier '.' 'toLowercase' '(' ')'", rule: "native_string.val = new toLowerCase(identifier.lexval)"});
        $$ = new ToLowerCase(new Identifier($1, @1.first_line, @1.first_column), null, "ToLowerCase", [], [], @1.first_line, @1.first_column);
    }
	| STRING DOT RLOWER PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= string '.' 'toLowercase' '(' ')'", rule: "native_string.val = new toLowerCase(string.lexval)"});
		$$ = new ToLowerCase(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), null, "ToLowerCase", [], [], this._$.first_line, this._$.first_column);
	}
    | IDENTIFIER DOT RCHAROF PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= identifier '.' 'caracterOfPosition' '(' &ltexpression&gt ')'", rule: "native_string.val = new caracterOfPosition(identifier.lexval, expression.val)"});
        $$ = new CaracterOfPosition(new Identifier($1, @1.first_line, @1.first_column), $5, null, "CharacterOfPosition", [], [], @1.first_line, @1.first_column);
    }
	| STRING DOT RCHAROF PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= string '.' 'caracterOfPosition' '(' &ltexpression&gt ')'", rule: "native_string.val = new caracterOfPosition(string.lexval, expression.val)"});
		$$ = new CaracterOfPosition(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), $5, "CharacterOfPosition", [], [], this._$.first_line, this._$.first_column);
	}
    | IDENTIFIER DOT RSUBSTRING PARLEFT expression COMMASIGN expression PARRIGHT {
		grammatical.push({gram: "&ltnative_string&gt ::= identifier '.' 'subString' '(' &ltexpression&gt ',' &ltexpression&gt ')'", rule: "native_string.val = new subString(identifier.lexval, expressoin1.val, expression2.val)"});
        $$ = new SubString(new Identifier($1, @1.first_line, @1.first_column), $5, $7, null, "substring", [], [], @1.first_line, @1.first_column)
    }
	| STRING DOT RSUBSTRING PARLEFT expression COMMASIGN expression PARRIGHT {
		grammatical.push({gram: "&ltnative_strings&gt ::= string '.' 'subString' '(' &ltexpression&gt ',' &ltexpression&gt ')'", rule: "native_string.val = new subString(string.lexval, expression1.val, expression2.val)"});
		$$ = new SubString(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), $5, $7, null, "substring", [], [], this._$.first_line, this._$.first_column);
	}
;

native_function
    : type DOT RPARSE PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_function&gt ::= &lttype&gt '.' 'parse' '(' &ltexpression&gt ')'", rule: "native_function.val = new parse(type.val, expression.val)"});
        $$ = new Parse($1, $5, @1.first_line, @1.first_column);
    }
;

native_parse
	: RTOINT PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_parse&gt ::= 'toInt' '(' &ltexpression&gt ')'", rule: "native_parse.val = new toInt(expression.val)"});
		$$ = new ToInt($3, null, "toInt", [], [], this._$.first_line, this._$.first_column);
	}
	| RTODOUBLE PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_parse&gt ::= 'toDouble' '(' &ltexpression&gt ')'", rule: "native_parse.val = new toDouble(expression.val)"});
		$$ = new ToDouble($3, null, "toDouble", [], [], this._$.first_line, this._$.first_column);
	}
	| FSTRING PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_parse&gt ::= 'string' '(' &ltexpression&gt ')'", rule: "native_parse.val = new string(expression.val)"});
		$$ = new String($3, null, "string", [], [], this._$.first_line, this._$.first_column);
	}
	| FSTRING PARLEFT values_array PARRIGHT {
		grammatical.push({gram: "&ltnative_parse&gt ::= 'string' '(' &ltvalues_array&gt ')'", rule: "native_parse.val = new string(values_array.list)"});
		$$ = new String(new Values_array($3, this._$.first_line, this._$.first_column), null, "string", [], [], this._$.first_line, this._$.first_column);
	}
;

native_type
	: RTYPEOF PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_type&gt ::= 'typeof' '(' &ltexpression&gt ')'", rule: "native_type.val = new typeof(expression.val)"});
		$$ = new TypeOf($3, null, "typeof", [], [], this._$.first_line, this._$.first_column);
	}
	| RTYPEOF PARLEFT values_array PARRIGHT {
		grammatical.push({gram: "&ltnative_type&gt ::= 'typeof' '(' &ltvalues_array&gt ')'", rule: "native_type.val = new typeof(values_array.list)"});
		$$ = new TypeOf(new Values_array($3, this._$.first_line, this._$.first_column), null, "typeof", [], [], this._$.first_line, this._$.first_column);
	}
;

native_arithmetic
	: RPOW PARLEFT expression COMMASIGN expression PARRIGHT {
		grammatical.push({gram: "&ltnative_arithmetic&gt ::= 'pow' '(' &ltexpression&gt ',' &ltexpression&gt ')'", rule: "native_arithmetic.val = new pow(expression1.val, expression2.val)"});
		$$ = new Pow($3, $5, null, "pow", [], [], this._$.first_line, this._$.first_column);
	}
	| RSIN PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_arithmetic&gt ::= 'sin' '(' &ltexpression&gt ')'", rule: "native_arithmetic.val = new sin(expression.val)"});
		$$ = new Sin($3, null, "sin", [], [], this._$.first_line, this._$.first_column);
	}
	| RCOS PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_arithmetic&gt ::= 'cos' '(' &ltexpression&gt ')'", rule: "native_arithmetic.val = new cos(expression.val)"});
		$$ = new Cos($3, null, "cos", [], [], this._$.first_line, this._$.first_column);
	}
	| RTAN PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_arithmetic&gt ::= 'tan' '(' &ltexpression&gt ')'", rule: "native_arithmetic.val = new tan(expression.val)"});
		$$ = new Tan($3, null, "tan", [], [], this._$.first_line, this._$.first_column);
	}
	| RSQRT PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_arithmetic&gt ::= 'sqrt' '(' &ltexpression&gt ')'", rule: "native_arithmetic.val = new sqrt(expression.val)"});
		$$ = new Sqrt($3, null, "sqrt", [], [], this._$.first_line, this._$.first_column);
	}
;

native_array_push
	: IDENTIFIER DOT RPUSH PARLEFT expression PARRIGHT {
		grammatical.push({gram: "&ltnative_array_push&gt ::= identifier '.' 'push' '(' &ltexpression&gt ')'", rule: "native_array_push.val = new push(identifier.lexval, expression.val)"});
		$$ = new Push(new Identifier($1, this._$.first_line, this._$.first_column), $5, null, "push", [], [], this._$.first_line, this._$.first_column);
	}
;

native_array_pop
	: IDENTIFIER DOT RPOP PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_array_pop&gt ::= identifier '.' 'pop' '(' ')'", rule: "native_array_pop.val = new pop(identifier.lexval)"});
		$$ = new Pop(new Identifier($1, this._$.first_line, this._$.first_column), null, "pop", [], [], this._$.first_line, this._$.first_column);
	}
;

native_ts 
	: RGRAPH PARLEFT PARRIGHT {
		grammatical.push({gram: "&ltnative_ts&gt ::= 'graficar_ts' '(' ')'", rule: "native_ts.val = new graficaTs()"});
		$$ = new Graficar_ts(null, "graficar_ts", [], [], this._$.first_line, this._$.first_column);
	}
;

expression
	: SUBSIGN expression %prec UMENOS       { grammatical.push({gram: "&ltexpression&gt ::= '-' &ltexpressoin&gt", rule: "expression.val = - expression1.val"}); $$ = new Arithmetic($2, null, Arithmetic_operator.SUBSTRACTION, @1.first_line, @1.first_column); }
	| expression PLUSSIGN expression        { grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '+' &ltexpression&gt", rule: "expression.val = expression1.val + expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.ADDITION, @1.first_line, @1.first_column); }
	| expression SUBSIGN expression         { grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '-' &ltexpression&gt", rule: "expression.val = expression1.val - expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.SUBSTRACTION, @1.first_line, @1.first_column); }
	| expression MULTSIGN expression        { grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '*' &ltexpression&gt", rule: "expression.val = expression1.val * expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.MULTIPLICATION, @1.first_line, @1.first_column); }
	| expression DIVSIGN expression         { grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '/' &ltexpression&gt", rule: "expression.val = expression1.val / expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.DIVISION, @1.first_line, @1.first_column); }
	| expression MODSIGN expression			{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '%' &ltexpression&gt", rule: "expression.val = expression1.val % expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.MODULS, @1.first_line, @1.first_column); }
	| expression INCSIGN					{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '++'", rule: "expression.val = new Inc(expression.val, ++)"}); $$ = new Arithmetic($1, null, Arithmetic_operator.INC, @1.first_line, @1.first_column); }
	| expression DECSIGN					{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '--'", rule: "expression.val = new Dec(expression.val, --)"}); $$ = new Arithmetic($1, null, Arithmetic_operator.DEC, @1.first_line, @1.first_column); }
	| expression EQUALIZATIONSIGN expression{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '==' &ltexpression&gt", rule: "expression.val = expression1.val == expression2.val"}); $$ = new Relational($1, $3, Relational_operator.EQUAL, @1.first_line, @1.first_column); }
	| expression DIFFSIGN expression		{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '!=' &ltexpression&gt", rule: "expression.val = expression1.val != expression2.val"}); $$ = new Relational($1, $3, Relational_operator.UNEQUAL, @1.first_line, @1.first_column); }
	| expression LESSEQUAL expression		{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '&lt=' &ltexpression&gt", rule: "expression.val = expression1.val &lt= expression2.val"}); $$ = new Relational($1, $3, Relational_operator.LESSEQUAL, @1.first_line, @1.first_column); }
	| expression GREATEREQUAL expression	{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '&gt=' &ltexpression&gt", rule: "expression.val = expression1.val &gt= expression2.val"}); $$ = new Relational($1, $3, Relational_operator.GREATEREQUAL, @1.first_line, @1.first_column); }
	| expression SMALLERTHAN expression		{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '&lt' &ltexpression&gt", rule: "expression.val = expression1.val &lt expression2.val"}); $$ = new Relational($1, $3, Relational_operator.LESS, @1.first_line, @1.first_column); }
	| expression GREATERTHAN expression		{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '&gt' &ltexpression&gt", rule: "expression.val = expression1.val &gt expression2.val"}); $$ = new Relational($1, $3, Relational_operator.GREATER, @1.first_line, @1.first_column); }
	| expression CONCAT expression          { grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '&' &ltexpression&gt", rule: "expression.val = expression1.val & expression2.val"}); $$ = new StringText($1, $3, String_operator.CONCAT, @1.first_line, @1.first_column); }
	| expression REPETITIONSIGN expression  { grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '^' &ltexpression&gt", rule: "expression.val = expression1.val ^ expression2.val"}); $$ = new StringText($1, $3, String_operator.REPETITION, @1.first_line, @1.first_column); }
	| expression AND expression				{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '&&' &ltexpression&gt", rule: "expression.val = expression1.val && expression2.val"}); $$ = new Logical($1, $3, Logical_operator.AND, @1.first_line, @1.first_column); }
	| expression OR expression				{ grammatical.push({gram: "&ltexpression&gt ::= &ltexpression&gt '||' &ltexpression&gt", rule: "expression.val = expression1.val || expression2.val"}); $$ = new Logical($1, $3, Logical_operator.OR, @1.first_line, @1.first_column); }
	| NOT expression %prec UNOT				{ grammatical.push({gram: "&ltexpression&gt ::= '!' &ltexpression&gt", rule: "expression.val = !expression1.val"}); $$ = new Logical($2, null, Logical_operator.NOT, @1.first_line, @1.first_column); }
	| INTEGER                               { grammatical.push({gram: "&ltexpression&gt ::= integer", rule: "expression.val = integer.lexval"}); $$ = new Primitive($1, type.INT, @1.first_line, @1.first_column); }
	| DOUBLE                                { grammatical.push({gram: "&ltexpression&gt ::= double", rule: "expression.val = double.lexval"}); $$ = new Primitive($1, type.DOUBLE, @1.first_line, @1.first_column) }
	| STRING                                { grammatical.push({gram: "&ltexpression&gt ::= string", rule: "expression.val = string.lexval"}); $$ = new Primitive($1, type.STRING, @1.first_line, @1.first_column); }
	| CHAR									{ grammatical.push({gram: "&ltexpression&gt ::= char", rule: "expression.val = char.lexval"}); $$ = new Primitive($1, type.CHAR, @1.first_line, @1.first_column); }
	| boolean								{ grammatical.push({gram: "&ltexpression&gt ::= &ltboolean&gt", rule: "expression.val = boolean.val"}); $$ = new Primitive($1, type.BOOL, @1.first_line, @1.first_column); }
	| VOID                                  { grammatical.push({gram: "&ltexpression&gt ::= 'void'", rule: "expression.val = 'void'"}); $$ = new Primitive($1, type.VOID, @1.first_line, @1.first_column); }
	| RNULL                                 { grammatical.push({gram: "&ltexpression&gt ::= 'null'", rule: "expression.val = 'null'"}); $$ = new Primitive($1, type.NULL, @1.first_line, @1.first_column); }
	| IDENTIFIER list_brackets				{ grammatical.push({gram: "&ltexpression&gt ::= identifier &ltlist_brackets&gt", rule: "expression.val = new access_array(identifier.lexval, list_brackets.list)"}); $$ = new Access_array(new Identifier($1, this._$.first_line, this._$.first_column), $2, null, this._$.first_line, this._$.first_column); }
	| IDENTIFIER							{ grammatical.push({gram: "&ltexpression&gt ::= identifier", rule: "expression.val = identifier.lexval"}); $$ = new Identifier($1, @1.first_line, @1.first_column); }
	| PARLEFT expression PARRIGHT           { grammatical.push({gram: "&ltexpression&gt ::= '(' &ltexpresssion&gt ')'", rule: "expression.val = expression1.val"}); $$ = $2; }
	| prod_ternary                          { grammatical.push({gram: "&ltexpression&gt ::= &ltprod_ternary&gt", rule: "expression.val = prod_ternary.val"}); $$ = $1; }
	| call_function                         { grammatical.push({gram: "&ltexpression&gt ::= &ltcall_function&gt", rule: "expression.val = call_function.val"}); $$ = $1; }
	| native_strings %prec FSTRING          { grammatical.push({gram: "&ltexpression&gt ::= &ltnative_strings&gt", rule: "expression.val = native_strings.val"}); $$ = $1; }
	| native_function %prec FCAST			{ grammatical.push({gram: "&ltexpression&gt ::= &ltnative_function&gt", rule: "expression.val = native_function.val"}); $$ = $1; }
	| native_parse %prec FCAST				{ grammatical.push({gram: "&ltexpression&gt ::= &ltnative_parse&gt", rule: "expression.val = native_parse.val"}); $$ = $1; }
	| native_arithmetic %prec FCAST			{ grammatical.push({gram: "&ltexpression&gt ::= &ltnative_arithmetic&gt", rule: "expression.val = native_arithmetic.val"}); $$ = $1; }
	| native_type							{ grammatical.push({gram: "&ltexpression&gt ::= &ltnative_type&gt", rule: "expression.val = native_type.val"}); $$ = $1; }
	| native_array_pop						{ grammatical.push({gram: "&ltexpression&gt ::= &ltnative_array_pop&gt", rule: "expression.val = native_array_pop.val"}); $$ = $1; }
	| access_struct							{ grammatical.push({gram: "&ltexpression&gt ::= &ltaccess_struct&gt", rule: "expression.val = access_struct.val"}); $$ = $1; }
	| range									{ grammatical.push({gram: "&ltexpression&gt ::= &ltrange&gt", rule: "expression.val = range.val"}); $$ = $1; }
;

boolean
	: RTRUE		{ grammatical.push({gram: "&ltboolean&gt ::= 'true'", rule: "boolean.val = 'true'"}); $$ = $1}
	| RFALSE 	{ grammatical.push({gram: "&ltboolean&gt ::= 'false'", rule: "boolean.val = 'false'"}); $$ = $1}
;