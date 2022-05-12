import { NextFunction, Request, Response } from "express";
import { Point } from "../models/Point";
import InexistantResourceError from "../types/errors/InexistantResourceError";
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

export async function getDaysByPoint(request: Request, response: Response) {
	return response.json( await (response.locals.point as Point).getDays() );
}

export async function updatePointDays(request: Request, response: Response, next: NextFunction) {

	const newDayIds: number[] = request.body;
	const point: Point = response.locals.point;

	const days = await point.getDays();

	const daysToRemove = days.filter( d => !newDayIds.includes(d.id) );
	const daysToAdd = newDayIds.filter( id => !days.map( d => d.id ).includes(id) );

	try {
		await point.removeDays(daysToRemove);
		await point.addDays(daysToAdd);
	}
	catch(error) {
		return next({ message: "One id is invalid", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
	}

	return response.json(await point.getDays());
}