import { TimeTracking,LogMessageTypes } from "../../enums/logging/general";
export interface IBaseLog{
    message:string;
    type: LogMessageTypes;
    timeTracking?: TimeTracking;
    objToLog?:any;
}