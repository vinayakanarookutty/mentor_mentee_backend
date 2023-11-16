import { HTTP_RESPOSE_CODES,Operations } from "../../../shared/enums/routing/general";
import { IHandler } from "../../../shared/interfaces/controllers/handlers";
import { MongoDAL } from "../../../shared/db/mongoose/dal";
import { initializeLogger,endLogger,logDBError } from "../../commonUtils/logging";
import { HTTP_RESOURCES} from "../../../shared/reqRouters/resourses";
import { DB_ERRORS } from "../../../shared/constants/errors/apiErrors";

import { hashPassword } from "../../../shared/config/authorisation/HashPassword";
import { Logger } from "../../../shared/utilities/logging/logger";
const functionContext = "getUserMentee";
export class UpdateUserHandler implements IHandler {
  operation: Operations;
  isIdempotent: boolean;
  resource: string;
  validations: any[];
  constructor() {
    this.operation = Operations.UPDATE;
    this.isIdempotent = true;
    this.resource = HTTP_RESOURCES.users;
    this.handler = this.handler.bind(this);
   
  }

  async handler(req: any, res: any, next) {
    const logger: Logger = initializeLogger(req, functionContext);
    const mongoDal = new MongoDAL();
    // const uniqueClientId = `${(req.body.clientName.toLowerCase()).replace(/\s+/g, "_")}-${req.body.panNumber}`;
    const { uniqueClientId,status } = req.body;

    if (!uniqueClientId) {
      return res.status(400).json({ message: "Client Id not provided" });
    }
   

    try {
       
        
      
      delete req.body["uniqueClientId"];
      console.log(uniqueClientId)
      const result = await mongoDal.patchItem({
        resource: this.resource,
        filter: uniqueClientId ,
        attributesToUpdate: req.body,
      });
    
      endLogger(logger);
      
     
    } catch (err) {
      logDBError(logger, err);
      if (err.name && err.name == DB_ERRORS.uniqueCheckFailed) {
        next({
          errorCode: 400,
          message: err.message,
          details: "Please check the request body",
        });
      } else {
        next(err);
      }
      return;
    }
    res.status(200).send("Success");
}
}