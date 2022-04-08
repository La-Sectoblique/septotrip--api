import { Model, Sequelize, DataTypes } from "sequelize";
import { FileMetadataAttributes, FileMetadataInput } from "../types/models/File";
import { Visibility } from "../types/utils/Visibility";
import { Path } from "./Path";
import { Point } from "./Point";
import { Step } from "./Step";
import { Trip } from "./Trip";

export class FileMetadata extends Model<FileMetadataAttributes, FileMetadataInput> implements FileMetadataAttributes {

	declare id: string;
	declare name: string;
	declare extension: string;
	declare mimeType: string;
	declare visibility: Visibility;

	declare tripId: number;
	declare pointId?: number | undefined;
	declare stepId?: number | undefined;
	declare pathId?: number | undefined;
}

export function init(sequelize: Sequelize) {
	FileMetadata.init({
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		extension: {
			type: DataTypes.STRING,
			allowNull: false
		},
		mimeType: {
			type: DataTypes.STRING,
			allowNull: false
		},
		visibility: {
			type: DataTypes.STRING,
			values: [ "public", "private" ],
			allowNull: false
		},
		tripId: {
			type: DataTypes.INTEGER,
			allowNull: false
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
		tableName: "FileMetadata"
	});
}

export function associate(): void {
	FileMetadata.belongsTo(Trip, {
		foreignKey: "tripId",
		targetKey: "id",
		as: "trip"
	});

	FileMetadata.belongsTo(Point, {
		foreignKey: "pointId",
		targetKey: "id",
		as: "target"
	});

	FileMetadata.belongsTo(Step, {
		foreignKey: "stepId",
		targetKey: "id",
		as: "step"
	});

	FileMetadata.belongsTo(Path, {
		foreignKey: "pathId",
		targetKey: "id",
		as: "path"
	});
}