import { Request, Response } from "express";
import { DayInput } from "../types/models/Day";



export async function getDayByID(request: Request, response: Response) {
	return response.json(response.locals.day);
}

export async function updateDay(request: Request, response: Response) {
	const day = response.locals.day;
	const newAttributes: Partial<DayInput> = request.body;

	await day.update(newAttributes);

	return response.json(day);
}