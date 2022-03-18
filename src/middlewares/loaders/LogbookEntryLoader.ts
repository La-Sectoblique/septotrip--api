import { NextFunction, Request, Response } from "express";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";
import { LogbookEntryOutput } from "../../types/models/Logbook";


export async function LoadLogbookEntry(request: Request, response: Response, next: NextFunction) {

	const logbookEntryId = parseInt(request.params?.entryId);

	if(!logbookEntryId || Number.isNaN(logbookEntryId)) {
		next({ message: "No id or invalid id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const entry = (await response.locals.logbook.getEntries()).find( (entry: LogbookEntryOutput) => entry.id === logbookEntryId);

	if(!entry) {
		next({ message: "No entry found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	response.locals.entry = entry;

	next();
}