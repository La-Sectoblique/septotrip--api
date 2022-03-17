import { NextFunction, Request, Response } from "express";
import { Logbook } from "../models/Logbook";
import { User } from "../models/User";
import InexistantResourceError from "../types/errors/InexistantResourceError";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import InvalidPasswordError from "../types/errors/InvalidPasswordError";
import RessourceAlreadyExistError from "../types/errors/RessourceAlreadyExistError";
import { UserInput } from "../types/models/User";
import { isCredentials } from "../types/utils/Credentials";
import Hash from "../utils/Hash";
import { encodeSession } from "../utils/Token";


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

	const user = await User.create(input);
	response.json({ message: "User created ! Please log in" });

	await Logbook.create({
		name: "Votre journal",
		authorId: user.id
	});

	return;
}

export async function login(request: Request, response: Response, next: NextFunction): Promise<void> {

	if(!isCredentials(request.body)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const existingUser = await User.findOne({
		where: {
			email: request.body.email
		}
	});

	if(!existingUser) {
		next({ message: "Inexistant user", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	const hasher = new Hash();

	if(!hasher.compare(request.body.password, existingUser.hashedPassword)) {
		next({ code: 400, message: "Invalid password", name: "InvalidPasswordError" } as InvalidPasswordError);
		return;
	}

	const session = encodeSession({
		id: existingUser.id,
		username: existingUser.email,
		dateCreated: Date.now()
	});

	response.status(200).json({ message: "Logged in", session, email: existingUser.email });
}
