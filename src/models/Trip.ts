import { BelongsToManyGetAssociationsMixin, DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { TripAttributes, TripInput } from "../types/models/Trip";
import { Visibility } from "../types/utils/Visibility";
import { User } from "./User";


export class Trip extends Model<TripAttributes, TripInput> implements TripAttributes {
	declare name: string;
	declare visibility: Visibility;

	declare getTravelers: BelongsToManyGetAssociationsMixin<User>;

	declare authorId: number;
	declare author: NonAttribute<User>;
}

export function init(sequelize: Sequelize): void {
	Trip.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		visibility: {
			type: DataTypes.STRING,
			allowNull: false
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		sequelize,
		tableName: "Trip"
	});
}

export function associate() {
	Trip.belongsToMany(User, { 
		through: "Travelers",
	});
}