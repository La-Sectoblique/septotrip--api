import { NextFunction, Request, Response } from "express";
import { Day } from "../../models/Day";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";


export async function LoadDay(request: Request, response: Response, next: NextFunction) {

	const dayId = parseInt(request.params?.dayId);

	if(!dayId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const day = await Day.findByPk(dayId);

	if(!day) {
		next({ message: "No day found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	response.locals.day = day;

	next();
}