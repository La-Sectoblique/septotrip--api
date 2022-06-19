import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import Loggers from "./Logger";

const MODEL_FOLDER = path.join(__dirname, "..", "models");

const isDev = process.env.NODE_ENV !== "production";

if(!process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD)
	throw new Error("No credentials provided");

if(!process.env.POSTGRES_HOST || !process.env.POSTGRES_PORT)
	throw new Error("No address or port provided");

if(!process.env.POSTGRES_DB) 
	throw new Error("No database provided");

const database = process.env.NODE_ENV === "test" ? `test-${process.env.POSTGRES_DB}` : process.env.POSTGRES_DB;

const sequelize = new Sequelize({
	dialect: "postgres",
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	port: Number.parseInt(process.env.POSTGRES_PORT),
	database,
	logging: (msg) => Loggers.getLogger("database").debug(msg)
});

export default async function() {

	const models = fs.readdirSync(MODEL_FOLDER).filter(filename => !filename.endsWith(".map"));

	// initialisation
	for(const modelFile of models) {
		const { init } = await import(path.join(MODEL_FOLDER, modelFile));
		init(sequelize);
	}

	// associations
	for(const modelFile of models) {
		const { associate } = await import(path.join(MODEL_FOLDER, modelFile));
		
		if(!associate) continue;

		associate();
	}

	return sequelize.sync({ alter: isDev, force: isDev });
}