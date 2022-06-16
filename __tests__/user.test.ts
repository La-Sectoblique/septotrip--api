import "dotenv/config";
import { faker } from "@faker-js/faker";
import Database from "../src/core/Database";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { login, register, me } from "../src/controllers/User";
import { Sequelize } from "sequelize";
import { User } from "../src/models/User";

let sequelize: Sequelize;

const email = faker.internet.email();
const password = faker.internet.password();
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();

beforeAll(async () => {
	sequelize = await Database();
});

describe("Account management", () => {
	const { res, next, mockClear } = getMockRes();

	beforeEach(() => mockClear());

	it("should create an user", async () => {

		// Arrange
		const req = getMockReq({
			body: {
				email,
				password,
				firstName,
				lastName
			}
		});

		// Act
		await register(req, res, next);

		// Assert
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "User created ! Please log in"
			})
		);
	});

	it("should return an 400 error for user creation", async () => {
		// Arrange
		const req = getMockReq({
			body: {
				thing: faker.datatype.string(64)
			}
		});

		// Act
		await register(req, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Invalid request body",
				code: 400,
				name: "InvalidBodyError"
			})
		);
	});

	it("should return an 409 error for user creation", async () => {
		// Arrange
		const req = getMockReq({
			body: {
				email,
				password,
				firstName,
				lastName
			}
		});

		// Act
		await register(req, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "User already exist", 
				code: 409, 
				name: "RessourceAlreadyExistError"
			})
		);
	});

	it("should login", async () => {
		// Arrange
		const req = getMockReq({
			body: {
				email,
				password
			}
		});

		// Act
		await login(req, res, next);

		// Assert
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Logged in", 
				session: expect.objectContaining({
					token: expect.any(String),
					expires: expect.any(Number),
					issued: expect.any(Number) 
				}),
				email
			})
		);
	});

	it("should return an 400 error for user login", async () => {
		// Arrange
		const req = getMockReq({
			body: {
				foo: "bar"
			}
		});

		// Act
		await login(req, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Invalid request body", 
				code: 400, 
				name: "InvalidBodyError"
			})
		);
	});

	it("should return an 404 error for user login (wrong email)", async () => {
		// Arrange
		const req = getMockReq({
			body: {
				email: faker.internet.email(),
				password: faker.internet.password()
			}
		});

		// Act
		await login(req, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Inexistant user", 
				code: 404, 
				name: "InexistantResourceError"
			})
		);
	});

	it("should return an 400 error for user login (wrong password)", async () => {
		// Arrange
		const req = getMockReq({
			body: {
				email,
				password: faker.internet.password()
			}
		});

		// Act
		await login(req, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				code: 400, 
				message: "Invalid password", 
				name: "InvalidPasswordError"
			})
		);
	});

	it("should return logged user informations", async () => {
		// Arrange
		const req = getMockReq();

		const user = await User.findOne({
			where: {
				email,
				firstName,
				lastName
			}
		});

		if(!user)
			throw new Error("Failed to find a user");

		res.locals = {
			session: {
				id: user.id
			}
		};

		// Act
		await me(req, res);

		// Assert
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			})
		);
	});
});

afterAll(async () => {

	await User.destroy({
		where: {
			email
		}
	});
	
	await sequelize.close();
});