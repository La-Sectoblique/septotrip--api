import { BelongsToGetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { DayAttributes, DayInput } from "../types/models/Day";
import { Point } from "./Point";
import { Step } from "./Step";

export class Day extends Model<DayAttributes, DayInput> implements DayAttributes {
	declare id: number;
	declare number: number;
	declare description?: string;
	
	declare stepId: number;
	declare step: NonAttribute<Step>;

	declare getPoints: BelongsToManyGetAssociationsMixin<Point>;
	declare addPoint: BelongsToManyAddAssociationMixin<Point, number>;
	declare getPoint: BelongsToGetAssociationMixin<Point>;
	declare removePoint: BelongsToManyRemoveAssociationMixin<Point, number>;
	declare removePoints: BelongsToManyRemoveAssociationsMixin<Point, number>;
}

export function init(sequelize: Sequelize): void {
	Day.init({
		number: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		stepId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		sequelize,
		tableName: "Day"
	});
}

export function associate() {
	Day.belongsToMany(Point, {
		through: "Visit"
	});
}