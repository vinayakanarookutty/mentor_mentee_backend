import { Operations } from "../../enums/routing/general";
export interface IHandler{
    operation:Operations;
    isIdempotent:boolean;
    resource: string;
    handler: (validHeader,validBody, next) => void;

}