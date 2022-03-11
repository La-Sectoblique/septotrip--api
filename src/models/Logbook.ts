import { DataTypes, HasManyGetAssociationsMixin, Model, NonAttribute, Sequelize } from "sequelize";
import { LogbookAttributes, LogbookInput } from "../types/models/Logbook";
import { LogbookEntry } from "./LogbookEntry";
import { User } from "./User";

export class Logbook extends Model<LogbookAttributes, LogbookInput> implements LogbookAttributes {
	declare name: string;

	declare authorId: number;
	declare author: NonAttribute<User>; 

	declare entries: NonAttribute<LogbookEntry[]>;

	declare getEntries: HasManyGetAssociationsMixin<LogbookEntry>;
}

export function init(sequelize: Sequelize): void {
	Logbook.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, 
	{
		sequelize,
		tableName: "Logbook"
	});
}

export function associate(): void {
	Logbook.hasMany(LogbookEntry, {
		sourceKey: "id",
		foreignKey: "logbookId",
		as: "entries"
	});
}