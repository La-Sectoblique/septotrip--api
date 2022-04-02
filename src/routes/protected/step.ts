import { Router } from "express";
import { getPointsByStep } from "../../controllers/Point";
import { addStep, deleteStep, getSpecificStep, getTripSteps, updateStep } from "../../controllers/Step";
import { LoadStep } from "../../middlewares/loaders/StepLoader";
import { LoadTrip } from "../../middlewares/loaders/TripLoader";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";


const router = Router();

router.route("/trips/:tripId/steps")
	.all(LoadTrip)
	.get(getTripSteps)
	.post(addStep)
	.all(MethodNotAllowed);

router.route("/steps/:stepId")
	.all(LoadStep)
	.get(getSpecificStep)
	.put(updateStep)
	.delete(deleteStep)
	.all(MethodNotAllowed);

router.route("/steps/:stepId/points")
	.all(LoadStep)
	.get(getPointsByStep)
	.all(MethodNotAllowed);

export default router;