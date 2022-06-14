import { NextFunction, Request, Response } from "express";
import { Travelers } from "../../models/Travelers";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";
import UnauthorizedError from "../../types/errors/UnauthorizedError";
import { LogbookEntryOutput } from "../../types/models/Logbook";


export async function LoadLogbookEntry(request: Request, response: Response, next: NextFunction) {

	const logbookEntryId: number | null = parseInt(request.params?.entryId);

	if(!logbookEntryId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const entry = (await response.locals.logbook.getEntries()).find( (entry: LogbookEntryOutput) => entry.id === logbookEntryId);

	if(!entry) {
		next({ message: "No entry found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	// user verification
	const result = await Travelers.findOne({
		where: {
			TripId: entry.tripId,
			UserId: response.locals.user.id
		}
	});

	if(!result) {
		next({ message: "You are not part of this trip", code: 403, name: "UnauthorizedError" } as UnauthorizedError);
		return;
	}

	response.locals.entry = entry;

	next();
}