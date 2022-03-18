import { NextFunction, Request, Response } from "express";
import { Point } from "../models/Point";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isPointInput } from "../types/models/Point";

export async function getPointsByUser(request: Request, response: Response) {

	const points = await Point.findAll({
		where: {
			tripId: response.locals.trip.id,
			authorId: response.locals.session.id
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