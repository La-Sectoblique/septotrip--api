import { Request, Response, NextFunction } from "express";
import { Trip } from "../models/Trip";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import UnauthorizedError from "../types/errors/UnauthorizedError";
import { isTripInput } from "../types/models/Trip";
import { isVisibility } from "../types/utils/Visibility";

export async function createTrip(request: Request, response: Response, next: NextFunction) {

	const input = {
		authorId: response.locals.session.id,
		...request.body
	};

	if(!isTripInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const logbook = await Trip.create(input);

	response.json(logbook);
}

export async function getAllTripsCreatedByUser(request: Request, response: Response) {

	const authorId = response.locals.session.id;

	const trips = await Trip.findAll({
		where: {
			authorId
		}
	});

	response.json(trips);
}

export async function getAllPublicTrips(request: Request, response: Response) {
	const trips = await Trip.findAll({
		where: {
			visibility: "public"
		}
	});

	response.json(trips);
}

export async function getSpecificTrip(request: Request, response: Response) {
	response.json(response.locals.trip);
}

export async function updateTrip(request: Request, response: Response, next: NextFunction) {

	const trip: Trip = response.locals.trip;
	const newAttributes: Partial<Trip> = request.body;

	if(newAttributes.visibility && !isVisibility(newAttributes.visibility)) {
		next({ message: "Invalid visibility", code: 404, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	await trip.update(newAttributes);

	response.json(trip);
}

export async function deleteTrip(request: Request, response: Response, next: NextFunction) {
	const trip: Trip = response.locals.trip;

	const userId = response.locals.session.id;

	if(userId !== trip.authorId) {
		next({ code: 403, message: "Missing permission", name: "UnauthorizedError" } as UnauthorizedError);
		return;
	}
	
	await trip.destroy();

	response.json({ message: "Trip deleted" });
}
