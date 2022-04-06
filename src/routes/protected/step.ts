import { Router } from "express";
import { getPathById, getPathByStepDestination, getPathByStepOrigin, updatePath } from "../../controllers/Path";
import { getPointsByStep } from "../../controllers/Point";
import { addStep, deleteStep, getSpecificStep, getStepDays, getTripSteps, updateStep } from "../../controllers/Step";
import { LoadPath } from "../../middlewares/loaders/PathLoader";
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

router.route("/steps/:stepId/days")
	.all(LoadStep)
	.get(getStepDays)
	.all(MethodNotAllowed);

router.route("/steps/:stepId/path/before")
	.all(LoadStep)
	.get(getPathByStepDestination)
	.all(MethodNotAllowed);

router.route("/steps/:stepId/path/after")
	.all(LoadStep)
	.get(getPathByStepOrigin)
	.all(MethodNotAllowed);

router.route("/paths/:pathId")
	.all(LoadPath)
	.get(getPathById)
	.put(updatePath)
	.all(MethodNotAllowed);

export default router;