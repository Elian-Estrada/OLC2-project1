import {type} from './Type';

export default class Symbol {

    
    private _id : String;
    private _type : type;
    private _value : any;
    private _environment : String|undefined;
    private _row : Number;
    private _column : Number;
    
    constructor(id: String, type: type, row: Number, column: Number, value: any, environment?: String) {
        this._id = id;
        this._type = type;
        this._row = row;
        this._column = column;
        this._value = value;
        this._environment = environment;
    }

    public get id() : String {
        return this._id;
    }
    public set id(v : String) {
        this._id = v;
    }
    
    public get type() : type {
        return this._type;
    }
    public set type(v : type) {
        this._type = v;
    }
    
    public get value() : any {
        return this._value;
    }
    public set value(v : any) {
        this._value = v;
    }
    
    public get environment() : String|undefined {
        return this._environment;
    }
    public set environment(v : String|undefined) {
        this._environment = v;
    }
    
    public get row() : Number {
        return this._row;
    }
    public set row(v : Number) {
        this._row = v;
    }
    
    public get column() : Number {
        return this._column;
    }
    public set column(v : Number) {
        this._column = v;
    }
    

}