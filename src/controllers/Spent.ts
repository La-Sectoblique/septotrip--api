import { NextFunction, Request, Response } from "express";
import { Spent } from "../models/Spent";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isSpentInput, SpentInput } from "../types/models/Spent";

export async function newSpent(request: Request, response: Response, next: NextFunction) {
	const input: SpentInput = {
		tripId: response.locals.trip.id,
		...request.body
	};

	if(!isSpentInput(input))
		return next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);

	const spent = await Spent.create(input);

	for(const beneficiaryId of request.body.beneficiaries) {
		await spent.addUser(beneficiaryId);
	}

	response.json(spent);
}

export async function getTripSpents(request: Request, response: Response) {
	response.json(await Spent.findAll({
		where: {
			tripId: response.locals.trip.id
		}
	}));
}

export async function getSpentById(request: Request, response: Response) {
	response.json(response.locals.spent);
}

export async function updateSpent(request: Request, response: Response) {
	const spent: Spent = response.locals.spent;
	const newAttributes: Partial<SpentInput> = request.body;

	await spent.update(newAttributes);

	response.json(spent);
}

export async function updateBeneficiaries(request: Request, response: Response) {
	const spent: Spent = response.locals.spent;
	const newBeneficiaries: number[] = request.body;

	const beneficiaries = await spent.getUsers();
	
	for(const id of newBeneficiaries) {
		if(!beneficiaries.find( b => b.id === id )) {
			await spent.addUser(id);
		}
	}

	const oldbenefs = beneficiaries.filter( b => !newBeneficiaries.includes(b.id));

	for(const oldbenef of oldbenefs) {
		await spent.removeUser(oldbenef);
	}

	response.json(await spent.getUsers());
}

export async function getBeneficiaries(request: Request, response: Response) {
	response.json(await response.locals.spent.getUsers());
}

export async function deleteSpent(request: Request, response: Response) {
	await response.locals.spent.destroy();

	response.json({ message: "Spent deleted" });
}	