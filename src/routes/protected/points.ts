import { Router } from "express";
import { addPoint, getPointsByUser } from "../../controllers/Point";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/points")
	.get(getPointsByUser)
	.post(addPoint)
	.all(MethodNotAllowed);

export default router;