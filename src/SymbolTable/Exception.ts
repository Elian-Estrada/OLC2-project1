export default class Exception {

    private type: String;
    private description: String;
    private row: Number;
    private column: Number;

    constructor(type: String, description: String, row: Number, column: Number){

        this.type = type;
        this.description = description;
        this.row = row;
        this.column = column;

    }


    public getType(): String{
        return this.type;
    }

    public getDescription(): String {
        return this.description;
    }

    public getRow(): Number{
        return this.row;
    }

    public getColumn(): Number{
        return this.column;
    }

    public toString(): String{
        return `--> ${this.getType()} - ${this.getDescription()} in [${this.getRow()}, ${this.getColumn()}]`;
    }

}