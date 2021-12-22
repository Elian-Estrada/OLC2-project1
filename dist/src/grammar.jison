

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
		grammatical.push({gram: "<ini> ::= <instructions> EOF", rule: "ini.val = instructions.list"});
	    return $1;
	}
;

instructions
	: instructions instruction          { 
		grammatical.push({gram: "<instructions> ::= <instructions> <instruction>", rule: "instructions.list = add(instructions1.list, instruction.val)"});
		$1.push($2); $$ = $1; 
	}
	| instruction                       { 
		grammatical.push({gram: "<instructions> ::= <instruction>", rule: "instructions.list = [instruction.val]"});
		if($1 === null) { $$ = []; } else { $$ = [$1]; } 
	}
;

instruction
    : declaration ptcommP 		{ 
		grammatical.push({gram: "<instruction> ::= <declaration> <ptcommP>", rule: "instruction.val = declaration.val"});
		$$ = $1; 
	}
	| assignment ptcommP		{ 
		grammatical.push({gram: "<instruction> ::= <assignment> <ptcommP>", rule: "instruction.val = assignment.val"});
		$$ = $1; 
	}
	| declaration_array ptcommP { 
		grammatical.push({gram: "<instruction> ::= <declaration_array> <ptcommP>", rule: "instruction.val = declaration_array.val"});
		$$ = $1; 
	}
	| assignment_array ptcommP	{ 
		grammatical.push({gram: "<instruction> ::= <assignment_array> <ptcommP>", rule: "instruction.val = assignment_array.val"});
		$$ = $1; 
	}
	| prod_print ptcommP 		{ 
		grammatical.push({gram: "<instruction> ::= <prod_print> <ptcommP>", rule: "instruction.val = prod_print.val"});
		$$ = $1; 
	}
	| inc_dec ptcommP			{ 
		grammatical.push({gram: "<instruction> ::= <inc_dec> <ptcommP>", rule: "instruction.val = inc_dec.val"});
		$$ = $1; 
	}
	| prod_if                   { 
		grammatical.push({gram: "<instruction> ::= <prod_if>", rule: "instruction.val = prod_if.val"});
		$$ = $1; 
	}
	| prod_loops                { 
		grammatical.push({gram: "<instruction> ::= <prod_loops>", rule: "instruction.val = prod_loops.val"});
		$$ = $1; 
	}
	| prod_switch               { 
		grammatical.push({gram: "<instruction> ::= <prod_switch>", rule: "instruction.val = switch.val"});
		$$ = $1; 
	}
	| transfer_prod ptcommP     { 
		grammatical.push({gram: "<instruction> ::= <transfer_prod> <ptcommP>", rule: "instruction.val = transfer_prod.val"});
		$$ = $1; 
	}
	| prod_ternary ptcommP      { 
		grammatical.push({gram: "<instruction> ::= <prod_ternary> <ptcommP>", rule: "instruction.val = prod_ternary.val"});
		$$ = $1; 
	}
	| functions                 { 
		grammatical.push({gram: "<instruction> ::= <functions>", rule: "instruction.val = functions.val"});
		$$ = $1; 
	}
	| call_function ptcommP     { 
		grammatical.push({gram: "<instruction> ::= <call_function> <ptcommP>", rule: "instruction.val = call_function.val"});
		$$ = $1; 
	}
	| struct ptcommP			{ 
		grammatical.push({gram: "<instruction> ::= <struct> <ptcommP>", rule: "instruction.val = struct.val"});
		$$ = $1; 
	}
	| native_strings ptcommP    { 
		grammatical.push({gram: "<instruction> ::= <native_strings> <ptcommP>", rule: "instruction.val = native_strings.val"});
		$$ = $1; 
	}
	| native_function ptcommP   { 
		grammatical.push({gram: "<instruction> ::= <native_function> <ptcommP>", rule: "instruction.val = native_function.val"});
		$$ = $1; 
	}
	| native_array_push ptcommP	{ 
		grammatical.push({gram: "<instruction> ::= <native_array_push> <ptcommP>", rule: "instruction.val = native_array_push.val"});
		$$ = $1; 
	}
	| native_array_pop ptcommP	{ 
		grammatical.push({gram: "<instruction> ::= <native_array_pop> <ptcommP>", rule: "instruction.val = native_array_pop.val"});
		$$ = $1; 
	}
	| native_ts	ptcommP			{ 
		grammatical.push({gram: "<instruction> ::= <native_ts> <ptcommP>", rule: "instruction.val = native_ts.val"});
		$$ = $1; 
	}
	| assignment_struct ptcommP	{ 
		grammatical.push({gram: "<instruction> ::= <assignment_struct> <ptcommP>", rule: "instruction.val = assignment_struct.val"});
		$$ = $1; 
	}
	| error SEMICOLON           {
		errors.push(new Exception("Sintactic", `Sintactic error ${yytext}`, this._$.first_line, this._$.first_column));
		$$ = null;
	}
;

ptcommP
	: SEMICOLON		{
		grammatical.push({gram: "<ptcommP> ::= ';'", rule: "ptcommP.val = ;"});
		$$ = $1;
	}
;

declaration
	: type IDENTIFIER EQUALSIGN expression			{ 
		grammatical.push({gram: "<declaration> ::= <type> identifier '=' <expression>", rule: "declaration.val = new Declaration(type.val, identifier.lexval, expression.val)"});
		$$ = new Declaration([$2], $1, @1.first_line, @1.first_column, $4); 
	}
	| type list_id									{ 
		grammatical.push({gram: "<declaration> ::= <type> <list_id>", rule: "declaration.val = new Declaration(type.val, list_id.list)"});
		$$ = new Declaration($2, $1, this._$.first_line, this._$.first_column); 
	}
	| IDENTIFIER IDENTIFIER EQUALSIGN expression	{ 
		grammatical.push({gram: "<declaration> ::= identifier identifier '=' <expression>", rule: "declaration.val = new Declaration(identifier1.lexval, identifier2.lexval, expression.val)"});
		$$ = new Declaration([$2, $1], type.STRUCT, this._$.first_line, this._$.first_column, $4); 
	}
;

