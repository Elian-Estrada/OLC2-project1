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
"Evaluar"           return 'REVALUAR';

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

\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
[0-9]+("."[0-9]+)?\b                                          return 'DECIMAL';
[0-9]+\b                                                      return 'ENTERO';
([a-zA-Z])[a-zA-Z0-9_]*	                                      return 'IDENTIFICADOR';

<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

%{
    const Arithmetic            = require('./Expression/Arithmetic');
%}

/* Operators Precedence */
%left 'PLUSSIGN' 'SUBSIGN'
%left 'MULTSIGN' 'DIVSIGN'
%left UMENOS

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
	: REVALUAR BRACKETLEFT expression BRACKETRIGHT SEMICOLON {
		return 'El valor de la expresión es: ' + $3;
	}
;

type
    : RINT 	{ $$ = 'entero'; }
    | RDOUBLE 	{ $$ = 'decimal'; }
    | RBOOLEAN 	{ $$ = 'booleano'; }
    | RCHAR 	{ $$ = 'caracter'; }
    | RSTRING 	{ $$ = 'cadena'; }
;

expression
	: SUBSIGN expression %prec UMENOS  { $$ = $2 *-1; }
	| expression PLUSSIGN expression       { $$ = new Arithmetic($1, $3, '+', @1.first_line, @1.first_column) }
	| expression SUBSIGN expression     { $$ = $1 - $3; }
	| expression MULTSIGN expression       { $$ = $1 * $3; }
	| expression DIVSIGN expression  { $$ = $1 / $3; }
	| INTEGER                        { $$ = Number($1); }
	| DECIMAL                       { $$ = Number($1); }
	| PARLEFT expression PARRIGHT       { $$ = $2; }
;