import { NextFunction, Request, Response } from "express";
import { Day } from "../models/Day";
import { FileMetadata } from "../models/FileMetadata";
import { Path } from "../models/Path";
import { Point } from "../models/Point";
import { Step } from "../models/Step";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isStepInput, StepOutput } from "../types/models/Step";


export async function addStep(request: Request, response: Response, next: NextFunction) {

	const steps = await response.locals.trip.getSteps();

	const input = {
		tripId: response.locals.trip.id,
		order: steps.length + 1,
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
			stepId: step.id,
			description: ""
		});
	}

	if(step.order > 1) {
		const path = await Path.create({
			description: "",
			destinationId: step.id
		});

		const originStep = await Step.findOne({
			where: {
				order: step.order - 1
			}
		});

		if(!originStep) throw new Error("Wtf ya probleme");

		await originStep.update({ pathId: path.id });
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

	// we avoid making the "order" property modifiable by hand
	newAttributes.order = step.order;

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

				const points = await Point.findAll({
					where: {
						dayId: days[i].id
					}
				});

				points.forEach( async p => await p.update({ dayId: undefined }) );

				await days[i].destroy();
			}
		}
		else if(days.length < newAttributes.duration) {
			for(let i = days.length; i < newAttributes.duration; i++) {
				await Day.create({
					number: i + 1,
					stepId: step.id,
					description: ""
				});
			}
		}
	}

	response.json(step);
}

export async function deleteStep(request: Request, response: Response) {
	const step: Step = response.locals.step;
	let nextStepId: number | undefined = undefined;

	// si l'étape mène a une autre étape, on récupère l'id du prochain step, et on suppr le voyage 
	if(step.pathId) {
		const pathWithStepForOrigin = await Path.findByPk(step.pathId);
		
		if(!pathWithStepForOrigin)
			throw new Error("Bizar, le pathId est kc");

		nextStepId = pathWithStepForOrigin.destinationId;

		await pathWithStepForOrigin.destroy();
	}

	// si un chemin mène a cette étape, on update l'id de la destination 
	const pathWithStepForDestination = await Path.findOne({ 
		where: {
			destinationId: step.id
		}
	});

	if(pathWithStepForDestination) {
		await pathWithStepForDestination.update({ destinationId: nextStepId });
	}

	await step.destroy();
	
	// on update l'ordre de chaque step
	const steps = await Step.findAll({
		where: {
			tripId: step.tripId
		},
		order: [
			[ "order", "ASC" ]
		]
	});

	for(let i = 0; i < await steps.length; i++) {
		await steps[i].update({ order: i + 1 });
	}

	response.json({ message: "Step deleted" });
}

export async function getStepFiles(request: Request, response: Response) {
	const step: Step = response.locals.step;

	const files = await FileMetadata.findAll({
		where: {
			stepId: step.id
		}
	});

	response.json(files);
}