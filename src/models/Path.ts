import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { PathAttributes, PathInput } from "../types/models/Path";
import { Step } from "./Step";

export class Path extends Model<PathAttributes, PathInput> implements PathAttributes {
	declare id: number;
	
	declare description?: string;

	declare destinationId: number;
	declare destination: NonAttribute<Step>;
}

export function init(sequelize: Sequelize): void {
	Path.init({
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		destinationId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		sequelize,
		tableName: "Path"
	});
}

export function associate() {
	Path.belongsTo(Step, {
		foreignKey: "destinationId",
		targetKey: "id",
		as: "destination",
		onDelete: "cascade"
	});
}