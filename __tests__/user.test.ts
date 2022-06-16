import "dotenv/config";
import { server } from "../src/core/Api";
import Database from "../src/core/Database";
import request from "supertest";

describe("User endpoints", () => {

	jest.setTimeout(40 * 1000);

	const validEmail = "test@septotrip.com";
	// const invalidEmail = "test";
	
	const validName = "Maurice";
	// const invalidName = "Maurice".repeat(100);

	const validPassword = "password";

	beforeAll(async () => {
		await Database();
	});

	it("should create a new user", async () => {

		const res = await request(server)
			.post("/register")
			.send({
				email: validEmail,
				password: validPassword,
				firstName: validName,
				lastName: validName
			});
		
		expect(res.statusCode).toEqual(200);	
	});
});

afterAll(() => {
	server.close();
});