import { Router } from "express";
import { addPoint } from "../../controllers/Point";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/points")
	.post(addPoint)
	.all(MethodNotAllowed);

export default router;