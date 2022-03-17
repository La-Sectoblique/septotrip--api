import { DataTypes, HasManyGetAssociationsMixin, Model, NonAttribute, Sequelize } from "sequelize";
import { UserAttributes, UserInput } from "../types/models/User";
import { Point } from "./Point";

export class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    declare id: number;
	declare email: string;
	declare hashedPassword: string;

	declare getPoints: HasManyGetAssociationsMixin<Point>;

	declare points: NonAttribute<Point[]>
}

export function init(sequelize: Sequelize): void {
	User.init({
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		hashedPassword: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, 
	{
		sequelize,
		tableName: "User"
	});
}

export function associate(): void {
	User.hasMany(Point, {
		sourceKey: "id",
		foreignKey: "authorId",
		as: "points"
	});
}