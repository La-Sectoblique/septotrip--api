import { NextFunction, Request, Response } from "express";
import { Trip } from "../../models/Trip";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";


export async function LoadTrip(request: Request, response: Response, next: NextFunction) {

	const tripId = request.params?.tripId;

	if(!tripId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const trip = await Trip.findByPk(tripId);

	if(!trip) {
		next({ message: "No trip found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	response.locals.trip = trip;

	next();
}