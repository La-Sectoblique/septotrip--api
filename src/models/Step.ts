import { DataTypes, HasManyGetAssociationsMixin, Model, NonAttribute, Sequelize } from "sequelize";
import { LocalisationPoint } from "../types/models/Point";
import { StepAttributes, StepInput } from "../types/models/Step";
import { Day } from "./Day";
import { Point } from "./Point";
import { Trip } from "./Trip";

export class Step extends Model<StepAttributes, StepInput> implements StepAttributes {
	declare id: number;
	declare duration: number;
	declare name: string;
	declare order: number;
	declare localisation: LocalisationPoint;

	declare tripId: number;
	declare trip: NonAttribute<Trip>;

	declare days: NonAttribute<Day[]>;
	declare getDays: HasManyGetAssociationsMixin<Day>;

	declare points: NonAttribute<Point[]>;
}

export function init(sequelize: Sequelize): void {
	Step.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [ 0, 255 ]
			}
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 0
			}
		},
		localisation: {
			type: DataTypes.GEOMETRY("POINT"),
			allowNull: false
		},
		tripId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1
			}
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
		as: "points",
	});

	Step.hasMany(Day, {
		sourceKey: "id",
		foreignKey: "stepId",
		as: "days",
		onDelete: "cascade"
	});
}