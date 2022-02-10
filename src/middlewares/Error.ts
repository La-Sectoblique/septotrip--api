import { NextFunction, Request, Response } from "express";
import ApiError from "../types/errors/ApiError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ErrorMiddleware( error: ApiError,  request : Request, response: Response, next: NextFunction) {
	response.status(error.code ?? 500).json({ message: error.message });
}