import { LogMessageTypes,Context } from "./shared/enums/logging/general";
import cors from 'cors';
import express from 'express';
import correlator from 'express-correlation-id';
import morgan from 'morgan';
import {registerRoutes} from './routing/routes';
require('./shared/db/mongoose/mongooseShema')
import { Logger } from "./shared/utilities/logging/logger";
// import { authenticateJWT } from "./middlewares";
// import {LogMessageTypes,Context} from "./shared/enums";
const app = express();
app.use(cors());
app.use(correlator());
app.use(express.json());
app.use('/health', (req, res) => { res.status(200).send() });
// app.use(authenticateJWT);
registerRoutes(app);
const port = process.env.PORT || 8000;

app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms'));

app.listen(port, () => {
  const logger = new Logger({context: Context.SERVER, functionName:'app.listen',  
  correlationId: Date.now().toString()});
  logger.log({
  message: `N-OMS backend is running on port ${port}.`,
  type: LogMessageTypes.SERVER_STARTED,
});
});