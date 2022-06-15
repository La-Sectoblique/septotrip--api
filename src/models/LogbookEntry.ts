import { DataTypes, Model, Sequelize } from "sequelize";
import { LogbookEntryAttributes, LogbookEntryInput } from "../types/models/Logbook";
import { Trip } from "./Trip";
import { User } from "./User";

export class LogbookEntry extends Model<LogbookEntryAttributes, LogbookEntryInput> implements LogbookEntryAttributes {
	declare title: string;
	declare text?: string | undefined;
	declare authorId: number;
	declare tripId: number;
}

export function init(sequelize: Sequelize): void {
	LogbookEntry.init({
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [ 0, 233 ]
			}
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		tripId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, 
	{
		sequelize,
		tableName: "LogbookEntry"
	});
}

export function associate() {
	LogbookEntry.belongsTo(User,{
		foreignKey: "authorId",
		targetKey: "id",
		as: "author"
	});

	LogbookEntry.belongsTo(Trip, {
		foreignKey: "tripId",
		targetKey: "id",
		as: "trip"
	});
}