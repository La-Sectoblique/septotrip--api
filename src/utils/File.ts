import { v4 } from "uuid";
import Loggers from "../core/Logger";
import { FileMetadata } from "../models/FileMetadata";
import { GenericObjectWithStrings } from "../types/utils/Object";

export const prefix: GenericObjectWithStrings = {
	"production": "prod",
	"test": "test",
	"development": "dev"
};

export function getBucketPrefix(): string {
	if(!process.env.NODE_ENV || typeof process.env.NODE_ENV !== "string")
		throw new Error("Invalid environment value for NODE_ENV");

	return prefix[process.env.NODE_ENV];
}

export async function generateTempFileId(fileId: string): Promise<string | undefined> {
	const file = await FileMetadata.findByPk(fileId);
	if(!file)	
		return undefined;

	if(file.tempFileId)
		return file.tempFileId;

	const tempId: string = v4();

	await file.update({ tempFileId: tempId });

	if(file.visibility !== "public") {
		setTimeout(async () => {
			await file.update({ tempFileId: "" });
			Loggers.getLogger("FileManager").debug("Lien temporaire supprimé");
		}, 60 * 1000);
	}

	return tempId;
}


export function slugify(text: string): string {
	return text.replace(/\s|_|\(|\)/g, "-")
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();
}
