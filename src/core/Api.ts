import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import router from "../routes";
import Loggers from "./Logger";

const whitelist = [
	"septotrip.com",
	"localhost",
	"localhost:3000"
];

const app = express();
app.use(cors({
	exposedHeaders: ["X-Renewed-JWT-Token"],
	origin: whitelist
}));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.listen(process.env.API_PORT ?? 3000, () => Loggers.getLogger("api").info(`Listening to port ${process.env.API_PORT ?? 3000}`));

export default app;