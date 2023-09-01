import { createLogger, transports, format } from "winston";
import { IBaseLog } from "../../interfaces/logging/baseLog";
import { APP_CONSTANTS } from "../../constants/app/general";
import { Context } from "../../enums/logging/general";
const { combine, timestamp } = format;
const winstonLogger = createLogger({
  format: combine(
    timestamp(),
    format.json(),
  ),
  transports: [new transports.Console()],
});
interface IBaseAttributes{
  correlationId: string,
  functionName: string,
  env: string,
  app: string,
  context: Context,
}
export class Logger {
  baseAttributes:IBaseAttributes;
  logger: {log:(objectToLog: object) => void};
  app: string;
  env: string;
  apiId: string;
  initTime: Date
  responseTime: number;
  timeUnit: string;

  constructor({correlationId, functionName, context}) {
    this.baseAttributes = {context, correlationId, functionName, app: APP_CONSTANTS.APP_NAME, env:process.env.NODE_ENV || 'local'};
    this.logger = winstonLogger;
    this.log = this.log.bind(this);
  }
  private buildLogMessage({timeTracking,...input}:IBaseLog){
    if(timeTracking && timeTracking === 'start') this.initTime = new Date();
    const responseTime = (timeTracking && timeTracking === 'end')? new Date().getTime() - this.initTime.getTime(): null;
    return responseTime ? {
     ...this.baseAttributes,
     ...input,
     level:'info',
      responseTime
    }: {
      ...this.baseAttributes,
      ...input,
      level:'info',
     }

  }

  log(input:IBaseLog) {
    const finalObjToLog = this.buildLogMessage(input);
    this.logger.log(finalObjToLog);
  }
}
