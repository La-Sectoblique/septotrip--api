import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { DayAttributes, DayInput } from "../types/models/Day";
import { Step } from "./Step";

export class Day extends Model<DayAttributes, DayInput> implements DayAttributes {
	declare id: number;
	declare number: number;
	declare description: string;

	
	declare stepId: number;
	declare step: NonAttribute<Step>;
}

export function init(sequelize: Sequelize): void {
	Day.init({
		number: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		stepId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		sequelize,
		tableName: "Day"
	});
}