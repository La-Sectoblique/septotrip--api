import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { LocalisationPoint, PointAttributes, PointInput } from "../types/models/Point";
import { User } from "./User";

export class Point extends Model<PointAttributes, PointInput> implements PointAttributes {
	declare title: string;
	declare description?: string | undefined;
	declare localisation: LocalisationPoint;


	declare authorId: number;
	declare author: NonAttribute<User>;
}

export function init(sequelize: Sequelize): void {
	Point.init({
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		localisation: {
			type: DataTypes.GEOMETRY("POINT"),
			allowNull: false
		},
		authorId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		}
	}, 
	{
		sequelize,
		tableName: "Point"
	});
}