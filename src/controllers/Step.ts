import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import { Day } from "../models/Day";
import { FileMetadata } from "../models/FileMetadata";
import { Path } from "../models/Path";
import { Step } from "../models/Step";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { isStepInput } from "../types/models/Step";
import { moveItemInArray } from "../utils/Array";


export async function addStep(request: Request, response: Response, next: NextFunction) {

	const steps = await Step.findAll({
		where: {
			tripId: response.locals.trip.id
		}
	});

	const input = {
		tripId: response.locals.trip.id,
		order: steps.length,
		...request.body
	};

	if(!isStepInput(input)) {
		next({ message: "Invalid request body", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		return;
	}

	let step;

	try {
		step = await Step.create(input);
	}
	catch(error) {
		if(error instanceof ValidationError)
			return next({ message: error.message, code: 400, name: "InvalidBodyError" } as InvalidBodyError);

		return next(error);
	}

	for(let i = 0; i < step.duration; i++) {
		await Day.create({
			number: i + 1,
			stepId: step.id
		});
	}

	try {
		await Path.create({
			destinationId: step.id
		});
	}
	catch(error) {
		return next(error);
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

export async function updateStep(request: Request, response: Response, next: NextFunction) {
	let step: Step = response.locals.step;
	const newAttributes: Partial<Step> = request.body;

	// we avoid making the "order" property modifiable by hand
	newAttributes.order = step.order;

	try {
		step = await step.update(newAttributes);
	}
	catch(error) {
		if(error instanceof ValidationError)
			return next({ message: error.message, code: 400, name: "InvalidBodyError" } as InvalidBodyError);

		return next(error);
	}


	// if we add or remove some days
	if(newAttributes.duration) {
		const days = await step.getDays({
			order: [
				[ "number", "ASC" ]
			]
		});

		if(days.length > newAttributes.duration) {
			for(let i = newAttributes.duration; i < days.length; i++) {
				await days[i].removePoints();
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

	// delete step path
	await Path.destroy({
		where: {
			destinationId: step.id
		}
	});

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
		await steps[i].update({ order: i });
	}

	// create all missing paths
	for(const s of steps) {
		const path = await Path.findOne({
			where: {
				destinationId: s.id
			}
		});
	
		if(path) continue;

		await Path.create({ destinationId: s.id });
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

export async function updateStepOrder(request: Request, response: Response) {
	const step: Step = response.locals.step;
	const newOrder: number = request.body.newOrder;

	// get all steps
	const steps = await Step.findAll({
		where: {
			tripId: step.tripId
		},
		order: [
			[ "order", "ASC" ]
		]
	});

	// change order
	moveItemInArray(
		steps, 
		steps.findIndex( s => s.id === step.id ),
		newOrder
	);

	// create all missing paths
	for(let i = 0; i < steps.length; i++) {

		const path = await Path.findOne({
			where: {
				destinationId: steps[i].id
			}
		});

		await steps[i].update({ order: i });

		if(path) continue;

		await Path.create({ destinationId: steps[i].id });
	}

	response.json(steps);
}