list_id
	: list_id COMMASIGN IDENTIFIER	{ 
		grammatical.push({gram: "<list_id> ::= <list_id> ',' identifier", rule: "list_id.list = add(list_id1.list, identifier.lexval)"});
		$$ = $1; $$.push($3); 
	}
	| IDENTIFIER					{ 
		grammatical.push({gram: "<list_id> ::= identifier", rule: "list_id.list = [identifier.lexval]"});
		$$ = []; $$.push($1); 
	}
;

assignment
	: IDENTIFIER EQUALSIGN expression 	{ 
		grammatical.push({gram: "<assignment> ::= identifier '=' <expression>", rule: "assignment.val = new Assignmt(identifier.lexval, expression.val)"});
		$$ = new Assignment($1, $3, this._$.first_line, this._$.first_column); 
	}
	| IDENTIFIER EQUALSIGN values_array	{ 
		grammatical.push({gram: "<assignment> ::= identifier '=' <values_array>", rule: "assignment.val = new Assignmt(identifier.lexval, values_array.list)"});
		$$ = new Assignment($1, new Values_array($3, this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); 
	}
;

declaration_array
	: type BRACKETLEFT BRACKETRIGHT IDENTIFIER EQUALSIGN values_array		{ 
		grammatical.push({gram: "<declaration_array> ::= <type> '[' ']' identifier '=' <values_array>", rule: "declaration_array.val = new Declaration_array(type.val, identifier1.lexval, values_array.list)"});
		$$ = new Declaration_array($4, $1, null, $6, this._$.first_line, this._$.first_column); 
	}
	| type BRACKETLEFT BRACKETRIGHT IDENTIFIER EQUALSIGN IDENTIFIER			{ 
		grammatical.push({gram: "<declaration_array> ::= <type> '[' ']' identifier '=' identifier", rule: "declaration_array.val = new Declaration_array(type.val, identifier1.lexval, identifier2.lexval)"});
		$$ = new Declaration_array($4, $1, new Identifier($6, this._$.first_line, this._$.first_column), [], this._$.first_line, this._$.first_column); 
	}
	| type BRACKETLEFT BRACKETRIGHT IDENTIFIER EQUALSIGN COPY IDENTIFIER	{ 
		grammatical.push({gram: "<declaration_array> ::= <type> '[' ']' identifier '=' '#' identifier", rule: "declaration_array.val = new Declaration_array(type.val, identifier1.lexval, identifier2.lexval)"});
		$$ = new Declaration_array($4, $1, new Identifier($7, this._$.first_line, this._$.first_column), [], this._$.first_line, this._$.first_column, false); 
	}
;

values_array
	: BRACKETLEFT list_values_array BRACKETRIGHT	{ 
		grammatical.push({gram: "<values_array> ::= '[' <list_values_array> ']'", rule: "values_array.list = list_values_array.list"});
		$$ = $2; 
	}
	| BRACKETLEFT BRACKETRIGHT						{ 
		grammatical.push({gram: "<values_array> ::= '[' ']'", rule: "values_array.list = []"});
		$$ = []; 
	}
;

list_values_array
	: list_values_array COMMASIGN values	{ 
		grammatical.push({gram: "<list_values_array> ::= <list_values_array> ',' <values>", rule: "list_values_array.list = add(list_values_array1.list, values.val)"});
		$1.push($3); $$ = $1;
	}
	| values								{ 
		grammatical.push({gram: "<list_values_array> ::= <values>", rule: "list_values_array.list = [values.val]"});
		$$ = [$1]; 
	}
;

values
	: expression		{ 
		grammatical.push({gram: "<values> ::= <expression>", rule: "values.val = expression.val"});
		$$ = $1; 
	}
	| values_array		{ 
		grammatical.push({gram: "<values> ::= <values_array>", rule: "values.val = values_array.list"});
		$$ = $1; 
	}
;

assignment_array
	: IDENTIFIER list_brackets EQUALSIGN expression 	{ 
		grammatical.push({gram: "<assignment_array> ::= identifier <list_brackets> '=' <expression>", rule: "assignment_array.val = new accessArra(identifier.lexval, list_bracktes.list, expression.val)"});
		$$ = new Access_array(new Identifier($1, this._$.first_line, this._$.first_column), $2, $4, this._$.first_line, this._$.first_column); 
	}
;

list_brackets
	: list_brackets brackets				{ 
		grammatical.push({gram: "<list_brackets> ::= <list_brackets> <brackets>", rule: "list_brackets.list = add(list_brackets1.list, brackets.val)"});
		$1.push($2); $$ = $1; 
	}
	| brackets								{ 
		grammatical.push({gram: "<list_brackets> ::= <brackets>", rule: "list_brackets.list = [brackets.val]"});
		$$ = [$1]; 
	}
;

brackets
	: BRACKETLEFT expression BRACKETRIGHT	{ 
		grammatical.push({gram: "<brackets> ::= '[' <expression> ']'", rule: "bracktes.val = expression.val"});
		$$ = $2; 
	}
;

range
	: IDENTIFIER BRACKETLEFT expression_range TWOPOINTS expression_range BRACKETRIGHT {
		grammatical.push({gram: "<range> ::= identifier '[' <expression_range> ':' <expression_range> ']'", rule: "range.val = new Range(identifier.lexval, expression_range1.val, expression_range2.val)"});
		$$ = new Range(new Identifier($1, this._$.first_line, this._$.first_column), $3, $5, this._$.first_line, this._$.first_column);
	}
;

expression_range
	: expression		{ 
		grammatical.push({gram: "<expression_range> ::= <expression>", rule: "expression_range.val = expression.val"});
		$$ = $1 
	}
	| RBEGIN			{ 
		grammatical.push({gram: "<expression_range> ::= 'begin'", rule: "expression_range.val = begin"});
		$$ = $1 
	}
	| REND				{ 
		grammatical.push({gram: "<expression_range> ::= 'end'", rule: "expression_range.val = end"});
		$$ = $1 
	}
;

prod_print
    : RPRINT PARLEFT list_values_array PARRIGHT {
		grammatical.push({gram: "<prod_print> ::= 'print' '(' <list_values_array> ')'", rule: "prod_print.val = new Print(list_values_array.list)"});
        $$ = new Print($3, @1.first_line, @1.first_column, false);
    }
	| RPRINTLN PARLEFT list_values_array PARRIGHT { 
		grammatical.push({gram: "<prod_print> ::= 'println' '(' <list_values_array> ')'", rule: "prod_print.val = new Print(list_values_array.list)"});	
		$$ = new Print($3, @1.first_line, @1.first_column); 
	}
;

inc_dec
	: IDENTIFIER INCSIGN		{ 
		grammatical.push({gram: "<inc_dec> ::= identifier '++'", rule: "inc_dec.val = identifier.lexval ++"});
		$$ = new Inc_Dec(new Arithmetic(new Identifier($1, this._$.first_line, this._$.first_column), null, Arithmetic_operator.INC, this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); 
	}
	| IDENTIFIER DECSIGN		{ 
		grammatical.push({gram: "<inc_dec> ::= identifier '--'", rule: "inc_dec.val = identifier.lexval --"});
		$$ = new Inc_Dec(new Arithmetic(new Identifier($1, this._$.first_line, this._$.first_column), null, Arithmetic_operator.DEC, this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); 
	}
;

/* Prods about if */
prod_if
    : RIF PARLEFT expression PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<prod_if> ::= 'if' '(' <expression> ')' '{' <instructions> '}'", rule: "prod_if.val = new If(expression.val, instrucctions1.list)"});
        $$ = new If($3, $6, null, null, @1.first_line, @1.first_column);
    }
    | RIF PARLEFT expression PARRIGHT CURLYLEFT instructions CURLYRIGHT RELSE CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<prod_if> ::= 'if' '(' <expression> ')' '{' <instructions> '}' 'else' '{' <instructions> '}'", rule: "prod_if.val = new If(expression.val, instrucctions1.list, instructions2.list)"});
        $$ = new If($3, $6, $10, null, @1.first_line, @1.first_column);
    }
    | RIF PARLEFT expression PARRIGHT CURLYLEFT instructions CURLYRIGHT RELSE prod_if {
		grammatical.push({gram: "<prod_if> ::= 'if' '(' <expression> ')' '{' <instructions> '}' 'else' <prod_if>", rule: "prod_if.val = new If(expression.val, instrucctions1.list, prod_if1.val)"});
        $$ = new If($3, $6, null, $9, @1.first_line, @1.first_column);
    }
    | RIF PARLEFT expression PARRIGHT instruction {
		grammatical.push({gram: "<prod_if> ::= 'if' '(' <expression> ')' <instruction> ", rule: "prod_if.val = new If(expression.val, instrucction.list)"});
        $$ = new If($3, [$5], null, null, @1.first_line, @1.first_column);
    }
;

/* Loops Prods */
prod_loops
    : prod_while    { 
		grammatical.push({gram: "<prod_loops> ::= <prod_while>", rule: "prod_loops.val = prod_while.val"});
		$$ = $1; 
	}
    | for_prod      { 
		grammatical.push({gram: "<prod_loops> ::= <for_prod>", rule: "prod_loops.val = for_prod.val"});
		$$ = $1; 
	}
    | do_prod     	{ 
		grammatical.push({gram: "<prod_loops> ::= <do_prod>", rule: "prod_loops.val = do_prod.val"});
		$$ = $1; 
	}
;

/* Prods about While */
prod_while
    : RWHILE PARLEFT expression PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<prod_while> ::= 'while' '(' <expression> ')' '{' <instructions '}'", rule: "prod_while.val = new While(expression.val, instructions.list)"});
        $$ = new While($3, $6, @1.first_line, @1.first_column);
    }
