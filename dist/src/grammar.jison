/**
 * Ejemplo mi primer proyecto con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
%lex

%options case-insensitive

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
"string"            return 'RSTRING';
"null"              return 'RNULL';

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

/* Generic Functions */
"function"          return 'RFUNCTION';
"void"              return 'RVOID';

/* Language Functions */
"pow"               return 'RPOW';
"sqrt"              return 'RSQRT';
"sin"               return 'RSIN';
"cos"               return 'RCOS';
"tan"               return 'RTAN';
"print"             return 'RPRINT';
"println"           return 'RPRINTLN';

/* Boolean's values */
"true"				return 'RTRUE';
"false"				return 'RFALSE';

/* ---------------------------------------- Tokens ---------------------------------------- */
/* Special Characters */
":"                 return 'TWOPOINTS';
"^"                 return 'REPETITIONSIGN';

/* Grouping Signs  */
"("                 return 'PARLEFT';
")"                 return 'PARRIGHT';

/* Arrays Signs */
","                 return 'COMMA';
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

/* Declaration and Assignment */
"="                 return "EQUALSIGN";

/* White Spaces */
[ \r\t]+            {}
\n                  {}

\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); 	return 'STRING'; }
"'"[^']"'"				{ yytext = yytext.substr(1, yyleng-2); 	return 'CHAR'; }
[0-9]+"."[0-9]+\b                                          		return 'DOUBLE';
[0-9]+\b                                                      	return 'INTEGER';
([a-zA-Z])[a-zA-Z0-9_]*	                                      	return 'IDENTIFIER';

<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

%{
	import {type, Relational_operator, Logical_operator, Arithmetic_operator} from "./SymbolTable/Type.js"

    import {Arithmetic} from "./Expression/Arithmetic.js";
	import {Logical} from "./Expression/Logical.js";
	import {Relational} from "./Expression/Relational.js";
    import { Print } from "./Instructions/Print.js";
	import {Primitive} from "./Expression/Primitive.js";
%}

/* Operators Precedence */
%left 'OR'
%left 'AND'
%right UNOT
%nonassoc 'EQUALIZATIONSIGN' 'DIFFSIGN' 'LESSEQUAL' 'GREATEREQUAL' 'SMALLERTHAN' 'GREATERTHAN'
%left 'PLUSSIGN' 'SUBSIGN'
%left 'MULTSIGN' 'DIVSIGN'
%right UMENOS
%left 'RINCSIGN' 'RDECSIGN'

%start ini

%% /* Grammar Definition */

ini
	: instructions EOF {
	    return $1;
	}
;

instructions
	: instructions instruction          { $1.push($2); $$ = $1; }
	| instruction                       { $$ = [$1]; }
	| error { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); }
;

instruction
    : prod_print SEMICOLON { $$ = $1; }
	| REVALUAR BRACKETLEFT expression BRACKETRIGHT SEMICOLON {
		return 'El valor de la expresión con print es: ' + $3;
	}
;

prod_print
    : RPRINT PARLEFT expression PARRIGHT {
        $$ = new Print($3, @1.first_line, @1.first_column, false);
    }
	| RPRINTLN PARLEFT expression PARRIGHT { $$ = new Print($3, @1.first_line, @1.first_column)}
;

type
    : RINT 	{ $$ = type.INT; }
    | RDOUBLE 	{ $$ = type.DOUBLE; }
    | RBOOLEAN 	{ $$ = type.BOOL; }
    | RCHAR 	{ $$ = type.CHAR; }
    | RSTRING 	{ $$ = type.STRING; }
	| RNULL		{ $$ = type.NULL; }
;

expression
	: SUBSIGN expression %prec UMENOS       { $$ = new Arithmetic($2, null, Arithmetic_operator.SUBSTRACTION, @1.first_line, @1.first_column); }
	| expression PLUSSIGN expression        { $$ = new Arithmetic($1, $3, Arithmetic_operator.ADDITION, @1.first_line, @1.first_column); }
	| expression SUBSIGN expression         { $$ = new Arithmetic($1, $3, Arithmetic_operator.SUBSTRACTION, @1.first_line, @1.first_column); }
	| expression MULTSIGN expression        { $$ = new Arithmetic($1, $3, Arithmetic_operator.MULTIPLICATION, @1.first_line, @1.first_column); }
	| expression DIVSIGN expression         { $$ = new Arithmetic($1, $3, Arithmetic_operator.DIVISION, @1.first_line, @1.first_column); }
	| expression MODSIGN expression			{ $$ = new Arithmetic($1, $3, Arithmetic_operator.MODULS, @1.first_line, @1.first_column); }
	| expression EQUALIZATIONSIGN expression{ $$ = new Relational($1, $3, Relational_operator.EQUAL, @1.first_line, @1.first_column); }
	| expression DIFFSIGN expression		{ $$ = new Relational($1, $3, Relational_operator.UNEQUAL, @1.first_line, @1.first_column); }
	| expression LESSEQUAL expression		{ $$ = new Relational($1, $3, Relational_operator.LESSEQUAL, @1.first_line, @1.first_column); }
	| expression GREATEREQUAL expression	{ $$ = new Relational($1, $3, Relational_operator.GREATEREQUAL, @1.first_line, @1.first_column); }
	| expression SMALLERTHAN expression		{ $$ = new Relational($1, $3, Relational_operator.LESS, @1.first_line, @1.first_column); }
	| expression GREATERTHAN expression		{ $$ = new Relational($1, $3, Relational_operator.GREATER, @1.first_line, @1.first_column); }
	| expression AND expression				{ $$ = new Logical($1, $3, Logical_operator.AND, @1.first_line, @1.first_column); }
	| expression OR expression				{ $$ = new Logical($1, $3, Logical_operator.AND, @1.first_line, @1.first_column); }
	| NOT expression %prec UNOT				{ $$ = new Logical($1, $3, Logical_operator.AND, @1.first_line, @1.first_column); }
	| INTEGER                               { $$ = new Primitive($1, type.INT, @1.first_line, @1.first_column); }
	| DOUBLE                                { $$ = new Primitive($1, type.DOUBLE, @1.first_line, @1.first_column) }
	| STRING                                { $$ = new Primitive($1, type.STRING, @1.first_line, @1.first_column); }
	| CHAR									{ $$ = new Primitive($1, type.CHAR, @1.first_line, @1.first_column); }
	| boolean								{ $$ = new Primitive($1, type.BOOL, @1.first_line, @1.first_column); }
	| PARLEFT expression PARRIGHT           { $$ = $2; }
;

boolean 
	: RTRUE		{ $$ = $1}
	| RFALSE 	{ $$ = $1}
;