import { Sequelize } from "sequelize";
import Loggers from "./Logger";

if(!process.env.POSTGRES_USERNAME || !process.env.POSTGRES_PASSWORD)
	throw new Error("No credentials provided");

if(!process.env.POSTGRES_HOST || !process.env.POSTGRES_PORT)
	throw new Error("No address or port provided");

if(!process.env.POSTGRES_DATABASE) 
	throw new Error("No database provided");

const sequelize = new Sequelize({
	dialect: "postgres",
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	port: Number.parseInt(process.env.POSTGRES_PORT),
	database: process.env.POSTGRES_DATABASE,
	logging: (msg) => Loggers.getLogger("database").debug(msg)
});

export default async function() {
	await sequelize.sync({ alter: true });
}