import { Router } from "express";
import { addPoint, getPointsByUser, removePoint, updatePoint } from "../../controllers/Point";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";
import { LoadPoint } from "../../middlewares/loaders/PointLoader";
import { LoadStep } from "../../middlewares/loaders/StepLoader";

const router = Router();

router.route("/steps/:stepId/points")
	.all(LoadStep)
	.get(getPointsByUser)
	.post(addPoint)
	.all(MethodNotAllowed);

router.route("/points/:pointId")
	.all(LoadStep)
	.all(LoadPoint)
	.delete(removePoint)
	.put(updatePoint)
	.all(MethodNotAllowed);

export default router;