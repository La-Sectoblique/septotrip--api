import { NextFunction, Request, Response } from "express";
import { LogbookEntry } from "../models/LogbookEntry";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isLogbookEntryInput } from "../types/models/Logbook";

export async function getTripLogbookEntries(request: Request, response: Response) {
	const entries = await LogbookEntry.findAll({
		where: {
			tripId: response.locals.trip.id,
		}
	});

	response.json(entries);
}

export async function addEntryToLogbook(request: Request, response: Response, next: NextFunction) {
	const input = {
		tripId: response.locals.trip.id,
		...request.body
	};

	if(!isLogbookEntryInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const entry = await LogbookEntry.create(input);

	response.json(entry);
}

export async function getLogbookEntry(request: Request, response: Response) {
	const entry: LogbookEntry = response.locals.entry;

	return response.json(entry);
}

export async function updateLogbookEntry(request: Request, response: Response) {

	const entry: LogbookEntry = response.locals.entry;
	const newAttributes: Partial<LogbookEntry> = request.body;

	await entry.update(newAttributes);

	return response.json(entry);
}

export async function deleteLogbookEntry(request: Request, response: Response) {

	const entry: LogbookEntry = response.locals.entry;

	await entry.destroy();

	response.json({ message: "Entry deleted" });
}