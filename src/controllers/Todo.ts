import { NextFunction, Request, Response } from "express";
import { TodoEntry } from "../models/TodoEntry";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isTodoEntryInput, TodoEntryInput } from "../types/models/Todo";


export async function getTripTodoList(request: Request, response: Response) {
	response.json(await TodoEntry.findAll({
		where: {
			tripId: response.locals.trip.id
		}
	}));
}

export async function addTodoEntry(request: Request, response: Response, next: NextFunction) {
	const input = {
		tripId: response.locals.trip.id,
		...request.body
	};

	if(!isTodoEntryInput(input)) {
		next({ message: "Invalid body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const entry = await TodoEntry.create(input);

	response.json(entry);
}

export async function getTodoEntryById(request: Request, response: Response) {
	return response.json(response.locals.todoEntry);
}

export async function updateTodoEntry(request: Request, response: Response) {
	const entry: TodoEntry = response.locals.todoEntry;
	const newAttributes: Partial<TodoEntryInput> = request.body;

	await entry.update(newAttributes);

	response.json(entry);
}

export async function deleteTodoEntry(request: Request, response: Response) {
	const todoEntry = response.locals.todoEntry;

	await todoEntry.destroy();

	response.json({ message: "Entry deleted" });
}