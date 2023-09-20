import { Logger } from "../../shared/utilities/logging/logger";

import { Context,LogMessageTypes,TimeTracking } from "../../shared/enums/logging/general";
export const initializeLogger = function(req, functionName:string){
    const correlationId = req.correlationId();
    const logger = new Logger({context: Context.API, functionName, correlationId});
    logger.log({
    message: `Function Entry:${functionName}`,
    type: LogMessageTypes.API_EXECUTION_STARTED,
    timeTracking: TimeTracking.start
  });
  return logger;
}

export const getLogger = function(correlationId, context,functionName){
  const logger = new Logger({context, functionName, correlationId});
  logger.log({
  message: `Function Entry:${functionName}`,
  type: LogMessageTypes.API_EXECUTION_STARTED,
  timeTracking: TimeTracking.start
});
return logger;
}

export const logDBError = function(logger:Logger,error){
  logger.log({
  message:error.message || 'Unknown error',
  type: LogMessageTypes.DB_ERROR,
  objToLog: error
});
return logger;
}

export const endLogger = function(logger:Logger){
  logger.log({
  message: `Function Exit:${logger.baseAttributes.functionName}`,
  type: LogMessageTypes.API_EXECUTION_FINISHED,
  timeTracking: TimeTracking.end
});
}