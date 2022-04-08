import "dotenv/config";
import Database from "./core/Database";
import app from "./core/Api";
import FileManagement from "./core/FileManagement";

async function main() {
	await Database();
	FileManagement.get();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const express = app;
}

main();