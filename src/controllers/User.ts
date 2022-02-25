import { NextFunction, Request, Response } from "express";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isUserInput } from "../types/models/User";


export async function register(request: Request, response: Response, next: NextFunction): Promise<void> {

	if(!isUserInput(request.body)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
	}
	else {
		console.log(request.body);
	}
}