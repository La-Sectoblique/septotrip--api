import "dotenv/config";
import Database from "./core/Database";
import app from "./core/Api";

async function main() {
	await Database();
	const express = app;
}

main();