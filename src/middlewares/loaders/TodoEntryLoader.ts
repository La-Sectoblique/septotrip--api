import { NextFunction, Request, Response } from "express";
import { TodoEntry } from "../../models/TodoEntry";
import { Travelers } from "../../models/Travelers";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";
import UnauthorizedError from "../../types/errors/UnauthorizedError";


export async function LoadTodoEntry(request: Request, response: Response, next: NextFunction) {

	const todoEntryId = parseInt(request.params?.todoEntryId);

	if(!todoEntryId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const todoEntry = await TodoEntry.findByPk(todoEntryId);

	if(!todoEntry) {
		next({ message: "No todoEntry found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	// user verification
	const result = await Travelers.findOne({
		where: {
			TripId: todoEntry.tripId,
			UserId: response.locals.user.id
		}
	});

	if(!result) {
		next({ message: "You are not part of this trip", code: 403, name: "UnauthorizedError" } as UnauthorizedError);
		return;
	}

	response.locals.todoEntry = todoEntry;

	next();
}