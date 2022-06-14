import { NextFunction, Request, Response } from "express";
import { Point } from "../../models/Point";
import { Travelers } from "../../models/Travelers";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";
import UnauthorizedError from "../../types/errors/UnauthorizedError";


export async function LoadPoint(request: Request, response: Response, next: NextFunction) {

	const pointId = parseInt(request.params?.pointId);

	if(!pointId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const point = await Point.findByPk(pointId);

	if(!point) {
		next({ message: "No point found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	// user verification
	const result = await Travelers.findOne({
		where: {
			TripId: point.tripId,
			UserId: response.locals.user.id
		}
	});

	if(!result) {
		next({ message: "You are not part of this trip", code: 403, name: "UnauthorizedError" } as UnauthorizedError);
		return;
	}

	response.locals.point = point;

	next();
}