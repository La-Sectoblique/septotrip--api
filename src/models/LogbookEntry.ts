import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { LogbookEntryAttributes, LogbookEntryInput } from "../types/models/Logbook";
import { Logbook } from "./Logbook";

export class LogbookEntry extends Model<LogbookEntryAttributes, LogbookEntryInput> implements LogbookEntryAttributes {
	declare title: string;
	declare text?: string | undefined;

	declare logbookId: number;
	declare logbook: NonAttribute<Logbook>;
}

export function init(sequelize: Sequelize): void {
	LogbookEntry.init({
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		logbookId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, 
	{
		sequelize,
		tableName: "LogbookEntry"
	});
}