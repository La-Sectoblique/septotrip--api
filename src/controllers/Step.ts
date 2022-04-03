import { NextFunction, Request, Response } from "express";
import { Day } from "../models/Day";
import { Step } from "../models/Step";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isStepInput, StepOutput } from "../types/models/Step";


export async function addStep(request: Request, response: Response, next: NextFunction) {

	const input = {
		tripId: response.locals.trip.id,
		...request.body
	};

	if(!isStepInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	const step: StepOutput = await Step.create(input);

	for(let i = 0; i < step.duration; i++) {
		await Day.create({
			number: i + 1,
			stepId: step.id
		});
	}

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

export async function getStepDays(request: Request, response: Response) {
	response.json(await response.locals.step.getDays());
}

export async function updateStep(request: Request, response: Response) {
	let step: Step = response.locals.step;
	const newAttributes: Partial<Step> = request.body;

	step = await step.update(newAttributes);

	// if we add or remove some days
	if(newAttributes.duration) {
		const days = await step.getDays({
			order: [
				[ "number", "ASC" ]
			]
		});

		if(days.length > newAttributes.duration) {
			for(let i = newAttributes.duration; i < days.length; i++) {
				await days[i].destroy();
			}
		}
		else if(days.length < newAttributes.duration) {
			for(let i = days.length; i < newAttributes.duration; i++) {
				await Day.create({
					number: i + 1,
					stepId: step.id
				});
			}
		}
	}

	response.json(step);
}

export async function deleteStep(request: Request, response: Response) {
	const step: Step = response.locals.step;

	await step.destroy();

	response.json({ message: "Step deleted" });
}