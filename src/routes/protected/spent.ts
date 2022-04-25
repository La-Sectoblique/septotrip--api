import { Router } from "express";
import { deleteSpent, getBeneficiaries, getTripSpents, newSpent, updateBeneficiaries, updateSpent, getSpentById } from "../../controllers/Spent";
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
	.get(getSpentById)
	.put(updateSpent)
	.delete(deleteSpent)
	.all(MethodNotAllowed);

router.route("/spents/:spentId/beneficiaries")
	.all(LoadSpent)
	.get(getBeneficiaries)
	.put(updateBeneficiaries)
	.all(MethodNotAllowed);

export default router;