import { Router } from "express";
import { createTrip, deleteTrip, updateTrip, getSpecificTrip, getTripUsers, addingMemberToTrip, removeMemberFromTrip } from "../../controllers/Trip";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/trips")
	.post(createTrip)
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


export default router;