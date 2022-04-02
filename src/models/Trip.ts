import { BelongsToGetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin, DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { TripAttributes, TripInput } from "../types/models/Trip";
import { Visibility } from "../types/utils/Visibility";
import { Point } from "./Point";
import { Step } from "./Step";
import { User } from "./User";


export class Trip extends Model<TripAttributes, TripInput> implements TripAttributes {
	declare id: number;
	declare name: string;
	declare visibility: Visibility;
	declare startDate?: Date | undefined;
	declare endDate?: Date | undefined;

	declare getUsers: BelongsToManyGetAssociationsMixin<User>;
	declare addUser: BelongsToManyAddAssociationMixin<User, number>;
	declare getUser: BelongsToGetAssociationMixin<User>;
	declare removeUser: BelongsToManyRemoveAssociationMixin<User, number>;

	declare authorId: number;
	declare author: NonAttribute<User>; 

	declare steps: NonAttribute<Step[]>;
	declare points: NonAttribute<Point[]>;
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
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: true
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

	Trip.hasMany(Step, {
		sourceKey: "id",
		foreignKey: "tripId",
		as: "steps"
	});

	Trip.hasMany(Point, {
		sourceKey: "id",
		foreignKey: "tripId",
		as: "points"
	});
}