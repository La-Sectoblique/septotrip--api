import { NextFunction, Request, Response } from "express";
import { Step } from "../../models/Step";
import { Travelers } from "../../models/Travelers";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";
import UnauthorizedError from "../../types/errors/UnauthorizedError";


export async function LoadStep(request: Request, response: Response, next: NextFunction) {

	const stepId = parseInt(request.params?.stepId);

	if(!stepId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const step = await Step.findByPk(stepId);

	if(!step) {
		next({ message: "No step found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	// user verification
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

	response.locals.step = step;

	next();
}