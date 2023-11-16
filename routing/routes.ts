import { HTTP_METHODS } from "../shared/reqRouters/reqMethods";
import { APP_CONSTANTS } from "../shared/constants/app/general";
import { Operations } from "../shared/enums/routing/general";
import { errorHandler } from "../middlewere/errorHandler";
import { IHandler } from "../shared/interfaces/controllers/handlers";
import { CreateUserMenteeHandler } from "../controllers/users";
import { GetUserMenteeHandler } from "../controllers/users/getUserMentee/handler";
import { UpdateUserHandler } from "../controllers/users/UpdateUser/handler";
import { DeleteUserHandler } from "../controllers/users/DeleteUser/DeleteUser";
const MAP_KEY_PAIR = [
    [Operations.CREATE, HTTP_METHODS.POST], [Operations.REPLACE, HTTP_METHODS.PUT],
    [Operations.DELETE, HTTP_METHODS.DELETE], [Operations.UPDATE, HTTP_METHODS.PATCH],
    [Operations.INVOKE, HTTP_METHODS.POST], [Operations.READ, HTTP_METHODS.GET]
];
const HTTP_OPERATION_MAP = new Map(MAP_KEY_PAIR as any);
const API_VERSION =  APP_CONSTANTS.APP_VERSION;
export const registerRoutes = function (app) {

    const routeHandlers: Array<IHandler> = getAllRouteHandlers();
    routeHandlers.forEach(element => {
        const httpMethod = HTTP_OPERATION_MAP.get(element.operation) as string;
        const relativePath = `/${API_VERSION}/${element.resource}`;
        app[httpMethod](
            relativePath,
             element.handler);
    });
    app.use(errorHandler);
    
}
function getAllRouteHandlers(): Array<IHandler> {

    const routeHandlers: Array<IHandler> = [];
    routeHandlers.push(new CreateUserMenteeHandler());
    routeHandlers.push(new GetUserMenteeHandler())
    routeHandlers.push(new UpdateUserHandler())
    routeHandlers.push(new DeleteUserHandler())
   
    return routeHandlers;
}