;

/* Prods about do */
do_prod
    : RDO CURLYLEFT instructions CURLYRIGHT RWHILE PARLEFT expression PARRIGHT ptcommP {
		grammatical.push({gram: "<do_prod> ::= 'do' '{' <instructions> '}' 'while' '(' <expression> ')' <ptcommP>", rule: "do_prod.val = new Do(instructions.list, expression.val)"});
        $$ = new DoWhile($7, $3, @1.first_line, @1.first_column);
    }
;

/* Prods about Switch */
prod_switch
    : RSWITCH PARLEFT expression PARRIGHT CURLYLEFT prod_default CURLYRIGHT {
		grammatical.push({gram: "<prod_switch> ::= 'switch' '(' <expression> ')' '{' <prod_default> '}'", rule: "prod_switch.val = new Switch(expression.val, prod_default.list)"});
        $$ = new Switch($3, null, $6, @1.first_line, @1.first_column);
    }
    | RSWITCH PARLEFT expression PARRIGHT CURLYLEFT list_cases CURLYRIGHT {
		grammatical.push({gram: "<prod_switch> ::= 'switch' '(' <expression> ')' '{' <list_cases> '}'", rule: "prod_switch.val = new Switch(expression.val, list_cases.list)"});
            $$ = new Switch($3, $6, null, @1.first_line, @1.first_column);
    }
    | RSWITCH PARLEFT expression PARRIGHT CURLYLEFT list_cases prod_default CURLYRIGHT {
		grammatical.push({gram: "<prod_switch> ::= 'switch' '(' <expression> ')' '{' <list_cases> <prod_default> '}'", rule: "prod_switch.val = new Switch(expression.val, list_cases.list, prod_default.list)"});
            $$ = new Switch($3, $6, $7, @1.first_line, @1.first_column);
    }
;

prod_default
    : RDEFAULT TWOPOINTS instructions { 
		grammatical.push({gram: "<prod_default> ::= 'default' ':' <instructions>", rule: "prod_default.list = instructions.list"});
		$$ = $3; 
	}
;

list_cases
    : list_cases case { 
		grammatical.push({gram: "<list_cases> ::= <list_cases> <case>", rule: "list_cases.list = add(list_cases1.list, case.val)"});
		($2 != null) ? $1.push($2) : null; $$ = $1; 
	}
    | case { 
		grammatical.push({gram: "<list_cases> ::= <case>", rule: "list_case.list = [case.val]"});
		$$ = ($1 == null) ? [] : [$1] 
	}
;

case
    : RCASE expression TWOPOINTS instructions {
		grammatical.push({gram: "<case> ::= 'case' <expression> ':' <instructions>", rule: "case.val = new Case(expression.val, insturctions.list)"});
        $$ = new Case($2, $4, @1.first_line, @1.first_column);
    }
;

