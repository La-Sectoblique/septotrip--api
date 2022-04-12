import { Request, Response } from "express";
import { FileMetadata } from "../models/FileMetadata";
import { Path } from "../models/Path";


export async function getPathByStepOrigin(request: Request, response: Response) {

	const path = await Path.findByPk(response.locals.step.pathId);

	response.json(path);
}

export async function getPathByStepDestination(request: Request, response: Response) {
	const path = await Path.findOne({
		where: {
			destinationId: response.locals.step.id
		}
	});

	response.json(path);
}

export async function updatePath(request: Request, response: Response) {

	const path = response.locals.path;
	const newAttributes: Partial<Path> = request.body;

	await path.update(newAttributes);

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