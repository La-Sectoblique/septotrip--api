import { NextFunction, Request, Response } from "express";
import { Logbook } from "../../models/Logbook";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";


export async function LoadLogbook(request: Request, response: Response, next: NextFunction) {

	const logbookId = parseInt(request.params?.logbookId);

	if(!logbookId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const logbook = await Logbook.findByPk(logbookId);

	if(!logbook) {
		next({ message: "No logbook found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	response.locals.logbook = logbook;

	next();
}