/* Transfer Structures Prods */
transfer_prod
    : RBREAK                   {
		grammatical.push({gram: "<transfer_prod> ::= 'break'", rule: "transfer_prod.val = new Break()"}); 
		$$ = new Break(@1.first_line, @1.first_column); 
	}
    | RRETURN expression       {
		grammatical.push({gram: "<transfer_prod> 'return'::= ", rule: "transfer_prod.val = new Return(expression.val)"}); 
		$$ = new Return($2, @1.first_line, @1.first_column); 
	}
    | RRETURN                  {
		grammatical.push({gram: "<transfer_prod> ::= 'return'", rule: "transfer_prod.val = new Return()"}); 
		$$ = new Return(null, @1.first_line, @1.first_column); 
	}
    | RCONTINUE                {
		grammatical.push({gram: "<transfer_prod> ::= 'continue'", rule: "transfer_prod.val = new Continue();"}); 
		$$ = new Continue(@1.first_line, @1.first_column); 
	}
;

/* Prods about For */
for_prod
    : for_it                    { 
		grammatical.push({gram: "<for_prod> ::= <for_it>", rule: "for_prod.val = for_it.val"});
		$$ = $1; 
	}
    | for_in                    { 
		grammatical.push({gram: "<for_prod> ::= <for_in>", rule: "for_prod.val = for_in.val"});
		$$ = $1; 
	}
;

for_it
    : RFOR PARLEFT for_init SEMICOLON expression SEMICOLON for_step PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<for_it> ::= 'for' '(' <for_init> ';' <expression> ';' <for_step> ')' '{' <instructions> '}'",
		rule: "fro_it.val = new For(for_init.val, expression.val, for_step.val, instructions.list)"});
        $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column);
    }
;

for_in
    : RFOR IDENTIFIER RIN expression CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<for_in> ::= 'for' identifier 'in' <expression> '{' <instructions> '}'", rule: "for_in.val = new Forin(identifier.lexval, expression.val, instructions.list)"});
        $$ = new ForIn($2, $4, $6, @1.first_line, @1.first_column);
    }
	| RFOR IDENTIFIER RIN values_array CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<for_in> ::= 'for' identifier 'in' <values_array> '{' <instructions> '}'", rule: "for_in.val = new Forin(identifier.lexval, values_array.list, instructions.list)"});
		$$ = new ForIn($2, new Values_array($4, this._$.first_line, this._$.first_column), $6, this._$.first_line, this._$.first_column);
	}
;

for_init
    : declaration   { 
		grammatical.push({gram: "<for_init> ::= <declaration>", rule: "for_init.val = declaration.val"});
		$$ = $1; 
	}
    | assignment    { 
		grammatical.push({gram: "<for_init> ::= <assignment>", rule: "for_init.val = assignment.val"});
		$$ = $1; 
	}
;

for_step
    : inc_dec       { 
		grammatical.push({gram: "<for_step> ::= <inc_dec>", rule: "for_step.val = inc_dec.val"});
		$$ = $1; 
	}
    | assignment    { 
		grammatical.push({gram: "<for_step> ::= <assignment>", rule: "for_step.val = assignment.val"});
		$$ = $1; 
	}
;

/* Ternary Prod */
prod_ternary
    : PARLEFT expression PARRIGHT VALUEIFTRUE expression TWOPOINTS expression {
		grammatical.push({gram: "<prod_ternary> ::= '(' <expression> ')' '?' <expression> ':' <expression>", rule: "prod_ternary.val = new Ternary(expression1.val, expression2.val, expression3.val)"});
        $$ = new Ternary($2, $5, $7, @1.first_line, @1.first_column);
    }
;

/* Prods about Functions and Calls to Functions */
functions
    : function_main     { 
		grammatical.push({gram: "<functions> ::= <functions_main>", rule: "functions.val = functions_main.val"});
		$$ = $1; 
	}
    | function_general  { 
		grammatical.push({gram: "<functions> ::= <functions_general>", rule: "functions.val = functions_general.val"});
		$$ = $1; 
	}
;

function_main
    : RVOID RMAIN PARLEFT PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<function_main> ::= 'void' 'main' '(' ')' '{' <instructions> '}'", rule: "function_main.val = new Main(instructions.list)"});
        $$ = new MainInstruction($6, @1.first_line, @1.first_column);
    }
;

function_general
    : type IDENTIFIER PARLEFT PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<function_general> ::= <type> identifier '(' ')' '{' <instructions> '}'", rule: "function_general.val = new Function(type.val, identifier.lexvla, instructins.list)"});
        $$ = new Function($1, $2, [], $6, @1.first_line, @1.first_column);
    }
    | type IDENTIFIER PARLEFT list_params PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<function_general> ::= <type> identifier '(' <list_params> ')' '{' <instructions> '}'", rule: "function_general.val = new Function(type.val, identifier.lexvla, list_params.list, instructins.list)"});
        $$ = new Function($1, $2, $4, $7, @1.first_line, @1.first_column);
    }
	| IDENTIFIER IDENTIFIER PARLEFT PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<function_general> ::= identifier identifier '(' ')' '{' <instructions> '}'", rule: "function_general.val = new Function(identifier1.val, identifier2.val, instruccions.list)"});
		$$ = new Function($1, $2, [], $7, this._$.first_line, this._$.first_column);
	}
	| IDENTIFIER IDENTIFIER PARLEFT list_params PARRIGHT CURLYLEFT instructions CURLYRIGHT {
		grammatical.push({gram: "<function_general> ::= identifier identifier '(' <list_params> ')' '{' <instructions> '}'", rule: "function_general.val = new Function(identifier1.val, identifier2.val, list_params.list, instructions.list)"});
		$$ = new Function($1, $2, $4, $7, this._$.first_line, this._$.first_column);
	}
;

list_params
    : list_params COMMASIGN params {
		grammatical.push({gram: "<list_params> ::= <list_params> ',' <params>", rule: "list_params.list = add(list_params1.list, params.val)"});
        $1.push($3);
        $$ = $1;
    }
    | params { 
		grammatical.push({gram: "<list_params> ::= <params>", rule: "list_params.list = [params.val]"});
		$$ = [$1]; 
	}
;

call_function
    : IDENTIFIER PARLEFT PARRIGHT {
		grammatical.puhs({gram: "<call_function> ::= identifier '(' ')'", rule: "call_function.val = new Call(identifier.lexvla)"});
        $$ = new Call($1, [], @1.first_line, @1.first_column);
    }
    | IDENTIFIER PARLEFT list_params_call PARRIGHT {
		grammatical.push({gram: "<call_function> ::= identifier '(' <list_params_call> ')'", rule: "call_function.val = new Call(identifier.lexval, list_params_call.list)"});
        $$ = new Call($1, $3, @1.first_line, @1.first_column);
    }
