import { NextFunction, Request, Response } from "express";
import { Blob } from "node:buffer";
import { Readable } from "stream";
import { v4 } from "uuid";
import FileManagement from "../core/FileManagement";
import { FileMetadata } from "../models/FileMetadata";
import { Trip } from "../models/Trip";
import InvalidBodyError from "../types/errors/InvalidBodyError";
import { FileMetadataInput, isFileMetadataInput } from "../types/models/File";
import { getBucketPrefix } from "../utils/File";


export async function uploadFile(request: Request, response: Response, next: NextFunction) {
	const trip: Trip = response.locals.trip;
	const files = request.files?.file;

	if(Array.isArray(files) || files === undefined)
		return next({ message: "Only one file at the time", code: 400, name: "InvalidBodyError" } as InvalidBodyError);

	const metadata: FileMetadataInput = {
		id: v4(),
		mimeType: files.mimetype,
		tripId: trip.id,
		...request.body
	};
	
	if(!isFileMetadataInput(metadata))
		return next({ message: "Invalid body error", code: 400, name: "InvalidBodyError" } as InvalidBodyError);

	const fileMetadata = await FileMetadata.create(metadata);

	const bucketPrefix = getBucketPrefix();

	await FileManagement.get().uploadFile(fileMetadata, `${bucketPrefix}-${trip.id}-${trip.name.replaceAll(" ", "-").toLowerCase()}`, files.data);

	response.json(fileMetadata);
}

export async function getFile(request: Request, response: Response) {
	const trip: Trip = response.locals.trip;
	const metadata = response.locals.fileMetada;
	const bucketPrefix = getBucketPrefix();

	const res = await FileManagement.get().getFile(metadata.id, `${bucketPrefix}-${trip.id}-${trip.name.replaceAll(" ", "-").toLowerCase()}`);

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

export async function updateMetadata(request: Request, response: Response) {
	const metadata: FileMetadata = response.locals.fileMetadata;
	const newAttributes: Partial<FileMetadata> = request.body;

	const meta = await metadata.update(newAttributes);

	response.json(meta);
}

export async function deleteFile(request: Request, response: Response) {
	const metadata: FileMetadata = response.locals.fileMetada;
	const trip: Trip = response.locals.trip;
	const bucketPrefix = getBucketPrefix();
	
	await FileManagement.get().deleteFile(metadata.id, `${bucketPrefix}-${trip.id}-${trip.name.replaceAll(" ", "-").toLowerCase()}`);

	await FileMetadata.destroy();

	response.json({ message: "File deleted" });
}