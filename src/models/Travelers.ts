import { Sequelize, Model, DataTypes } from "sequelize";
import { CommonAttributes } from "../types/models/Common";

export class Travelers extends Model implements CommonAttributes{
	declare id: number;

	declare TripId: number;
	declare UserId: number;

	declare createdAt?: Date | undefined;
	declare updatedAt?: Date | undefined;
}

export function init(sequelize: Sequelize): void {
	Travelers.init({
		TripId: {
			type: DataTypes.NUMBER,
			allowNull: false
		},
		UserId: {
			type: DataTypes.NUMBER,
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: "Travelers"
	});
}