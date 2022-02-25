import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import RessourceAlreadyExistError from "../types/errors/RessourceAlreadyExistError";
import { UserInput } from "../types/models/User";
import { isCredentials } from "../types/utils/Credentials";
import Hash from "../utils/Hash";


export async function register(request: Request, response: Response, next: NextFunction): Promise<void> {

	if(!isCredentials(request.body)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const existingUser = await User.findOne({
		where: {
			email: request.body.email
		}
	});

	if(existingUser) {
		next({ message: "User already exist", code: 409, name: "RessourceAlreadyExistError" } as RessourceAlreadyExistError);
		return;
	}

	const hasher = new Hash();
	const hashedPassword = hasher.hash(request.body.password);

	const input: UserInput = { 
		email: request.body.email, 
		hashedPassword
	};

	await User.create(input);
	response.json({ message: "User created ! Please log in" });
	return;
}