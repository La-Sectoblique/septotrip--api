import { Router } from "express";
import { addPoint, getPointFiles, getPointsByTrip, removePoint, updatePoint } from "../../controllers/Point";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";
import { LoadPoint } from "../../middlewares/loaders/PointLoader";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";

const router = Router();

router.route("/trips/:tripId/points")
	.all(LoadTrip)
	.get(getPointsByTrip)
	.post(addPoint)
	.all(MethodNotAllowed);

router.route("/points/:pointId")
	.all(LoadPoint)
	.delete(removePoint)
	.put(updatePoint)
	.all(MethodNotAllowed);

router.route("/points/:pointId/files")
	.all(LoadPoint)
	.get(getPointFiles)
	.all(MethodNotAllowed);

export default router;