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