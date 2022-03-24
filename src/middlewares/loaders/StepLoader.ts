import { NextFunction, Request, Response } from "express";
import { Step } from "../../models/Step";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";


export async function LoadStep(request: Request, response: Response, next: NextFunction) {

	const stepId = request.params?.stepId;

	if(!stepId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const step = await Step.findByPk(stepId);

	if(!step) {
		next({ message: "No step found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	response.locals.step = step;

	next();
}