import { S3, Credentials, AWSError } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { FileMetadata } from "../models/FileMetadata";
import Loggers from "./Logger";

export default class FileManagement {

	private static instance: FileManagement | null = null;

	private S3: S3;

	private constructor() {

		if(!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
			throw new Error("No S3 credentials provided");
		}

		if(!process.env.S3_ENDPOINT) {
			throw new Error("No endpoint provided");
		}

		this.S3 = new S3({
			endpoint: process.env.S3_ENDPOINT,
			sslEnabled: process.env.S3_ENDPOINT.startsWith("https://"),
			credentials: new Credentials({
				accessKeyId: process.env.S3_ACCESS_KEY_ID,
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
			}),
			s3ForcePathStyle: true
		});

		Loggers.getLogger("S3").info("S3 connected");
	}

	public static get(): FileManagement {
		if(FileManagement.instance  === null) {
			FileManagement.instance = new FileManagement();
		}

		return FileManagement.instance;
	}

	public async createBucketIfNotExist(bucketName: string) {
		const response = await this.S3.listBuckets().promise();

		if(!response.Buckets || !response.Buckets.find( bucket => bucket.Name === bucketName )) {
			await this.S3.createBucket({
				Bucket: bucketName
			}).promise();
		}
	}

	public async getFile(key: string, bucket: string): Promise<PromiseResult<S3.GetObjectOutput, AWSError>> {
		return this.S3.getObject({
			Bucket: bucket,
			Key: key
		}).promise();
	}

	public async uploadFile(metadata: FileMetadata, bucket: string, data: Buffer, ) {
		return this.S3.upload({
			Bucket: bucket,
			Key: metadata.id.toString(),
			Body: data,
			ContentType: metadata.mimeType			
		}).promise();
	}

	public async deleteFile(id: string, bucket: string) {
		return this.S3.deleteObject({
			Bucket: bucket,
			Key: id
		}).promise();
	}
}