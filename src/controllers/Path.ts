import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import { FileMetadata } from "../models/FileMetadata";
import { Path } from "../models/Path";
import InvalidBodyError from "../types/errors/InvalidBodyError";

export async function getPathByStep(request: Request, response: Response) {
	const path = await Path.findOne({
		where: {
			destinationId: response.locals.step.id
		}
	});

	response.json(path);
}

export async function updatePath(request: Request, response: Response, next: NextFunction) {

	const path = response.locals.path;
	const newAttributes: Partial<Path> = request.body;

	try {
		await path.update(newAttributes);
	}
	catch(error) {
		if(error instanceof ValidationError)
			return next({ message: error.message, code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		
		return next(error);
	}

	response.json(path);
}

export async function getPathById(request: Request, response: Response) {
	response.json(response.locals.path);
}

export async function getPathFiles(request: Request, response: Response) {
	const path: Path = response.locals.path;

	const files = await FileMetadata.findAll({
		where: {
			pathId: path.id
		}
	});

	response.json(files);
}