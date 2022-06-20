import { Router } from "express";
import { getAllPublicTrips, getTripAuthor } from "../../controllers/Trip";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/trips")
	.get(getAllPublicTrips);
	
router.route("/trips/:tripId/author")
	.all(LoadTrip)
	.get(getTripAuthor)
	.all(MethodNotAllowed);

export default router;