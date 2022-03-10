import { Router } from "express";
import { addPoint, getPointsByUser, removePoint, updatePoint } from "../../controllers/Point";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";
import { LoadPoint } from "../../middlewares/PointLoader";

const router = Router();

router.route("/points")
	.get(getPointsByUser)
	.post(addPoint)
	.all(MethodNotAllowed);

router.route("/points/:id")
	.all(LoadPoint)
	.delete(removePoint)
	.put(updatePoint)
	.all(MethodNotAllowed);

export default router;