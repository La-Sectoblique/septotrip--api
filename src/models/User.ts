import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes, UserInput } from "../types/models/User";

export class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    declare email: string;
}

export function init(sequelize: Sequelize): void {
	User.init({
		email: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, 
	{
		sequelize,
		tableName: "User"
	});
}