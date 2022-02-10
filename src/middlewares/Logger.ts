import { Request, Response, NextFunction } from "express";
import Loggers from "../core/Logger";

const logger = Loggers.getLogger("Routes");

export default function loggerMiddleware(request: Request, response: Response, next: NextFunction): void {
	logger.debug(`${request.method} ${request.path}`);
	next();
}