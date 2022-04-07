import { Model, Sequelize, DataTypes } from "sequelize";
import { FileMetadataAttributes, FileMetadataInput } from "../types/models/File";
import { Visibility } from "../types/utils/Visibility";

export class FileMetadata extends Model<FileMetadataAttributes, FileMetadataInput> implements FileMetadataAttributes {
	declare id: string;
	declare name: string;
	declare extension: string;
	declare mimeType: string;
	declare visibility: Visibility;
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
		}
	}, {
		sequelize,
		tableName: "File"
	});
}