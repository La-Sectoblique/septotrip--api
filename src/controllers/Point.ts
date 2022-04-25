import { NextFunction, Request, Response } from "express";
import { Day } from "../models/Day";
import { FileMetadata } from "../models/FileMetadata";
import { Point } from "../models/Point";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isPointInput } from "../types/models/Point";

export async function getPointsByTrip(request: Request, response: Response) {
	const points = await Point.findAll({
		where: {
			tripId: response.locals.trip.id
		}
	});

	response.json(points);
}

export async function getPointsByStep(request: Request, response: Response) {
	const points = await Point.findAll({
		where: {
			stepId: response.locals.step.id
		}
	});

	response.json(points);
}

export async function getPointsByDay(request: Request, response: Response) {
	const points = await Point.findAll({
		where: {
			dayId: response.locals.day.id
		}
	});

	response.json(points);
}

export async function addPoint(request: Request, response: Response, next: NextFunction) {

	const input = {
		authorId: response.locals.session.id,
		tripId: response.locals.trip.id,
		...request.body
	};

	if(!isPointInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	if(input.dayId && !(await Day.findByPk(input.dayId))) {
		next({ message: "Invalid day id", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const point = await Point.create(input);

	response.json(point);
}

export async function removePoint(request: Request, response: Response) {

	const point = response.locals.point;

	await point.destroy();

	response.json({ message: "Point deleted" });
}

export async function updatePoint(request: Request, response: Response) {
	
	const point: Point = response.locals.point;
	const newAttributes: Partial<Point> = request.body;

	await point.update(newAttributes);

	return response.json(point);
}

export async function getPointFiles(request: Request, response: Response) {
	const point: Point = response.locals.point;

	const files = await FileMetadata.findAll({
		where: {
			pointId: point.id
		}
	});

	response.json(files);
}