;

list_params_call
    : list_params_call COMMASIGN params_call {
		grammatical.push({gram: "<list_params_call> ::= <list_params_call> ',' <params_call>", rule: "list_params_call.list = add(list_params_call1.list, params_call.val)"});
        $1.push($3);
        $$ = $1;
    }
    | params_call { 
		grammatical.push({gram: "<list_params_call> ::= <prams_call>", rule: "list_params_call.list = [prarams_call.val]"});
		$$ = [$1]; 
	}
;

params_call
    : expression 	{ 
		grammatical.push({gram: "<params_call> ::= <expression>", rule: "params_call.val = expression.val"});
		$$ = $1; 
	}
	| values_array	{ 
		grammatical.push({gram: "<params_call> ::= <values_array>", rule: "params_call.val = values_array.list"});
		$$ = $1; 
	}
;

params
    : type IDENTIFIER {
		grammatical.push({gram: "<params> ::= <type> identifier", rule: "prarams.val = new Param(type.val, identifier.lexval)"});
        $$ = { type: $1, name: $2, row: this._$.first_line, column: this._$.first_column };
    }
	| type BRACKETLEFT BRACKETRIGHT IDENTIFIER  { 
		grammatical.push({gram: "<params> ::= <type> '[' ']' identifier", rule: "params.val = new Param(type.val, identifier.lexval"});
		$$ = { type: type.ARRAY, sub_type: $1, name: $4, row: this._$.first_line, column: this._$.first_column }; 
	}
	| IDENTIFIER IDENTIFIER						{ 
		grammatical.push({gram: "<params> ::= identifier identifier", rule: "params.val = new Param(identifier.val, identifier.val)"});
		$$ = { type: type.STRUCT, struct: $1, name: $2, row: this._$.first_line, column: this._$.first_column}; 
	}
;


struct
	: RSTRUCT IDENTIFIER CURLYLEFT attribute_list CURLYRIGHT		{ 
		grammatical.push({gram: "<struct> ::= 'struct' identifier, '{' <attribute_list> '}'", rule: "struct.val = new Struct(identifier.val, attribute_list.list)"});
		$$ = new Struct($2, $4, this._$.first_line, this._$.first_column); 
	}
;

attribute_list
	: attribute_list COMMASIGN attribute		{ 
		grammatical.push({gram: "<attribute_list> ::= <attribute_list> ',' <attribute>", rule: "attribute_list.list = add(attributes_list.list, attribute.val)"});
		$1.push($3); $$ = $1; 
	}
	| attribute									{ 
		grammatical.push({gram: "<attribute_list> ::= <attribute>", rule: "attribute_list.list = [attribute.val]"});
		$$ = [$1]; 
	}
;

attribute
	: type IDENTIFIER							{ 
		grammatical.push({gram: "<attribute> ::= <type> identifier", rule: "attribute.val = new Attribute(type.val, identifier.lexval)"});
		$$ = { "type": $1, "id": $2, "value": "null", "row": this._$.first_line, "column": this._$.first_column }; 
	}
	| IDENTIFIER IDENTIFIER						{ 
		grammatical.push({gram: "<attribute> ::= identifier identifier", rule: "attribute.val = new Attribute(identifier.lexval, identifier.lexval)"});
		$$ = { "type": type.STRUCT, "struct": $1, "id": $2, "value": "null", "row": this._$.first_line, "column": this._$.first_column}; 
	}
	| type BRACKETLEFT BRACKETRIGHT IDENTIFIER	{ 
		grammatical.push({gram: "<attribute> ::= <type> '[' ']' identifier", rule: "attribute.val = new Attribute(type.val, identifier.lexval)"});
		$$ = { "type": type.ARRAY, "sub_type": $1, "id": $4, "value": [], "row": this._$.first_line, "column": this._$.first_column}; 
	}
;

access_struct
	: list_attributes							{ 
		grammatical.push({gram: "<access_struct> ::= <list_attributes>", rule: "access_struct.val = new accessStruct(list_attributes.list)"});
		$$ = new Access_struct($1, null, null, this._$.first_line, this._$.first_column); 
	}
	| list_attributes list_brackets				{ 
		grammatical.push({gram: "<access_struct> ::= <list_attributes> <list_brackets>", rule: "access_struct.val = new accessStruct(list_attributes.list, list_brackets.list)"});
		$$ = new Access_struct($1, null, $2, this._$.first_line, this._$.first_column); 
	}
;

assignment_struct
	: list_attributes EQUALSIGN expression					{ 
		grammatical.push({gram: "<assginment_struct> ::= <list_attributes> '=' <expression>", rule: "assignment_struct.val = new accessStruct(list_attributes.list, expression.val)"});
		$$ = new Access_struct($1, $3, null, this._$.first_line, this._$.first_column); 
	}
	| list_attributes list_brackets EQUALSIGN expression 	{ 
		grammatical.push({gram: "<assignment_struct> ::= <list_attributes> <list_brackets> '=' <expression>", rule: "assignment_struct.val = new accessStruct(list_attributes.list, list_brackets.list, expression.val)"});
		$$ = new Access_struct($1, $4, $2, this._$.first_line, this._$.first_column); 
	}
;

list_attributes
	: list_attributes DOT IDENTIFIER	{ grammatical.push({gram: "<list_attributes> ::= <list_attributes> '.' identifier", rule: "list_attributes.list = add(list_attributes.list, identifier.lexval)"}); $1.push($3); $$ = $1; }
	| IDENTIFIER DOT IDENTIFIER			{ grammatical.push({gram: "<list_attributes> ::= identifier '.' identifier", rule: "list_attributes.list = [iditenfier.lexval, identifier.lexval]"}); $$ = [$1, $3]; }
;


