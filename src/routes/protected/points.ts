import { Router } from "express";
import { addPoint, getPointsByTrip, removePoint, updatePoint } from "../../controllers/Point";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";
import { LoadPoint } from "../../middlewares/loaders/PointLoader";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";

const router = Router();

router.route("/trip/:tripId/points")
	.all(LoadTrip)
	.get(getPointsByTrip)
	.post(addPoint)
	.all(MethodNotAllowed);

router.route("/points/:pointId")
	.all(LoadPoint)
	.delete(removePoint)
	.put(updatePoint)
	.all(MethodNotAllowed);

export default router;