import { NextFunction, Request, Response } from "express";
import { Spent } from "../../models/Spent";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";


export async function LoadSpent(request: Request, response: Response, next: NextFunction) {

	const spentId = parseInt(request.params?.spentId);

	if(!spentId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const spent = await Spent.findByPk(spentId);

	if(!spent) {
		next({ message: "No spent found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	response.locals.spent = spent;

	next();
}