import { HTTP_RESPOSE_CODES,Operations } from "../../../shared/enums/routing/general";
import { IHandler } from "../../../shared/interfaces/controllers/handlers";
import { MongoDAL } from "../../../shared/db/mongoose/dal";
import { initializeLogger,endLogger,logDBError } from "../../commonUtils/logging";
import { HTTP_RESOURCES} from "../../../shared/reqRouters/resourses";
import { DB_ERRORS } from "../../../shared/constants/errors/apiErrors";

import { hashPassword } from "../../../shared/config/authorisation/HashPassword";
import { Logger } from "../../../shared/utilities/logging/logger";
const functionContext = "getUserMentee";
export class GetUserMenteeHandler implements IHandler {
  operation: Operations;
  isIdempotent: boolean;
  resource: string;
  validations: any[];
  constructor() {
    this.operation = Operations.READ;
    this.isIdempotent = false;
    this.resource = HTTP_RESOURCES.users;
    this.handler = this.handler.bind(this);
   
  }

  async handler(req: any, res: any, next) {
    const logger: Logger = initializeLogger(req, functionContext);
    const mongoDal = new MongoDAL();
    let result
    const query = req.query;
    // const uniqueClientId = `${(req.body.clientName.toLowerCase()).replace(/\s+/g, "_")}-${req.body.panNumber}`;
    try {
      result = await mongoDal.getItemList({ resource: this.resource, queryObj: query });
               
                res.status(200).send(result);
                endLogger(logger);
    } catch (err) {
      logDBError(logger, err);
      if (err.name && err.name == DB_ERRORS.uniqueCheckFailed) {
        next({
          errorCode: HTTP_RESPOSE_CODES.DUPLICATE,
          message: err.message,
          details: "Please check the pan number",
        });
      } else {
        next(err);
      }
      return;
    }
    // res.status(200).send(req.body);
}
}