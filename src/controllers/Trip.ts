import { Request, Response, NextFunction } from "express";
import FileManagement from "../core/FileManagement";
import { Trip } from "../models/Trip";
import { User } from "../models/User";
import InexistantResourceError from "../types/errors/InexistantResourceError";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import NoIdProvidedError from "../types/errors/NoIdProvidedError";
import { isTripInput } from "../types/models/Trip";
import { UserAttributes } from "../types/models/User";
import { isVisibility } from "../types/utils/Visibility";

export async function createTrip(request: Request, response: Response, next: NextFunction) {

	const input = {
		authorId: response.locals.user.id,
		...request.body
	};

	if(!isTripInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const trip = await Trip.create(input);
	const user = await User.findByPk(trip.authorId);

	if(!user) throw new Error("No user wtf");
	
	trip.addUser(user);

	await FileManagement.get().createBucketIfNotExist(`${process.env.NODE_ENV === "production" ? "prod" : "dev"}-${trip.id}-${trip.name.replaceAll(" ", "-").toLowerCase()}`);

	response.json(trip);
}

export async function getAllPublicTrips(request: Request, response: Response) {
	const trips = await Trip.findAll({
		where: {
			visibility: "public"
		}
	});

	response.json(trips);
}

export async function getUserTrips(request: Request, response: Response) {

	const trips = await response.locals.user.getTrips();

	response.json(trips);
}

export async function getSpecificTrip(request: Request, response: Response) {
	response.json(response.locals.trip);
}

export async function updateTrip(request: Request, response: Response, next: NextFunction) {

	const trip: Trip = response.locals.trip;
	const newAttributes: Partial<Trip> = request.body;

	if(newAttributes.visibility && !isVisibility(newAttributes.visibility)) {
		next({ message: "Invalid visibility", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	await trip.update(newAttributes);

	response.json(trip);
}

export async function deleteTrip(request: Request, response: Response) {
	const trip: Trip = response.locals.trip;

	await trip.destroy();

	response.json({ message: "Trip deleted" });
}

export async function getTripUsers(request: Request, response: Response) {
	response.json(await (response.locals.trip as Trip).getUsers({
		attributes: {
			exclude: ["hashedPassword"]
		}
	}));
}

export async function addingMemberToTrip(request: Request, response: Response, next: NextFunction) {

	const trip: Trip = response.locals.trip;

	const arg: Partial<UserAttributes> = request.body;

	if(!arg.email) {
		next({ message: "No email provided", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const newTraveler: User | null = await User.findOne({
		where: {
			email: arg.email
		}
	});

	if(!newTraveler) {
		next({ message: "No user found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	try {
		await trip.addUser(newTraveler);
	}
	catch(error) {
		console.error(error);
		throw error;
	}

	response.json({ message: "User added to trip" });
}

export async function removeMemberFromTrip(request: Request, response: Response, next: NextFunction) {

	const trip: Trip = response.locals.trip;

	const userId = request.params?.userId;

	if(!userId) {
		next({ message: "No user id provided", code: 400, name: "NoIdProvidedError"} as NoIdProvidedError);
		return;
	}

	if(!(await trip.getUsers()).find(usr => usr.id === parseInt(userId))) {

		next({ message: "This user is not in the trip", code: 404, name: "InexistantResourceError"} as InexistantResourceError);
		return;
	}

	await trip.removeUser(parseInt(userId));

	response.json({ message: "User removed from trip" });
}