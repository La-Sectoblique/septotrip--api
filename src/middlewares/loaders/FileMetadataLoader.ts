import { NextFunction, Request, Response } from "express";
import { FileMetadata } from "../../models/FileMetadata";
import { Travelers } from "../../models/Travelers";
import InexistantResourceError from "../../types/errors/InexistantResourceError";
import NoIdProvidedError from "../../types/errors/NoIdProvidedError";
import UnauthorizedError from "../../types/errors/UnauthorizedError";


export async function LoadFileMetadata(request: Request, response: Response, next: NextFunction) {

	const fileId = parseInt(request.params?.fileId);
	const fileTempId = request.params?.fileTempId;

	if(!fileId && !fileTempId) {
		next({ message: "No id provided", code: 400, name: "NoIdProvidedError" } as NoIdProvidedError);
		return;
	}

	let fileMetadata;
	
	if(fileId) {
		fileMetadata = await FileMetadata.findByPk(fileId);
	} 
	else if(fileTempId) {
		fileMetadata = await FileMetadata.findOne({
			where: {
				tempFileId: fileTempId
			}
		});
	}

	if(!fileMetadata) {
		next({ message: "No fileMetada found", code: 404, name: "InexistantResourceError" } as InexistantResourceError);
		return;
	}

	if(fileMetadata.visibility !== "public" && response.locals.user) {

		// user verification
		const result = await Travelers.findOne({
			where: {
				TripId: fileMetadata.tripId,
				UserId: response.locals.user.id
			}
		});
	
		if(!result) {
			next({ message: "You are not part of this trip", code: 403, name: "UnauthorizedError" } as UnauthorizedError);
			return;
		}
	}

	response.locals.fileMetadata = fileMetadata;

	next();
}