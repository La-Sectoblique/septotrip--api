import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isUserInput } from "../types/models/User";


export async function register(request: Request, response: Response, next: NextFunction): Promise<void> {

	if(!isUserInput(request.body)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
	}
	else {
		const user = await User.create(request.body);
		response.json(user);
		return;
	}
}