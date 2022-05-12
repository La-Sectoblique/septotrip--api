import { Router } from "express";
import { getPathById, getPathByStep, getPathFiles, updatePath } from "../../controllers/Path";
import { getPointsByStep } from "../../controllers/Point";
import { addStep, deleteStep, getSpecificStep, getStepDays, getStepFiles, getTripSteps, updateStep, updateStepOrder } from "../../controllers/Step";
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

router.route("/steps/:stepId/files")
	.all(LoadStep)
	.get(getStepFiles)
	.all(MethodNotAllowed);

router.route("/steps/:stepId/points")
	.all(LoadStep)
	.get(getPointsByStep)
	.all(MethodNotAllowed);

router.route("/steps/:stepId/order")
	.all(LoadStep)
	.put(updateStepOrder)
	.all(MethodNotAllowed);

router.route("/steps/:stepId/days")
	.all(LoadStep)
	.get(getStepDays)
	.all(MethodNotAllowed);

router.route("/steps/:stepId/path")
	.all(LoadStep)
	.get(getPathByStep)
	.all(MethodNotAllowed);

router.route("/paths/:pathId")
	.all(LoadPath)
	.get(getPathById)
	.put(updatePath)
	.all(MethodNotAllowed);

router.route("/paths/:pathId/files")
	.all(LoadPath)
	.get(getPathFiles)
	.all(MethodNotAllowed);
	

export default router;