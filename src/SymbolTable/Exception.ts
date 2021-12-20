export default class Exception {

    private type: String;
    private description: String;
    private row: Number;
    private column: Number;
    private environment: String | undefined;

    constructor(type: String, description: String, row: Number, column: Number, environment?: String){

        this.type = type;
        this.description = description;
        this.row = row;
        this.column = column;
        this.environment = environment;

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

    public getEnvironment(): String | undefined {
        return this.environment;
    }

    public toString(): String{
        return `--> ${this.getType()} - ${this.getDescription()} in ${this.getEnvironment()} on [${this.getRow()}, ${this.getColumn()}]`;
    }

}