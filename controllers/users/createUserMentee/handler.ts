import { HTTP_RESPOSE_CODES,Operations } from "../../../shared/enums/routing/general";
import { IHandler } from "../../../shared/interfaces/controllers/handlers";
import { MongoDAL } from "../../../shared/db/mongoose/dal";
import { initializeLogger,endLogger,logDBError } from "../../commonUtils/logging";
import { HTTP_RESOURCES} from "../../../shared/reqRouters/resourses";
import { DB_ERRORS } from "../../../shared/constants/errors/apiErrors";
// import {
//   initializeLogger,
//   endLogger,
//   logDBError,
// } from "../../commonUtils/logging";
// import{logDb}
import { Logger } from "../../../shared/utilities/logging/logger";
const functionContext = "createUserMentee";
export class CreateUserMenteeHandler implements IHandler {
  operation: Operations;
  isIdempotent: boolean;
  resource: string;
  validations: any[];
  constructor() {
    this.operation = Operations.CREATE;
    this.isIdempotent = false;
    this.resource = HTTP_RESOURCES.users;
    this.handler = this.handler.bind(this);
   
  }

  async handler(req: any, res: any, next) {
    const logger: Logger = initializeLogger(req, functionContext);
    const mongoDal = new MongoDAL();
    // const uniqueClientId = `${(req.body.clientName.toLowerCase()).replace(/\s+/g, "_")}-${req.body.panNumber}`;
    try {
      const params = {
        data: {
          ...req.body,
        },
        constraints: { unique: [{ emaiId: req.body.emailId }] },
      }
      console.log(params)
      await mongoDal.createItem(this.resource, params);
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
    res.status(200).send(req.body);
}
}