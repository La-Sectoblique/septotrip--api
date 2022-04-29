import { DataTypes, Model, Sequelize } from "sequelize";
import { TodoEntryAttributes, TodoEntryInput, TodoState } from "../types/models/Todo";
import { getEnumValues } from "../types/utils/Enum";
import { Path } from "./Path";
import { Point } from "./Point";
import { Step } from "./Step";
import { Trip } from "./Trip";


export class TodoEntry extends Model<TodoEntryAttributes, TodoEntryInput> implements TodoEntryAttributes {
	declare title: string;
	declare state: TodoState;
	declare tripId: number;
	declare description?: string | undefined;
	declare executionDate?: Date | undefined;
	declare pointId?: number | undefined;
	declare stepId?: number | undefined;
	declare pathId?: number | undefined;
	
}

export function init(sequelize: Sequelize) {
	TodoEntry.init({
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		state: {
			type: DataTypes.STRING,
			allowNull: false,
			values: getEnumValues(TodoState)
		},
		tripId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		executionDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		pointId: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		stepId: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		pathId: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		sequelize,
		tableName: "TodoEntry"
	});
}

export function associate() {
	TodoEntry.belongsTo(Trip, {
		foreignKey: "tripId",
		targetKey: "id",
		as: "trip"
	});

	TodoEntry.belongsTo(Point, {
		foreignKey: "pointId",
		targetKey: "id",
		as: "target"
	});

	TodoEntry.belongsTo(Step, {
		foreignKey: "stepId",
		targetKey: "id",
		as: "step"
	});

	TodoEntry.belongsTo(Path, {
		foreignKey: "pathId",
		targetKey: "id",
		as: "path"
	});
}