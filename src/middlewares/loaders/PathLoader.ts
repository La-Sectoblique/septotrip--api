import { NextFunction, Request, Response } from "express";
import { Path } from "../../models/Path";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";


export async function LoadPath(request: Request, response: Response, next: NextFunction) {

	const pathId = parseInt(request.params?.pathId);

	if(!pathId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	const path = await Path.findByPk(pathId);

	if(!path) {
		next({ message: "No path found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	response.locals.path = path;

	next();
}