import { NextFunction, Request, Response } from "express";
import { Logbook } from "../models/Logbook";
import { LogbookEntry } from "../models/LogbookEntry";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isLogbookEntryInput, isLogbookInput } from "../types/models/Logbook";

export async function getUserLogbooks(request: Request, response: Response) {

	const logbooks = await Logbook.findAll({
		where: {
			authorId: response.locals.session.id
		}
	});

	response.json(logbooks);
}

export async function newLogbook(request: Request, response: Response, next: NextFunction) {
	const input = {
		authorId: response.locals.session.id,
		...request.body
	};

	if(!isLogbookInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const logbook = await Logbook.create(input);

	response.json(logbook);
}

export async function getLogbookById(request: Request, response: Response) {
	const logbook: Logbook = response.locals.logbook;

	return response.json(logbook);
}

export async function updateLogbook(request: Request, response: Response) {

	const logbook: Logbook = response.locals.logbook;
	const newAttributes: Partial<Logbook> = request.body;

	await logbook.update(newAttributes);

	return response.json(logbook);
}

export async function addEntryToLogbook(request: Request, response: Response, next: NextFunction) {
	const input = {
		logbookId: response.locals.logbook.id,
		...request.body
	};

	if(!isLogbookEntryInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const entry = await LogbookEntry.create(input);

	response.json(entry);
}

export async function getLogbookEntries(request: Request, response: Response) {
	const entries = await LogbookEntry.findAll({
		where: {
			logbookId: response.locals.logbook.id
		}
	});

	response.json(entries);
}