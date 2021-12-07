export enum type {
    INT         = "int",
    DOUBLE      = "double",
    STRING      = "string",
    CHAR        = "char",
    BOOL        = "boolean",
    ARRAY       = "array",
    STRUCT      = "struct",
    NULL        = "null"
}

export enum Arithmetic_operator {
    ADDITION            = "+",
    SUBSTRACTION        = "-",
    MULTIPLICATION      = "*",
    DIVISION            = "/",
    MODULS              = "%",
    INC                 = "++",
    DEC                 = "--",
    REPETITION          = "^",
}

export enum Relational_operator {
    EQUAL           = "==",
    UNEQUAL         = "!=",
    GREATER         = ">",
    GREATEREQUAL    = ">=",
    LESS            = "<",
    LESSEQUAL       = "<="
}

export enum Logical_operator {
    AND     = "&&",
    NOT     = "!",
    OR      = "||"
}

export enum String_operator {
    CONCAT      = "&",
    REPETITION  = "^"
}
