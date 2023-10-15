import { HTTP_RESPOSE_CODES,Operations } from "../../../shared/enums/routing/general";
import { IHandler } from "../../../shared/interfaces/controllers/handlers";
import { MongoDAL } from "../../../shared/db/mongoose/dal";
import { initializeLogger,endLogger,logDBError } from "../../commonUtils/logging";
import { HTTP_RESOURCES} from "../../../shared/reqRouters/resourses";
import { DB_ERRORS } from "../../../shared/constants/errors/apiErrors";

import { hashPassword,verifyPassword } from "../../../shared/config/authorisation/HashPassword";
import { Logger } from "../../../shared/utilities/logging/logger";
const functionContext = "createUserMentor";
export class CreateUserMentorHandler implements IHandler {
  operation: Operations;
  isIdempotent: boolean;
  resource: string;
  validations: any[];
  constructor() {
    this.operation = Operations.CREATE;
    this.isIdempotent = false;
    this.resource = HTTP_RESOURCES.mentors;
    this.handler = this.handler.bind(this);
   
  }

  async handler(req: any, res: any, next) {
    const logger: Logger = initializeLogger(req, functionContext);
    const mongoDal = new MongoDAL();
    // const uniqueClientId = `${(req.body.clientName.toLowerCase()).replace(/\s+/g, "_")}-${req.body.panNumber}`;
   

      if(req.body.status=='Login')
      {
        try{
          console.log(req.body)
          
        const  result = await mongoDal.getItem({ resource: this.resource, queryObj: {emailId:req.body.userName} });
       console.log(result)
        if (result==null)
        {
         res.status(202).send({ message: " This email doenot exists " });
        }
      
        const passwordVerified = await verifyPassword(req.body.password, result.password);
        console.log(passwordVerified)
        if (passwordVerified==false)
        {
         res.status(201).send({ message: "Incorrect password" });
        }
        else{
          res.status(200).send({name:result.name,emailId:result.emailId});
        }
  
        endLogger(logger);
      }catch (err) {
          logDBError(logger, err);
          if (err.name && err.name == DB_ERRORS.uniqueCheckFailed) {
            next({
              errorCode: HTTP_RESPOSE_CODES.DUPLICATE,
              message: err.message,
              details: "Please check email",
            });
          } else {
            next(err);
          }
          endLogger(logger);
          return;
    
        }
     

      }
      else
      {
        try {
          const hashedPassword = await hashPassword(req.body.password);
          const params = {
            data: {
             name:req.body.name,
             phoneNumber:req.body.phoneNumber,
             emailId:req.body.emailId,
             password:hashedPassword
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
              details: "Please check the Email",
            });
          } else {
            next(err);
          }
          return;
        }
        res.status(200).send(req.body);
    }
        
      }
    
}