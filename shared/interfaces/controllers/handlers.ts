import { Operations } from "../../enums/routing/general";
export interface IHandler{
    operation:Operations;
    isIdempotent:boolean;
    operationId:string;
    resource: string;
    handler: (validHeader,validBody, next) => void;
    validations:Array<any>;
}