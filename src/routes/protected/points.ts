import { Router } from "express";
import { addPoint, getPointsByUser, removePoint, updatePoint } from "../../controllers/Point";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";
import { LoadPoint } from "../../middlewares/loaders/PointLoader";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";

const router = Router();

router.route("/trips/:tripId/points")
	.all(LoadTrip)
	.get(getPointsByUser)
	.post(addPoint)
	.all(MethodNotAllowed);

router.route("/trips/:tripId/points/:pointId")
	.all(LoadTrip)
	.all(LoadPoint)
	.delete(removePoint)
	.put(updatePoint)
	.all(MethodNotAllowed);

export default router;