type
    : RINT 		{ grammatical.push({gram: "<type> ::= 'int'", rule: "type.val = 'int'"}); $$ = type.INT; }
    | RDOUBLE 	{ grammatical.push({gram: "<type> ::= 'double'", rule: "type.val = 'double'"}); $$ = type.DOUBLE; }
    | RBOOLEAN 	{ grammatical.push({gram: "<type> ::= 'boolean'", rule: "type.val = 'boolean'"}); $$ = type.BOOL; }
    | RCHAR 	{ grammatical.push({gram: "<type> ::= 'char'", rule: "type.val = 'char'"}); $$ = type.CHAR; }
    | RSTRING 	{ grammatical.push({gram: "<type> ::= 'String'", rule: "type.val = 'String'"}); $$ = type.STRING; }
	//| RNULL		{ $$ = type.NULL; }
	| RVOID     { grammatical.push({gram: "<type> ::= 'void'", rule: "type.val = 'void'"}); $$ = type.VOID; }
;

/* Native Functions */
native_strings
    : IDENTIFIER DOT RLENGTH PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_string> ::= identifier '.' 'length' '(' ')'", rule: "native_string.val = new Length(identifier.lexval)"});
        $$ = new Length(new Identifier($1, @1.first_line, @1.first_column), null, "length", [], [], @1.first_line, @1.first_column);
    }
	| STRING DOT RLENGTH PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_string> ::= string '.' 'length' '(' ')'", rule: "native_string.val = new Length(string.lexval)"});
		$$ = new Length(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), null, "length", [], [], this._$.first_line, this._$.first_column);
	}
	| values_array DOT RLENGTH PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_string> ::= <values_array> '.' 'length' '(' ')'", rule: "native_string.val = new Length(values_array.list)"});
		$$ = new Length(new Values_array($1, this._$.first_line, this._$.first_column), null, "length", [], [], this._$.first_line, this._$.first_column);
	}
	| IDENTIFIER list_brackets DOT RLENGTH PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_string> ::= identifier <list_brackets> '.' 'length' '(' ')'", rule: "native_string.val = new Length(identifier.lexval, list_brackets.list)"});
		$$ = new Length(new Access_array(new Identifier($1, this._$.first_line, this._$.first_column), $2, null, this._$.first_line, this._$.first_column), null, "length", [], [], this._$.first_line, this._$.first_column);
	}
    | IDENTIFIER DOT RUPPER PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_string> ::= identifier '.' 'toUppercase' '(' ')'", rule: "native_string.val = new toUpperCase(identifier.lexval)"});
        $$ = new ToUpperCase(new Identifier($1, @1.first_line, @1.first_column), null, "ToUpperCase", [], [], @1.first_line, @1.first_column);
    }
	| STRING DOT RUPPER PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_string> ::= string '.' 'toUppercase' '(' ')'", rule: "native_string.val = new toUpperCase(string.lexval)"});
		$$ = new ToUpperCase(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), null, "ToUpperCase", [], [], this._$.first_line, this._$.first_column);
	}
    | IDENTIFIER DOT RLOWER PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_string> ::= identifier '.' 'toLowercase' '(' ')'", rule: "native_string.val = new toLowerCase(identifier.lexval)"});
        $$ = new ToLowerCase(new Identifier($1, @1.first_line, @1.first_column), null, "ToLowerCase", [], [], @1.first_line, @1.first_column);
    }
	| STRING DOT RLOWER PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_string> ::= string '.' 'toLowercase' '(' ')'", rule: "native_string.val = new toLowerCase(string.lexval)"});
		$$ = new ToLowerCase(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), null, "ToLowerCase", [], [], this._$.first_line, this._$.first_column);
	}
    | IDENTIFIER DOT RCHAROF PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_string> ::= identifier '.' 'caracterOfPosition' '(' <expression> ')'", rule: "native_string.val = new caracterOfPosition(identifier.lexval, expression.val)"});
        $$ = new CaracterOfPosition(new Identifier($1, @1.first_line, @1.first_column), $5, null, "CharacterOfPosition", [], [], @1.first_line, @1.first_column);
    }
	| STRING DOT RCHAROF PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_string> ::= string '.' 'caracterOfPosition' '(' <expression> ')'", rule: "native_string.val = new caracterOfPosition(string.lexval, expression.val)"});
		$$ = new CaracterOfPosition(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), $5, "CharacterOfPosition", [], [], this._$.first_line, this._$.first_column);
	}
    | IDENTIFIER DOT RSUBSTRING PARLEFT expression COMMASIGN expression PARRIGHT {
		grammatical.push({gram: "<native_string> ::= identifier '.' 'subString' '(' <expression> ',' <expression> ')'", rule: "native_string.val = new subString(identifier.lexval, expressoin1.val, expression2.val)"});
        $$ = new SubString(new Identifier($1, @1.first_line, @1.first_column), $5, $7, null, "substring", [], [], @1.first_line, @1.first_column)
    }
	| STRING DOT RSUBSTRING PARLEFT expression COMMASIGN expression PARRIGHT {
		grammatical.push({gram: "<native_strings> ::= string '.' 'subString' '(' <expression> ',' <expression> ')'", rule: "native_string.val = new subString(string.lexval, expression1.val, expression2.val)"});
		$$ = new SubString(new Primitive($1, type.STRING, this._$.first_line, this._$.first_column), $5, $7, null, "substring", [], [], this._$.first_line, this._$.first_column);
	}
;

native_function
    : type DOT RPARSE PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_function> ::= <type> '.' 'parse' '(' <expression> ')'", rule: "native_function.val = new parse(type.val, expression.val)"});
        $$ = new Parse($1, $5, @1.first_line, @1.first_column);
    }
;

native_parse
	: RTOINT PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_parse> ::= 'toInt' '(' <expression> ')'", rule: "native_parse.val = new toInt(expression.val)"});
		$$ = new ToInt($3, null, "toInt", [], [], this._$.first_line, this._$.first_column);
	}
	| RTODOUBLE PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_parse> ::= 'toDouble' '(' <expression> ')'", rule: "native_parse.val = new toDouble(expression.val)"});
		$$ = new ToDouble($3, null, "toDouble", [], [], this._$.first_line, this._$.first_column);
	}
	| FSTRING PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_parse> ::= 'string' '(' <expression> ')'", rule: "native_parse.val = new string(expression.val)"});
		$$ = new String($3, null, "string", [], [], this._$.first_line, this._$.first_column);
	}
	| FSTRING PARLEFT values_array PARRIGHT {
		grammatical.push({gram: "<native_parse> ::= 'string' '(' <values_array> ')'", rule: "native_parse.val = new string(values_array.list)"});
		$$ = new String(new Values_array($3, this._$.first_line, this._$.first_column), null, "string", [], [], this._$.first_line, this._$.first_column);
	}
