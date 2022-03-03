import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes, UserInput } from "../types/models/User";

export class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    declare id: number;
	declare email: string;
	declare hashedPassword: string;
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