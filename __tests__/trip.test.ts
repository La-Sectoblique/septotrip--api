import "dotenv/config";
import { faker } from "@faker-js/faker";
import Database from "../src/core/Database";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { createTrip, deleteTrip, getAllPublicTrips, getUserTrips, updateTrip, addingMemberToTrip, removeMemberFromTrip } from "../src/controllers/Trip";
import { register } from "../src/controllers/User";
import { Sequelize } from "sequelize";
import { User } from "../src/models/User";
import { Trip } from "../src/models/Trip";

let sequelize: Sequelize;

const email = faker.internet.email();
const password = faker.internet.password();
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();

const newUserEmail = faker.internet.email();

let user: User;
let trip: Trip;

let name = faker.address.country();

beforeAll(async () => {
	sequelize = await Database();

	// create a user
	const req = getMockReq({
		body: {
			email,
			password,
			firstName,
			lastName
		}
	});

	const { res, next, mockClear } = getMockRes();

	await register(req, res, next);

	const result = await User.findOne({
		where: {
			email,
			firstName,
			lastName
		}
	});

	if(!result) throw new Error("User not found");

	user = result;

	mockClear();
});

describe("Trip management", () => {

	const { res, next, mockClear } = getMockRes();

	beforeEach(() => mockClear());

	it("should return the list of all public trips (0)", async () => {
		// Arrange
		const req = getMockReq();

		// Act
		await getAllPublicTrips(req, res);

		// Assert
		expect(res.json).toHaveBeenCalledWith([]);
	});

	it("should create a trip", async () => {
		// Arrange
		res.locals = {
			user: {
				id: user.id
			}
		};

		const req = getMockReq({
			body: {
				name,
				visibility: "public"
			}
		});

		// Act
		await createTrip(req, res, next);

		// Assert
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				id: expect.any(Number),
				name,
				visibility: "public"
			})
		);

		const result = await Trip.findOne({
			where: {
				name
			}
		});

		if(!result) throw new Error("Unable to find trip");

		trip = result;
	});

	it("should return an 400 error for trip creation", async () => {
		// Arrange
		const req = getMockReq({
			body: {
				foo: "bar"
			}
		});

		// Act
		await createTrip(req, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Invalid request body",
				code: 400,
				name: "InvalidBodyError"
			})
		);
	});

	it("should return the list of all public trips (1)", async () => {
		// Arrange
		const req = getMockReq();

		// Act
		await getAllPublicTrips(req, res);

		// Assert
		expect(res.json).toBeCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(Number),
					name,
					visibility: "public"
				})
			])
		);
	});

	it("should return the list of all user trips (1)", async () => {
		// Arrange
		const req = getMockReq();

		res.locals = {
			user
		};

		// Act
		await getUserTrips(req, res);

		// Assert
		expect(res.json).toBeCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(Number),
					name,
					visibility: "public"
				})
			])
		);
	});

	it("should return a modified version of the previously created trip", async () => {
		// Arrange
		const trip = await Trip.findOne({
			where: {
				name
			}
		});

		if(!trip) throw new Error("Unable to fetch trip");

		res.locals.trip = trip;

		name = faker.address.country();
		const req = getMockReq({
			body: {
				name
			}
		});
	
		// Act
		await updateTrip(req, res, next);
		
		// Assert
		expect(res.json).toBeCalledWith(
			expect.objectContaining({
				id: trip.id,
				name,
				visibility: "public"
			})
		);
	});

	it("should return an 400 error for trip modification", async () => {
		// Arrange
		const trip = await Trip.findOne({
			where: {
				name
			}
		});

		if(!trip) throw new Error("Unable to fetch trip");

		res.locals.trip = trip;

		const req = getMockReq({
			body: {
				visibility: "foo"
			}
		});
	
		// Act
		await updateTrip(req, res, next);
		
		// Assert
		expect(next).toBeCalledWith(
			expect.objectContaining({ 
				message: "Invalid visibility", 
				code: 400, 
				name: "InvalidBodyError" 
			})
		);
	});

	it("should delete a trip", async () => {
		// Arrange
		const req = getMockReq();
		res.locals.trip = trip;

		// Act
		await deleteTrip(req, res);

		// Assert
		expect(res.json).toBeCalledWith(
			expect.objectContaining({
				message: "Trip deleted" 
			})
		);
	});

	it("should add new member to the trip", async () => {
		// Arrange
		const reqUsr = getMockReq({
			body: {
				email: newUserEmail,
				password: faker.internet.password(),
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName()
			}
		});
		await register(reqUsr, res, next);

		const req = getMockReq({
			body: {
				email: newUserEmail
			}
		});

		res.locals.trip = trip;

		// Act
		await addingMemberToTrip(req, res, next);

		// Arrange
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "User added to trip"
			})
		);

		console.log(await trip.getUsers());
	});

	it("should return an 404 error for adding member", async () => {
		// Arrange
		const req = getMockReq({
			body: {
				email: faker.internet.email()
			}
		});

		res.locals.trip = trip;

		// Act
		await addingMemberToTrip(req, res, next);

		// Arrange
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "No user found", 
				code: 404, 
				name: "InexistantResourceError"
			})
		);
	});

	it("should return an 400 error for adding member", async () => {
		// Arrange
		const req = getMockReq({
			body: {
				foo: "bar"
			}
		});

		res.locals.trip = trip;

		// Act
		await addingMemberToTrip(req, res, next);

		// Arrange
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "No email provided", 
				code: 400, 
				name: "InvalidBodyError"
			})
		);
	});

	it("should remove member from trip", async () => {
		// Arrange
		const usr  = await User.findOne({
			where: {
				email: newUserEmail
			}
		});

		if(!usr) throw new Error("Unable to find user");

		const req = getMockReq({
			params: {
				userId: usr.id.toString()
			}
		});

		res.locals.trip = trip;

		// Act
		await removeMemberFromTrip(req, res, next);

		// Assert
		expect(next).not.toBeCalled();

		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "User removed from trip"
			})
		);
	});

	it("should return an 404 error for removing member", async () => {
		// Arrange
		const req = getMockReq({
			params: {
				userId: faker.datatype.number().toString()
			}
		});

		res.locals.trip = trip;

		// Act
		await removeMemberFromTrip(req, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "This user is not in the trip", 
				code: 404, 
				name: "InexistantResourceError"
			})
		);
	});

	it("should return an 400 error for removing member", async () => {
		// Arrange
		const req = getMockReq({
			params: {
				foo: "bar"
			}
		});

		res.locals.trip = trip;

		// Act
		await removeMemberFromTrip(req, res, next);

		// Assert
		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "No user id provided", 
				code: 400, 
				name: "NoIdProvidedError"
			})
		);
	});
});

afterAll(async () => {

	await user.destroy();

	await sequelize.close();
});