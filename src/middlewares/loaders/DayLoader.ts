import { NextFunction, Request, Response } from "express";
import { Day } from "../../models/Day";
import { Step } from "../../models/Step";
import { Travelers } from "../../models/Travelers";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";
import UnauthorizedError from "../../types/errors/UnauthorizedError";


export async function LoadDay(request: Request, response: Response, next: NextFunction) {

	const dayId = parseInt(request.params?.dayId);

	if(!dayId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const day = await Day.findByPk(dayId);

	if(!day) {
		next({ message: "No day found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	// user verification
	const step = await Step.findByPk(day.stepId);

	if(!step)
		throw new Error("?");

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
	
	response.locals.day = day;

	next();
}