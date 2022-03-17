import { NextFunction, Request, Response } from "express";
import { Point } from "../../models/Point";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";


export async function LoadPoint(request: Request, response: Response, next: NextFunction) {

	const pointId = request.params?.id;

	if(!pointId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const point = await Point.findByPk(pointId);

	if(!point) {
		next({ message: "No point found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	response.locals.point = point;

	next();
}