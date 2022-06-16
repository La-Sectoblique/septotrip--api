import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
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

	let entry;
	try {
		entry = await LogbookEntry.create(input);
	}
	catch(error) {
		if(error instanceof ValidationError)
			return next({ message: error.message, code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		
		return next(error);
	}

	response.json(entry);
}

export async function getLogbookEntry(request: Request, response: Response) {
	const entry: LogbookEntry = response.locals.entry;

	return response.json(entry);
}

export async function updateLogbookEntry(request: Request, response: Response, next: NextFunction) {

	const entry: LogbookEntry = response.locals.entry;
	const newAttributes: Partial<LogbookEntry> = request.body;

	try {
		await entry.update(newAttributes);
	}
	catch(error) {
		if(error instanceof ValidationError)
			return next({ message: error.message, code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		
		return next(error);
	}

	return response.json(entry);
}

export async function deleteLogbookEntry(request: Request, response: Response) {

	const entry: LogbookEntry = response.locals.entry;

	await entry.destroy();

	response.json({ message: "Entry deleted" });
}