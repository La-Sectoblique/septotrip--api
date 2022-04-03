import { DataTypes, Model, Sequelize } from "sequelize";
import { PathAttributes, PathInput } from "../types/models/Path";

export class Path extends Model<PathAttributes, PathInput> implements PathAttributes {
	declare description: string;

}

export function init(sequelize: Sequelize): void {
	Path.init({
		description: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		sequelize,
		tableName: "Path"
	});
}

// export function associate() {
// 	
// }