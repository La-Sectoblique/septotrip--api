import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { StepAttributes, StepInput } from "../types/models/Step";
import { Point } from "./Point";
import { Trip } from "./Trip";

export class Step extends Model<StepAttributes, StepInput> implements StepAttributes {
	declare name: string;
	declare order: number;

	declare tripId: number;
	declare trip: NonAttribute<Trip>;

	declare points: NonAttribute<Point[]>;
}

export function init(sequelize: Sequelize): void {
	Step.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		tripId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		sequelize,
		tableName: "Step"
	});
}

export function associate() {
	Step.hasMany(Point, {
		sourceKey: "id",
		foreignKey: "stepId",
		as: "points"
	});

}