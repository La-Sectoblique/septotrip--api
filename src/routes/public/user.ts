import { Router } from "express";
import { register } from "../../controllers/User";
import MethodNotAllowed from "../../middlewares/MethodNotAllowed";

const router = Router();

router.route("/register")
	.post(register)
	.all(MethodNotAllowed);

export default router;