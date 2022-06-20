import { NextFunction, Request, Response } from "express";
import { Trip } from "../../models/Trip";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";
import UnauthorizedError from "../../types/errors/UnauthorizedError";


export async function LoadTrip(request: Request, response: Response, next: NextFunction) {

	const tripId = parseInt(request.params?.tripId);

	if(!tripId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const trip = await Trip.findByPk(tripId);

	if(!trip) {
		next({ message: "No trip found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	// user verification
	const userTrips = await response.locals.user.getTrips();

	if( response.locals.user && !userTrips.map( (trip: Trip) => trip.id).includes(tripId)) {
		next({ message: "You are not part of this trip", code: 403, name: "UnauthorizedError" } as UnauthorizedError);
		return;
	}

	response.locals.trip = trip;

	next();
}