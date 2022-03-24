import { NextFunction, Request, Response } from "express";
import { Step } from "../models/Step";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isStepInput } from "../types/models/Step";


export async function addStep(request: Request, response: Response, next: NextFunction) {

	const input = {
		tripId: response.locals.trip.id,
		...request.body
	};

	if(!isStepInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const step = await Step.create(input);

	response.json(step);
}

export async function getTripSteps(request: Request, response: Response) {

	const steps = await Step.findAll({
		where: {
			tripId: response.locals.trip.id,
		},
		order: [
			[ "order", "ASC" ]
		]
	});

	response.json(steps);
}

export async function getSpecificStep(request: Request, response: Response) {
	response.json(response.locals.step);
}

export async function updateStep(request: Request, response: Response) {
	const step: Step = response.locals.step;
	const newAttributes: Partial<Step> = request.body;

	await step.update(newAttributes);

	response.json(step);
}

export async function deleteStep(request: Request, response: Response) {
	const step: Step = response.locals.step;

	await step.destroy();

	response.json({ message: "Step deleted" });
}