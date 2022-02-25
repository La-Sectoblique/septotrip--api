import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import router from "../routes";
import NotFoundMiddleware from "../middlewares/NotFound";
import ErrorMiddleware from "../middlewares/Error";
import Loggers from "./Logger";

const app = express();
app.use(cors({
	exposedHeaders: ["X-Renewed-JWT-Token"]
}));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.use(NotFoundMiddleware);
app.use(ErrorMiddleware);

app.listen(process.env.API_PORT ?? 3000, () => Loggers.getLogger("api").info(`Listening to port ${process.env.API_PORT ?? 3000}`));

export default app;