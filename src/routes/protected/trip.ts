import { Router } from "express";
import { getFile, uploadFile } from "../../controllers/File";
import { createTrip, deleteTrip, updateTrip, getSpecificTrip, getTripUsers, addingMemberToTrip, removeMemberFromTrip, getUserTrips } from "../../controllers/Trip";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/trips")
	.post(createTrip)
	.all(MethodNotAllowed);

router.route("/trips/me")
	.get(getUserTrips)
	.all(MethodNotAllowed);

router.route("/trips/:tripId")
	.all(LoadTrip)
	.get(getSpecificTrip)
	.put(updateTrip)
	.delete(deleteTrip)
	.all(MethodNotAllowed);

router.route("/trips/:tripId/users")
	.all(LoadTrip)
	.get(getTripUsers)
	.post(addingMemberToTrip)
	.all(MethodNotAllowed);
	
router.route("/trips/:tripId/users/:userId")
	.all(LoadTrip)
	.delete(removeMemberFromTrip)
	.all(MethodNotAllowed);

router.route("/trips/:tripId/file")
	.all(LoadTrip)
	.post(uploadFile)
	.all(MethodNotAllowed);

router.route("/trips/:tripId/file/:id")
	.all(LoadTrip)
	.get(getFile)
	.all(MethodNotAllowed);

export default router;