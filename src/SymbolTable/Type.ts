export enum type {
    INT         = "int",
    FLOAT       = "float",
    STRING      = "string",
    CHAR        = "char",
    BOOL        = "bool",
    ARRAY       = "array",
    STRUCT      = "struct"
}

export enum Arithmetic_operator {
    ADDITION            = "+",
    SUBSTRACTION        = "-",
    MULTIPLICATION      = "*",
    DIVISION            = "/",
    POWER               = "**",
    MODULS              = "%",
    INC                 = "++",
    DEC                 = "--",
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