;

native_type
	: RTYPEOF PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_type> ::= 'typeof' '(' <expression> ')'", rule: "native_type.val = new typeof(expression.val)"});
		$$ = new TypeOf($3, null, "typeof", [], [], this._$.first_line, this._$.first_column);
	}
	| RTYPEOF PARLEFT values_array PARRIGHT {
		grammatical.push({gram: "<native_type> ::= 'typeof' '(' <values_array> ')'", rule: "native_type.val = new typeof(values_array.list)"});
		$$ = new TypeOf(new Values_array($3, this._$.first_line, this._$.first_column), null, "typeof", [], [], this._$.first_line, this._$.first_column);
	}
;

native_arithmetic
	: RPOW PARLEFT expression COMMASIGN expression PARRIGHT {
		grammatical.push({gram: "<native_arithmetic> ::= 'pow' '(' <expression> ',' <expression> ')'", rule: "native_arithmetic.val = new pow(expression1.val, expression2.val)"});
		$$ = new Pow($3, $5, null, "pow", [], [], this._$.first_line, this._$.first_column);
	}
	| RSIN PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_arithmetic> ::= 'sin' '(' <expression> ')'", rule: "native_arithmetic.val = new sin(expression.val)"});
		$$ = new Sin($3, null, "sin", [], [], this._$.first_line, this._$.first_column);
	}
	| RCOS PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_arithmetic> ::= 'cos' '(' <expression> ')'", rule: "native_arithmetic.val = new cos(expression.val)"});
		$$ = new Cos($3, null, "cos", [], [], this._$.first_line, this._$.first_column);
	}
	| RTAN PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_arithmetic> ::= 'tan' '(' <expression> ')'", rule: "native_arithmetic.val = new tan(expression.val)"});
		$$ = new Tan($3, null, "tan", [], [], this._$.first_line, this._$.first_column);
	}
	| RSQRT PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_arithmetic> ::= 'sqrt' '(' <expression> ')'", rule: "native_arithmetic.val = new sqrt(expression.val)"});
		$$ = new Sqrt($3, null, "sqrt", [], [], this._$.first_line, this._$.first_column);
	}
;

native_array_push
	: IDENTIFIER DOT RPUSH PARLEFT expression PARRIGHT {
		grammatical.push({gram: "<native_array_push> ::= identifier '.' 'push' '(' <expression> ')'", rule: "native_array_push.val = new push(identifier.lexval, expression.val)"});
		$$ = new Push(new Identifier($1, this._$.first_line, this._$.first_column), $5, null, "push", [], [], this._$.first_line, this._$.first_column);
	}
;

native_array_pop
	: IDENTIFIER DOT RPOP PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_array_pop> ::= identifier '.' 'pop' '(' ')'", rule: "native_array_pop.val = new pop(identifier.lexval)"});
		$$ = new Pop(new Identifier($1, this._$.first_line, this._$.first_column), null, "pop", [], [], this._$.first_line, this._$.first_column);
	}
;

native_ts 
	: RGRAPH PARLEFT PARRIGHT {
		grammatical.push({gram: "<native_ts> ::= 'graficar_ts' '(' ')'", rule: "native_ts.val = new graficaTs()"});
		$$ = new Graficar_ts(null, "graficar_ts", [], [], this._$.first_line, this._$.first_column);
	}
;

