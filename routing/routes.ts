import { HTTP_METHODS } from "../shared/reqRouters/reqMethods";
import { APP_CONSTANTS } from "../shared/constants/app/general";
import { Operations } from "../shared/enums/routing/general";
import { errorHandler } from "../middlewere/errorHandler";
import { IHandler } from "../shared/interfaces/controllers/handlers";

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
    // routeHandlers.push(new CreateClientHandler());
    // routeHandlers.push(new GetClientListHandler());
    // routeHandlers.push(new UpdateClientHandler());
    // routeHandlers.push(new TaskCategoryHandler());
    // routeHandlers.push(new TaskCategoryUpdateHandler());
    // routeHandlers.push(new TaskUpdateReasonListPatchHandler);
    // routeHandlers.push(new SearchCognitoUserHandler());
    // routeHandlers.push(new CreateUserHandler());
    // routeHandlers.push(new GetUserListHandler());
    // routeHandlers.push(new UpdateUserHandler());
    // routeHandlers.push(new UserRolesUpdateHandler());
    // routeHandlers.push(new UserRolesHandler());
    // routeHandlers.push(new UserDesignationList());
    // routeHandlers.push(new UserDesignationUpdateHandler());
    // routeHandlers.push(new TaskStatusListHandler());
    // routeHandlers.push(new TaskStatusUpdateHandler());
    // routeHandlers.push(new ClientTypeHandler());
    // routeHandlers.push(new ClientTypeUpdateHandler());
    // routeHandlers.push(new TaskPeriodListHandler());
    // routeHandlers.push(new TaskPeriodUpdateHandler());
    // routeHandlers.push(new TaskDocumentTypeUpdateHandler());
    // routeHandlers.push(new TaskDocumentTypesHandler());
    // routeHandlers.push(new TaskDocumentTypeListPatchHandler());
    // routeHandlers.push(new ClientTypeUpdateHandler());
    // routeHandlers.push(new GetTaskConfigurationHandler());
    // routeHandlers.push(new GetTaskAttachmentsHandler());
    // routeHandlers.push(new AddTaskAttachmentsHandler());
    // routeHandlers.push(new TaskUpdateReasonsListHandler());
    // routeHandlers.push(new TaskUpdateReasonsChangeHandler());
    // routeHandlers.push(new GetClientFileListHandler());
    // routeHandlers.push(new SendEmailHandler());
    // routeHandlers.push(new GetTaskAuditDataHandler());
    // routeHandlers.push(new GetMessagesHandler());
    // routeHandlers.push(new SendMessageHandler());
    // routeHandlers.push(new SendNotificationHandler());
    // routeHandlers.push(new GetNotificationsHandler());
    // routeHandlers.push(new AcknowledgeNotificationsHandler());
    // routeHandlers.push(new DownloadAuditHandler());
    // routeHandlers.push(new GetBranchListHandler());
    // routeHandlers.push(new UpdateBranchHandler());
    // routeHandlers.push(new CreateCognitoUserHandler());
    // routeHandlers.push(new DisableCognitoUserHandler());
    // routeHandlers.push(new UpdateCognitoUserHandler());
    // routeHandlers.push(new TaskPeriodPatchHandler());
    // routeHandlers.push(new TaskStatusListPatchHandler());
    // routeHandlers.push(new AddClientMasterfilesHandler());
    // routeHandlers.push(new GetClientMasterfilesHandler());
    // routeHandlers.push(new UpdateTaskCatagoryFileHandler());
    // routeHandlers.push(new GetTaskCatagoryFileHandler());
    // routeHandlers.push(new DeleteCognitoUserHandler());
    // routeHandlers.push(new MarkAsReadHandler());
    // routeHandlers.push(new EnableCognitoUserHandler());
    // routeHandlers.push(new GetTaskPeriodicityHandler());
    // routeHandlers.push(new GetCompletedTaskHandler());
    // routeHandlers.push(new GetTaskListToBeCreatedHandler());
    // routeHandlers.push(new UpdateTaskPeriodsHandler());
    // routeHandlers.push(new GetSubTaskListHandler());
    // routeHandlers.push(new CreateSubTaskHandler());
    // routeHandlers.push(new EditSubTaskHandler());
    // routeHandlers.push(new GetOrgSettingsHandler());
    // routeHandlers.push(new UpdateOrgSettingsHandler());
    // routeHandlers.push(new CreateTaskClientAssociationHandler());
    // routeHandlers.push(new GetTaskClientAssociationListHandler());
    // routeHandlers.push(new UpdateTaskClientAssociationHandler());
    // routeHandlers.push(new SearchTaskClientAssocListHandler());
    // routeHandlers.push(new GetSubTasksOfTaskClientAssocHandler());
    // routeHandlers.push(new GetTaskClientAssocHandler());
    // routeHandlers.push(new UpdateSubTaskOfTaskClientAssociationHandler());
    // routeHandlers.push(new GenerateTaskClientAssociationListHandler());
    // routeHandlers.push(new MoveToBilledHandler());
    // routeHandlers.push(new GetBilledHandler());
    // routeHandlers.push(new GetUnBilledHandler());
    // routeHandlers.push(new CreateBulkTaskClientAssociationHandler())
    // routeHandlers.push(new RegisterAutomatedTask());
    // routeHandlers.push(new GetRegisteredTasks());
    // routeHandlers.push(new UpdateRegisteredTask());
    // routeHandlers.push(new MoveCompletedTaskToPrimaryHandler());
    // routeHandlers.push(new GenerateNewTaskPeriodsHandler());
    // routeHandlers.push(new MoveToNonBilledHandler());
    // routeHandlers.push(new GetTaskPeriodicityInputsHandler());
    // routeHandlers.push(new GetPrimaryTaskReportHandler());
    // routeHandlers.push(new GetCompletedTaskReportHandler());
    // routeHandlers.push(new GetSubTasksOfAllTaskClientAssocListHandler());
    // routeHandlers.push(new CreateInvoiceHanlder());
    // routeHandlers.push(new GetInvoicesHandler());
    // routeHandlers.push(new UpdateInvoiceHandler());
    // routeHandlers.push(new CreateHsnSacConfigHandler());
    // routeHandlers.push(new GetHscSacConfigHandler());
    // routeHandlers.push(new UpdateHsnSacConfigHandler());
    // routeHandlers.push(new GetHsnSacDetailsHandler());
    // routeHandlers.push(new SnoozeTaskClientAssociationHandler());
    // routeHandlers.push(new GetSnoozedTasksHandler());
    // routeHandlers.push(new MoveSnoozedTaskToPrimaryListHandler());
    // routeHandlers.push(new CreateOrUpdateWorkLogHandler())
    // routeHandlers.push(new GetWorkLogs())
    // routeHandlers.push(new GetWorkLogListHandler())
    // routeHandlers.push(new GetInvoiceReportHandler())
    // routeHandlers.push(new DeleteTaskAttachmentHandler())
    // routeHandlers.push(new GetWorkLogReportHandler())
    // routeHandlers.push(new OverrideTaskClientAssociationMetadataHandler())
    // routeHandlers.push(new CreateSubTaskForTaskClientAssociationHandler())
    // routeHandlers.push(new CreatePriorityTaskHandler())
    // routeHandlers.push(new UpdatePriorityTasksHandler())
    // routeHandlers.push(new GetPriorityTasksHandler())
    // routeHandlers.push(new CreateTaskInvoiceHanlder())
    // routeHandlers.push(new GenerateQRCodeForUPIPaymentHandler())
    // routeHandlers.push(new GetTaskInvoicesHandler())
    // routeHandlers.push(new CreateLeaveApplication())
    // routeHandlers.push(new GetLeaveListHandler())
    // routeHandlers.push(new UpdateLeaveDetailsHandler())
    // routeHandlers.push(new RemovePriorityTasksHandler())
    // routeHandlers.push(new GetInventoryListHandler())
    // routeHandlers.push(new UpdateInventoryHandler())
    // routeHandlers.push(new AddInventoryHandler())
    // routeHandlers.push(new GetToDoTaskListHandler())
    // routeHandlers.push(new UpdateToDoTaskHandler())
    // routeHandlers.push(new AddToDoTaskHandler())
    // routeHandlers.push(new CreateConfiguredDates())
    // routeHandlers.push(new GetLeaveConfigurationHandler)
    // routeHandlers.push(new AddInventoryAuditEventHandler())
    // routeHandlers.push(new GetInventoryEventListHandler())
    // routeHandlers.push(new UpdateConfiguredLeaveDetailsHandler())
    // routeHandlers.push(new SearchSubTaskHandler())
    // routeHandlers.push(new GetNewTaskInvoiceReportHandler())
    // routeHandlers.push(new UserEvaluationReportHandler())
    // routeHandlers.push(new CreateRewardConfiguration())
    // routeHandlers.push(new GetRewardConfigurationHandler())
    // routeHandlers.push(new CreateUserReward())
    // routeHandlers.push(new GetUserRewardHandler())
    return routeHandlers;
}