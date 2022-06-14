import { NextFunction, Request, Response } from "express";
import { Path } from "../../models/Path";
import { Step } from "../../models/Step";
import { Travelers } from "../../models/Travelers";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";
import UnauthorizedError from "../../types/errors/UnauthorizedError";


export async function LoadPath(request: Request, response: Response, next: NextFunction) {

	const pathId = parseInt(request.params?.pathId);

	if(!pathId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const path = await Path.findByPk(pathId);

	if(!path) {
		next({ message: "No path found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	// user verification
	const step = await Step.findByPk(path.destinationId);

	if(!step)
		throw new Error("Step est vide wtf ?");

	const result = await Travelers.findOne({
		where: {
			TripId: step.tripId,
			UserId: response.locals.user.id
		}
	});

	if(!result) {
		next({ message: "You are not part of this trip", code: 403, name: "UnauthorizedError" } as UnauthorizedError);
		return;
	}

	response.locals.path = path;

	next();
}