expression
	: SUBSIGN expression %prec UMENOS       { grammatical.push({gram: "<expression> ::= '-' <expressoin>", rule: "expression.val = - expression1.val"}); $$ = new Arithmetic($2, null, Arithmetic_operator.SUBSTRACTION, @1.first_line, @1.first_column); }
	| expression PLUSSIGN expression        { grammatical.push({gram: "<expression> ::= <expression> '+' <expression>", rule: "expression.val = expression1.val + expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.ADDITION, @1.first_line, @1.first_column); }
	| expression SUBSIGN expression         { grammatical.push({gram: "<expression> ::= <expression> '-' <expression>", rule: "expression.val = expression1.val - expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.SUBSTRACTION, @1.first_line, @1.first_column); }
	| expression MULTSIGN expression        { grammatical.push({gram: "<expression> ::= <expression> '*' <expression>", rule: "expression.val = expression1.val * expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.MULTIPLICATION, @1.first_line, @1.first_column); }
	| expression DIVSIGN expression         { grammatical.push({gram: "<expression> ::= <expression> '/' <expression>", rule: "expression.val = expression1.val / expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.DIVISION, @1.first_line, @1.first_column); }
	| expression MODSIGN expression			{ grammatical.push({gram: "<expression> ::= <expression> '%' <expression>", rule: "expression.val = expression1.val % expression2.val"}); $$ = new Arithmetic($1, $3, Arithmetic_operator.MODULS, @1.first_line, @1.first_column); }
	| expression INCSIGN					{ grammatical.push({gram: "<expression> ::= <expression> '++'", rule: "expression.val = new Inc(expression.val, ++)"}); $$ = new Arithmetic($1, null, Arithmetic_operator.INC, @1.first_line, @1.first_column); }
	| expression DECSIGN					{ grammatical.push({gram: "<expression> ::= <expression> '--'", rule: "expression.val = new Dec(expression.val, --)"}); $$ = new Arithmetic($1, null, Arithmetic_operator.DEC, @1.first_line, @1.first_column); }
	| expression EQUALIZATIONSIGN expression{ grammatical.push({gram: "<expression> ::= <expression> '==' <expression>", rule: "expression.val = expression1.val == expression2.val"}); $$ = new Relational($1, $3, Relational_operator.EQUAL, @1.first_line, @1.first_column); }
	| expression DIFFSIGN expression		{ grammatical.push({gram: "<expression> ::= <expression> '!=' <expression>", rule: "expression.val = expression1.val != expression2.val"}); $$ = new Relational($1, $3, Relational_operator.UNEQUAL, @1.first_line, @1.first_column); }
	| expression LESSEQUAL expression		{ grammatical.push({gram: "<expression> ::= <expression> '<=' <expression>", rule: "expression.val = expression1.val <= expression2.val"}); $$ = new Relational($1, $3, Relational_operator.LESSEQUAL, @1.first_line, @1.first_column); }
	| expression GREATEREQUAL expression	{ grammatical.push({gram: "<expression> ::= <expression> '>=' <expression>", rule: "expression.val = expression1.val >= expression2.val"}); $$ = new Relational($1, $3, Relational_operator.GREATEREQUAL, @1.first_line, @1.first_column); }
	| expression SMALLERTHAN expression		{ grammatical.push({gram: "<expression> ::= <expression> '<' <expression>", rule: "expression.val = expression1.val < expression2.val"}); $$ = new Relational($1, $3, Relational_operator.LESS, @1.first_line, @1.first_column); }
	| expression GREATERTHAN expression		{ grammatical.push({gram: "<expression> ::= <expression> '>' <expression>", rule: "expression.val = expression1.val > expression2.val"}); $$ = new Relational($1, $3, Relational_operator.GREATER, @1.first_line, @1.first_column); }
	| expression CONCAT expression          { grammatical.push({gram: "<expression> ::= <expression> '&' <expression>", rule: "expression.val = expression1.val & expression2.val"}); $$ = new StringText($1, $3, String_operator.CONCAT, @1.first_line, @1.first_column); }
	| expression REPETITIONSIGN expression  { grammatical.push({gram: "<expression> ::= <expression> '^' <expression>", rule: "expression.val = expression1.val ^ expression2.val"}); $$ = new StringText($1, $3, String_operator.REPETITION, @1.first_line, @1.first_column); }
	| expression AND expression				{ grammatical.push({gram: "<expression> ::= <expression> '&&' <expression>", rule: "expression.val = expression1.val && expression2.val"}); $$ = new Logical($1, $3, Logical_operator.AND, @1.first_line, @1.first_column); }
	| expression OR expression				{ grammatical.push({gram: "<expression> ::= <expression> '||' <expression>", rule: "expression.val = expression1.val || expression2.val"}); $$ = new Logical($1, $3, Logical_operator.OR, @1.first_line, @1.first_column); }
	| NOT expression %prec UNOT				{ grammatical.push({gram: "<expression> ::= '!' <expression>", rule: "expression.val = !expression1.val"}); $$ = new Logical($2, null, Logical_operator.NOT, @1.first_line, @1.first_column); }
	| INTEGER                               { grammatical.push({gram: "<expression> ::= integer", rule: "expression.val = integer.lexval"}); $$ = new Primitive($1, type.INT, @1.first_line, @1.first_column); }
	| DOUBLE                                { grammatical.push({gram: "<expression> ::= double", rule: "expression.val = double.lexval"}); $$ = new Primitive($1, type.DOUBLE, @1.first_line, @1.first_column) }
	| STRING                                { grammatical.push({gram: "<expression> ::= string", rule: "expression.val = string.lexval"}); $$ = new Primitive($1, type.STRING, @1.first_line, @1.first_column); }
	| CHAR									{ grammatical.push({gram: "<expression> ::= char", rule: "expression.val = char.lexval"}); $$ = new Primitive($1, type.CHAR, @1.first_line, @1.first_column); }
	| boolean								{ grammatical.push({gram: "<expression> ::= <boolean>", rule: "expression.val = boolean.val"}); $$ = new Primitive($1, type.BOOL, @1.first_line, @1.first_column); }
	| VOID                                  { grammatical.push({gram: "<expression> ::= 'void'", rule: "expression.val = 'void'"}); $$ = new Primitive($1, type.VOID, @1.first_line, @1.first_column); }
	| RNULL                                 { grammatical.push({gram: "<expression> ::= 'null'", rule: "expression.val = 'null'"}); $$ = new Primitive($1, type.NULL, @1.first_line, @1.first_column); }
	| IDENTIFIER list_brackets				{ grammatical.push({gram: "<expression> ::= identifier <list_brackets>", rule: "expression.val = new access_array(identifier.lexval, list_brackets.list)"}); $$ = new Access_array(new Identifier($1, this._$.first_line, this._$.first_column), $2, null, this._$.first_line, this._$.first_column); }
	| IDENTIFIER							{ grammatical.push({gram: "<expression> ::= identifier", rule: "expression.val = identifier.lexval"}); $$ = new Identifier($1, @1.first_line, @1.first_column); }
	| PARLEFT expression PARRIGHT           { grammatical.push({gram: "<expression> ::= '(' <expresssion> ')'", rule: "expression.val = expression1.val"}); $$ = $2; }
	| prod_ternary                          { grammatical.push({gram: "<expression> ::= <prod_ternary>", rule: "expression.val = prod_ternary.val"}); $$ = $1; }
	| call_function                         { grammatical.push({gram: "<expression> ::= <call_function>", rule: "expression.val = call_function.val"}); $$ = $1; }
	| native_strings %prec FSTRING          { grammatical.push({gram: "<expression> ::= <native_strings>", rule: "expression.val = native_strings.val"}); $$ = $1; }
	| native_function %prec FCAST			{ grammatical.push({gram: "<expression> ::= <native_function>", rule: "expression.val = native_function.val"}); $$ = $1; }
	| native_parse %prec FCAST				{ grammatical.push({gram: "<expression> ::= <native_parse>", rule: "expression.val = native_parse.val"}); $$ = $1; }
	| native_arithmetic %prec FCAST			{ grammatical.push({gram: "<expression> ::= <native_arithmetic>", rule: "expression.val = native_arithmetic.val"}); $$ = $1; }
	| native_type							{ grammatical.push({gram: "<expression> ::= <native_type>", rule: "expression.val = native_type.val"}); $$ = $1; }
	| native_array_pop						{ grammatical.push({gram: "<expression> ::= <native_array_pop>", rule: "expression.val = native_array_pop.val"}); $$ = $1; }
	| access_struct							{ grammatical.push({gram: "<expression> ::= <access_struct>", rule: "expression.val = access_struct.val"}); $$ = $1; }
	| range									{ grammatical.push({gram: "<expression> ::= <range>", rule: "expression.val = range.val"}); $$ = $1; }
;

boolean
	: RTRUE		{ grammatical.push({gram: "<boolean> ::= 'true'", rule: "boolean.val = 'true'"}); $$ = $1}
	| RFALSE 	{ grammatical.push({gram: "<boolean> ::= 'false'", rule: "boolean.val = 'false'"}); $$ = $1}
;