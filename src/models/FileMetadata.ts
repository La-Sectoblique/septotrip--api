import { Model, Sequelize, DataTypes } from "sequelize";
import { FileMetadataAttributes, FileMetadataInput, FileType } from "../types/models/File";
import { getEnumValues } from "../types/utils/Enum";
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
	declare fileType: FileType;
	declare visibility: Visibility;
	declare tempFileId?: string;

	declare tripId: number;
	declare pointId?: number | undefined;
	declare stepId?: number | undefined;
	declare pathId?: number | undefined;
}

export function init(sequelize: Sequelize) {
	FileMetadata.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [ 0, 255 ]
			},
		},
		extension: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [ 0, 32 ]
			}
		},
		mimeType: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [ 0, 255 ]
			},
		},
		fileType: {
			type: DataTypes.STRING,
			allowNull: false,
			values: getEnumValues(FileType) as string[]
		},
		tempFileId: {
			type: DataTypes.STRING,
			allowNull: true
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