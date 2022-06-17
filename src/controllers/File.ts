import { AWSError, S3 } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { NextFunction, Request, Response } from "express";
import { Blob } from "node:buffer";
import { ValidationError } from "sequelize";
import { Readable } from "stream";
import FileManagement from "../core/FileManagement";
import { FileMetadata } from "../models/FileMetadata";
import { Trip } from "../models/Trip";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { FileMetadataInput, isFileMetadataInput } from "../types/models/File";
import { GenericObjectWithStrings } from "../types/utils/Object";
import { generateTempFileId, getBucketPrefix } from "../utils/File";


export async function uploadFile(request: Request, response: Response, next: NextFunction) {
	const trip: Trip = response.locals.trip;
	const file = request.files?.file;

	if(Array.isArray(file) || file === undefined)
		return next({ message: "Only one file at the time", code: 400, name: "InvalidBodyError" } as InvalidBodyError);

	const metadata: FileMetadataInput = {
		mimeType: file.mimetype,
		tripId: trip.id,
		tempFileId: "",
		...request.body
	};
	
	if(!isFileMetadataInput(metadata))
		return next({ message: "Invalid body error", code: 400, name: "InvalidBodyError" } as InvalidBodyError);
	
	let fileMetadata;

	try {
		fileMetadata = await FileMetadata.create(metadata);
	}
	catch(error) {
		if(error instanceof ValidationError)
			return next({ message: error.message, code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		
		return next(error);
	}

	const bucketPrefix = getBucketPrefix();

	try {
		await FileManagement.get().uploadFile(fileMetadata, `${bucketPrefix}-${trip.id}-${trip.name.replaceAll(" ", "-").toLowerCase()}`, file.data);
	}
	catch(error) {
		return next(error);
	}

	const tempFileId = await generateTempFileId(fileMetadata.id);

	if(tempFileId)
		fileMetadata.tempFileId = tempFileId;

	response.json(fileMetadata);
}

export async function getFileMetadata(request: Request, response: Response) {
	const metadata = response.locals.fileMetadata;

	const tempFileId = await generateTempFileId(metadata.id);

	if(tempFileId)
		metadata.tempFileId = tempFileId;

	response.json(metadata);
}

export async function getFile(request: Request, response: Response, next: NextFunction) {
	const metadata: FileMetadata = response.locals.fileMetadata;
	const trip = await Trip.findByPk(metadata.tripId);

	if(!trip)
		throw new Error("Wtf y'a po de trip");

	const bucketPrefix = getBucketPrefix();

	let res: PromiseResult<S3.GetObjectOutput, AWSError>;
	try {
		res = await FileManagement.get().getFile(metadata.id.toString(), `${bucketPrefix}-${trip.id}-${trip.name.replaceAll(" ", "-").toLowerCase()}`);
	}
	catch(error) {
		return next(error);
	}

	let fileData: Buffer;

	if(res.Body instanceof Blob) {
		fileData = Buffer.from(await res.Body.arrayBuffer());
	}
	else if(res.Body instanceof Readable) {
		fileData = await new Promise((resolve, reject) => {
			
			const bufs: Buffer[] = [];

			(res.Body as Readable).on("data", data => { bufs.push(data); });

			(res.Body as Readable).on("end", () => {
				resolve(Buffer.concat(bufs));
			});

			(res.Body as Readable).on("error", err => {
				reject(err);
			});
		});
	}
	else {
		fileData = Buffer.from(res.Body as Buffer | Uint8Array | string);
	}

	response.setHeader("Content-Type", metadata.mimeType);
	response.setHeader("Content-Length", fileData.length);

	response.status(200).send(fileData);
}

export async function getTripFiles(request: Request, response: Response) {

	const whereQueryObject: GenericObjectWithStrings = {
		tripId: response.locals.trip.id
	};

	if(request.query.type) 
		whereQueryObject.fileType = request.query.type as string;
	if(request.query.step) 
		whereQueryObject.stepId = request.query.step as string;
	if(request.query.path) 
		whereQueryObject.pathId = request.query.path as string;
	if(request.query.point) 
		whereQueryObject.pointId = request.query.point as string;

	const metadatas = await FileMetadata.findAll({
		where: whereQueryObject
	});

	for(let i = 0; i < metadatas.length; i++) {
		const tempFileId = await generateTempFileId(metadatas[i].id);

		if(tempFileId)
			metadatas[i].tempFileId = tempFileId;	
	}

	response.json(metadatas);
}

export async function updateMetadata(request: Request, response: Response, next: NextFunction) {
	const metadata: FileMetadata = response.locals.fileMetadata;
	const newAttributes: Partial<FileMetadata> = request.body;

	if(newAttributes.visibility) {
		newAttributes.tempFileId = "";
	}

	let meta;
	try {
		meta = await metadata.update(newAttributes);
	}
	catch(error) {
		if(error instanceof ValidationError)
			return next({ message: error.message, code: 400, name: "InvalidBodyError" } as InvalidBodyError);
		
		return next(error);
	}

	const tempFileId = await generateTempFileId(meta.id);

	if(tempFileId)
		meta.tempFileId = tempFileId;

	response.json(meta);
}

export async function deleteFile(request: Request, response: Response) {
	const metadata: FileMetadata = response.locals.fileMetadata;
	const trip: Trip = response.locals.trip;
	const bucketPrefix = getBucketPrefix();
	
	await FileManagement.get().deleteFile(metadata.id.toString(), `${bucketPrefix}-${trip.id}-${trip.name.replaceAll(" ", "-").toLowerCase()}`);

	await metadata.destroy();

	response.json({ message: "File deleted" });
}
