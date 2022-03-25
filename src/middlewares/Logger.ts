import { Request, Response, NextFunction } from "express";
import Loggers from "../core/Logger";

const logger = Loggers.getLogger("Routes");

export default function loggerMiddleware(request: Request, response: Response, next: NextFunction): void {
	logger.info(`${request.method} ${request.path}`);
	next();
}