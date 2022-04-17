import { Router } from "express";
import { deleteSpent, getTripSpents, newSpent, updateSpent } from "../../controllers/Spent";
import { LoadSpent } from "../../middlewares/loaders/SpentLoader";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";


const router = Router();

router.route("/trips/:tripId/spents")
	.all(LoadTrip)
	.get(getTripSpents)
	.post(newSpent)
	.all(MethodNotAllowed);

router.route("/spents/:spentId")
	.all(LoadSpent)
	.put(updateSpent)
	.delete(deleteSpent)
	.all(MethodNotAllowed);

export default router;