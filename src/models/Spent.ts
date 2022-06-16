import { BelongsToGetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin, DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./User";
import { SpentAttributes, SpentCategory, SpentInput } from "../types/models/Spent";
import { getEnumValues } from "../types/utils/Enum";


export class Spent extends Model<SpentAttributes, SpentInput> implements SpentAttributes {
	declare tripId: number;
	declare comment: string | undefined;
	declare category: SpentCategory;
	declare amount: number;
	
	declare authorId: number;

	// beneficiaries
	declare getUsers: BelongsToManyGetAssociationsMixin<User>;
	declare addUser: BelongsToManyAddAssociationMixin<User, number>;
	declare getUser: BelongsToGetAssociationMixin<User>;
	declare removeUser: BelongsToManyRemoveAssociationMixin<User, number>;
}

export function init(sequelize: Sequelize) {
	Spent.init({
		amount: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "OTHER",
			values: getEnumValues(SpentCategory)
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		tripId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		sequelize,
		tableName: "Spent",
	});
}

export function associate() {
	Spent.belongsTo(User, {
		foreignKey: "authorId",
		targetKey: "id",
		as: "author"
	});

	Spent.belongsToMany(User, {
		through: "Beneficiaries"
	});
}