import { NextFunction, Request, Response } from "express";
import { Point } from "../models/Point";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isPointInput } from "../types/models/Point";

export async function getPointsByUser(request: Request, response: Response, next: NextFunction) {

	const points = await Point.findAll({
		where: {
			authorId: response.locals.session.id
		}
	});

	response.json(points);
}

export async function addPoint(request: Request, response: Response, next: NextFunction) {

	const input = {
		authorId: response.locals.session.id,
		...request.body
	};

	if(!isPointInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const point = await Point.create(input);

	response.json(point);
}